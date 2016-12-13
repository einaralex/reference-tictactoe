var _ = require('lodash');



module.exports = function (injected) {

    return function (history) {

        var isGameFull = false;

        var currentSide = '';

        var countSigns = {};
        var boardSize = 9;
        var board = [];

        // telur fjöldann af merkjum í listanum. t.d. x:3, o:2
        board.forEach(
            function(x) {
                countSigns[x] = (countSigns[x] || 0)+1;
            });

        console.log(countSigns)

        function processEvent(event) {
            if(event.type==="GameJoined"){
                isGameFull=true
            }
            //console.log(event)
            console.log("Event type: " +  event.type + "Placement: " + event.placement);
            console.log("Board: " + board);
            console.log("____________________________");

            if(event.type==="MovePlaced"){
                currentSide = event.side;

                //check if the picked square is occupied, if not then add the sign to the board
                if (!slotOccupied(event.placement)){
                    board[event.placement] = event.side;
                }
                console.log("Board placement after insert: " + board[event.placement] + " at " + event.placement)

            }
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull() {
            return isGameFull;
        }

        function slotOccupied(thisPlacement) {
            return board[thisPlacement] != undefined;
        }

        function gameWon() {

            // Checks for winning combinations
            for (var i = 1; i <= boardSize; i++){
                // Horizontal
                if (board[i] == board[i+1] && board[i] == board[i+2] && board[i] != undefined) {
                    return true;
                }
                //Vertical
                if (board[i] == board[i+3] && board[i] == board[i+6] && board[i] != undefined) {
                    return true;
                }
            }
            // Diagonal: from top left to bottom right
            if (board[1] == board[5] && board[1] == board[9] && board[1] != undefined) {
                return true;
            }
            // Diagonal: from bottom left to top right
            if (board[3] == board[5] && board[3] == board[7] && board[3] != undefined) {
                return true;
            }

            return false;
        }
        function gameDraw() {


            // counts all the non-undefined values
            var currentSizeOfBoard = board.filter(function(i) { return i !== undefined}).length;

            return currentSizeOfBoard == boardSize
        }

        function checkTurn(thisSide) {
            return currentSide == thisSide
        }
        processEvents(history);

        return {
            checkTurn: checkTurn,
            slotOccupied: slotOccupied,
            gameWon: gameWon,
            gameDraw: gameDraw,
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};
