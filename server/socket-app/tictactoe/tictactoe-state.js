var _ = require('lodash');

var countSigns = {}
var boardSize = 8
var board = []

module.exports = function (injected) {

    return function (history) {

        var gamefullIndicator = false
        var gameoverIndicator = false
        var moveplacedIndicator = false
        var slotoccupiedIndicator = false

        // telur fjöldann af merkjum í listanum. t.d. x:3, o:2
        board.forEach(
          function(x) {
            countSigns[x] = (countSigns[x] || 0)+1;
          });


        //board[1] = 'x'
        //board[4] = 'y'

        var sizeOfBoard = board.filter(function(value) { return value !== undefined}).length;


        console.log(countSigns)

        function processEvent(event) {
          if(event.type==="GameJoined"){
            gamefullIndicator=true
          }

          console.log(event.type)
          if(event.type==="PlaceMove")
          {
              if (checkTurn(sizeOfBoard) != event.side){
                    console.log("HALLO " + checkTurn(sizeOfBoard) + event.side)

                }
                console.log("Board placement: " + board[event.placement])

                if (board[event.placement] === undefined){
                    board[event.placement] = event.side;
                }
                else {
                    slotoccupiedIndicator = true
                }
                moveplacedIndicator= !moveplacedIndicator

          }
          if(event.type==="MovePlaced") {
              //occupiedSlotIndicator = false
          }


          //console.debug("event", event)
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull() {
          return gamefullIndicator;
        }
        function gameOver() {
          return gameoverIndicator;
        }

        function movePlaced() {
            return moveplacedIndicator;
        }
        function slotOccupied() {
            return slotoccupiedIndicator;
        }

        function checkTurn(sizeOfBoard) {
            if (sizeOfBoard%2==0) {
              return 'x'
            }
            else {
              return 'o'
            }
        }
        processEvents(history);

        return {
            movePlaced: movePlaced,
            slotOccupied: slotOccupied,
            gameOver: gameOver,
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};
