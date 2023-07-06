import { io } from 'socket.io-client';
import { rotate, convertToBoard, convertPlayers } from './utils';
import { reactive } from 'vue';
import { useGameStore } from '../../stores/game';



const apiURL = 'https://yonin-shogi.s1091026.repl.co/game'; // TODO
export const socket = io(apiURL);

socket.on('update', (res) => {
    const { viewer, currentPlayer,board, players } = useGameStore()
    Object.assign(board, convertToBoard(res[0], viewer.id));
    Object.assign(players, convertPlayers(res[1], viewer.id));
    currentPlayer.facing = (res[2] - viewer.id + 4) % 4
    // for (let i = 0; i < 4;++i)
        // piecesInHand[(viewer.id-i+4)%4] = res[1][i]
    // res[1].forEach((pieces, index) => piecesInHand[(viewer.id-index+4)%4] = pieces)
});

export function move(origin, destination, promotion) {
    const { viewer } = useGameStore();
    socket.emit('move', [
        rotate(origin, [4, 4], viewer.id),
        rotate(destination, [4, 4], viewer.id),
        promotion
    ]);
}

export function drop(destination, pieceType) {
    const { viewer } = useGameStore();
    socket.emit('drop', [
        rotate(destination, [4, 4], viewer.id),
        pieceType
    ]);
}

/*
[
    [Chess ... {type:Number, owner:Number}],
    [Player ... { id:Number, piecesInHand:[count_type_0, count_type_1 ...] } ]
]
*/
