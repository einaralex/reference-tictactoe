module.exports=function(injected){


    const io = injected('io');
    const RoutingContext = injected('RoutingContext');
    const generateUUID = require('../../client/src/common/framework/uuid');

    var connectCount =0;

    function testAPI(){
        var waitingFor=[];
        var commandId=0;

        var routingContext = RoutingContext(inject({
            io,
            env:"test"
        }));

        connectCount++;
        const me = {
            cleanDatabase:()=>{
                var cmdId = generateUUID();
                routingContext.commandRouter.routeMessage({id:cmdId, type:"cleanDatabase"});
                return me;

            },
            waitForCleanDatabase:()=>{
                waitingFor.push("expectChatMessageReceived");
                routingContext.eventRouter.on('databaseCleaned', function(chatMessage){
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

    return testAPI;
};
