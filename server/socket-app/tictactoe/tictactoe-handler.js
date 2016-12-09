
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
                          //if gamestate is not full, you can't place a move
                          if (!gameState.gameFull()){
                              eventHandler( [{
                                  gameId: cmd.gameId,
                                  type: "GameNotFullCantPlaceMove",
                                  user: cmd.user,
                                  name: cmd.name,
                                  timeStamp: cmd.timeStamp
                                }]);
                              return;
                          }
                          if (!gameState.movePlaced()){
                            eventHandler( [{
                                gameId: cmd.gameId,
                                type: "MovePlaced",
                                user: cmd.user,
                                name: cmd.name,
                                timeStamp: cmd.timeStamp
                              }]);
                              return;
                          }
                          eventHandler([{
                              gameId: cmd.gameId,
                              type: "PlaceMove",
                              user: cmd.user,
                              name: cmd.name,
                              timeStamp: cmd.timeStamp,
                              placement: cmd.placement
                          }]);
                    }
                };

                if(!cmdHandlers[cmd.type]){
                    console.log(cmd)
                    throw new Error("I do not handle command of type " + cmd.type)
                }
                cmdHandlers[cmd.type](cmd);
            }
        }
    }
};
