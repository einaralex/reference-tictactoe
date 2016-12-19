module.exports=function(injected){

    const io = require('socket.io-client');
    const RoutingContext = require('../../client/src/routing-context');
    const generateUUID = require('../../client/src/common/framework/uuid');

    var connectCount =0;

    function userAPI(){
        var waitingFor=[];
        var commandId=0;
        var currentGame;
        var currentGameId

        var routingContext = RoutingContext(inject({
            io,
            env:"test"
        }));

        connectCount++;
        const me = {
            expectUserAck:(cb)=>{
                waitingFor.push("expectUserAck");
                routingContext.socket.on('userAcknowledged', function(ackMessage){

                    expect(ackMessage.clientId).not.toBeUndefined();
                    waitingFor.pop();
                });
                return me;
            },
            sendChatMessage:(message)=>{
                var cmdId = commandId++;
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"chatCommand", message });
                return me;
            },
            expectChatMessageReceived:(message)=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('chatMessageReceived', function(chatMessage){
                    expect(chatMessage.sender).not.toBeUndefined();
                    if(chatMessage.message===message){
                        waitingFor.pop();
                    }
                });
                return me;
            },
            cleanDatabase:()=>{
                var cmdId = commandId++;
                routingContext.commandRouter.routeMessage({commandId:cmdId, type:"cleanDatabase"});
                return me;

            },
            waitForCleanDatabase:()=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('databaseCleaned', function(chatMessage){
                    waitingFor.pop();
                });
                return me;

            },
            expectGameCreated:()=>{
                waitingFor.push("expectGameCreated");
                routingContext.eventRouter.on('GameCreated', function(gameCreated){
                    expect(gameCreated.gameId).not.toBeUndefined();
                    currentGame = gameCreated
                    waitingFor.pop();
                });
                return me;
            },
            createGame:()=>{
              var cmdId = commandId++;
              var gId = generateUUID();
              currentGameId = gId
              routingContext.commandRouter.routeMessage({commandId:cmdId, type:"CreateGame", gameId:gId});

              return me;
            },
            expectGameJoined:()=>{
              waitingFor.push("expectGameJoined");
              routingContext.eventRouter.on('GameJoined', function(gameJoined){
                console.log(gameJoined.gameId)
                console.log(currentGameId)
                expect(gameJoined.gameId).not.toBeUndefined;
                  waitingFor.pop();
              });
              return me;
            },
            joinGame:(gId)=>{
              var cmdId = commandId++;
              routingContext.commandRouter.routeMessage({commandId:cmdId, type:"JoinGame", gameId:gId});
              return me;
            },
            getGame:()=>{
              currentGameId = currentGame.gameId;
              me.gameId = currentGameId;
              return me;
            },

            // Fer aldrei hingað

            expectMoveMade:()=>{
              waitingFor.push("expectMoveMade");
              routingContext.eventRouter.on('MovePlaced', function(movePlaced){
                //expect(movePlaced.gameId).toBe(currentGameId);
                  waitingFor.pop();
              });
              return me;
            },

            // Þetta virkar ekki því þetta stoppar alltaf hér og ég hef enga hugmynd afhverju,
            // fæ alltaf :  Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
            placeMove:(p)=>{
               var cmdId = commandId++;
               console.log(currentGameId)
               routingContext.commandRouter.routeMessage({commandId: cmdId, gameId:currentGame.gameId, type: "PlaceMove", side:currentGame.side, placement: p});
               return me;
            },
            expectGameWon:()=>{
              waitingFor.push("expectGameWon");
              routingContext.eventRouter.on('GameWon', function(gameOver){
                  waitingFor.pop();
              });
              return me;
            },
            then:(whenDoneWaiting)=>{
                function waitLonger(){
                    if(waitingFor.length>0){
                        setTimeout(waitLonger, 0);
                        return;
                    }
                    whenDoneWaiting();
                }
                waitLonger();
                return me;
            },
            disconnect:function(){
                routingContext.socket.disconnect();
            }


        };
        return me;

    }

    return userAPI;
};
