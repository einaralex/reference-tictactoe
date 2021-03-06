const inject = require('./common/framework/inject');
const WebSocketModule =  require('./io/webSocket');
const MessageRouter = require('./common/framework/message-router');

const IncomingSocketMessageDispatcherModule = require('./common/framework/incoming-socket-message-dispatcher');
const OutgoingSocketIoMessagePortModule = require('./common/framework/outgoing-socket-io-message-port');


function routingContext(injected){

    const eventRouter = MessageRouter();
    const commandRouter = MessageRouter();
    const queryRouter = MessageRouter();

    const environment = injected('env');
    var socketURI;
    console.log(environment + " ENV")
    if(environment==='development' || environment=='tst'){
        socketURI='http://52.214.66.118'
    } else {
        socketURI='/'
    }

    const io = injected('io');
    const socket = WebSocketModule(inject({
        io,
        socketURI:socketURI
    }));

    const incomingSocketEventDispatcher = IncomingSocketMessageDispatcherModule(
        inject({
            socketIoVerb:'eventIssued',
            messageRouter:eventRouter
        })
    );
    const incomingSocketQueryDispatcher = IncomingSocketMessageDispatcherModule(
        inject({
            socketIoVerb:'queryResult',
            messageRouter:queryRouter
        })
    );

    const outgoingSocketIoMessagePort = OutgoingSocketIoMessagePortModule(
        inject({
            io:socket,
            messageRouter:commandRouter
        })
    );

    outgoingSocketIoMessagePort.dispatchThroughIo('*','issueCommand');
    incomingSocketEventDispatcher.startDispatching(socket);
    incomingSocketQueryDispatcher.startDispatching(socket);

    var exports = {
        eventRouter,
        commandRouter,
        queryRouter,
        socket
    };
    return exports;

}

module.exports = routingContext;
