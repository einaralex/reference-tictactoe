
module.exports = function(injected){
    var TictactoeState = injected('TictactoeState');

    return function(history){

        var gameState = TictactoeState(history);

        return {
            executeCommand: function(cmd, eventHandler){

                var cmdHandlers = {
                    "CreateGame": function (cmd) {
                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameCreated",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'X'
                        }]);

                    },
                    "JoinGame": function (cmd) {
                        if(gameState.gameFull()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "FullGameJoinAttempted",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                            }]);
                            return;
                        }

                        eventHandler([{
                            gameId: cmd.gameId,
                            type: "GameJoined",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side:'O'
                        }]);
                    },
                    "PlaceMove": function(cmd){

                        //if gamestate is not full, or it's not your turn, you can't place a move
                        if (gameState.slotOccupied(cmd.placement) || !gameState.gameFull()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "IllegalMove",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                placement: cmd.placement
                            }]);
                            return;
                        }

                        //checks if this side is the same as in last move
                        if (gameState.checkTurn(cmd.side)){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "NotYourMove",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                placement: cmd.placement
                            }]);
                            return;
                        }

                        var events = [{
                            gameId: cmd.gameId,
                            type: "MovePlaced",
                            user: cmd.user,
                            name: cmd.name,
                            timeStamp: cmd.timeStamp,
                            side: cmd.side,
                            placement: cmd.placement
                        }];

                        gameState.processEvents(events);

                        if (gameState.gameWon()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "GameWon",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                placement: cmd.placement
                            }]);
                            return
                        }

                        if (gameState.gameDraw()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "GameDraw",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp,
                                side: cmd.side,
                                placement: cmd.placement
                            }]);
                            return
                        }


                        eventHandler(events)
                    }
                };

                if(!cmdHandlers[cmd.type]){
                    console.log(cmd);
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};
