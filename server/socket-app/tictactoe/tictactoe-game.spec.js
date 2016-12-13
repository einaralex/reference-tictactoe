var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

var playerOneCreatesGame = {
    gameId:"123987",
    type: "CreateGame",
    user: {
        userName: "Player1"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};

var playerTwoJoinsGame = {
    gameId:"123987",
    type: "JoinGame",
    user: {
        userName: "Player2"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:30:29",
    side: "O"
};

var playerTwoJoinedGame = {
    gameId:"123987",
    type: "GameJoined",
    user: {
        userName: "Player2"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:30:29",
    side: "O"
};

function playerPlaceMove(thisUser, thisSide, thisPlacement) {
    return {
        gameId:"123987",
        type: "PlaceMove",
        user: {
            userName: thisUser
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:29:29",
        side: thisSide,
        placement: thisPlacement
    }
}

function playerMovePlaced(thisUser, thisSide, thisPlacement) {
    return {
        gameId:"123987",
        type: "MovePlaced",
        user: {
            userName: thisUser
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:29:29",
        side: thisSide,
        placement: thisPlacement
    }
}

function placeMove(thisUser, thisSide, thisPlacement) {
    return {
        gameId:"123987",
        type: "PlaceMove",
        user: {
            userName: thisUser
        },
        name: "TheFirstGame",
        timeStamp: "2014-12-02T11:29:29",
        side: thisSide,
        placement: thisPlacement
    },
        {
            gameId:"123987",
            type: "MovePlaced",
            user: {
                userName: thisUser
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: thisSide,
            placement: thisPlacement
        }

}


describe('create game command', function() {

    var given, when, then;

    beforeEach(function(){
        given=undefined;
        when=undefined;
        then=undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function(actualEvents){
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game created event', function(){

        given = [];
        when = playerOneCreatesGame;
        then = [{
            gameId:"123987",
            type: "GameCreated",
            user: {
                userName: "Player1"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side:'X'
        }];

    })
});


describe('join game command', function () {

    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });


    it('should emit game joined event', function () {

        given = [playerOneCreatesGame];
        when = playerTwoJoinsGame;
        then = [{
            gameId:"123987",
            type: "GameJoined",
            user: {
                userName: "Player2"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:30:29",
            side: 'O'
        }];
    });


    it('should emit FullGameJoinAttempted event when game full', function () {

        given = [playerOneCreatesGame, playerTwoJoinedGame];
        when = {
            gameId:"123987",
            type: "JoinGame",
            user: {
                userName: "Player3"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:30:50"
        };
        then = [{
            gameId:"123987",
            type: "FullGameJoinAttempted",
            user: {
                userName: "Player3"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:30:50"
        }];
    });
});

describe('place move command', function () {

    var given, when, then;

    beforeEach(function () {
        given = undefined;
        when = undefined;
        then = undefined;
    });

    afterEach(function () {
        tictactoe(given).executeCommand(when, function (actualEvents) {
            should(JSON.stringify(actualEvents)).be.exactly(JSON.stringify(then));
        });
    });



    it('should emit a IllegalMove event when trying to place a move without a second player', function () {

        given = [playerOneCreatesGame];
        when = playerPlaceMove("Player1", "X", "4");
        then = [{
            gameId:"123987",
            type: "IllegalMove",
            user: {
                userName: "Player1"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: 'X',
            placement: '4'
        }
        ];
    });
    it('should emit MovePlaced on first game move', function () {

        given = [playerOneCreatesGame, playerTwoJoinedGame];
        when = playerPlaceMove("Player1", "X", "3");
        then = [{
            gameId:"123987",
            type: "MovePlaced",
            user: {
                userName: "Player1"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: "X",
            placement: "3"
        }];
    });
    it('should emit NotYourMove if attempting to make move out of turn', function () {

        given = [playerOneCreatesGame, playerTwoJoinedGame, placeMove("Player1", "X", "3")];
        when = playerPlaceMove("Player1", "X", "4");
        then = [{
            gameId:"123987",
            type: "NotYourMove",
            user: {
                userName: "Player1"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: "X",
            placement: "4"
        }];
    });
    it('should emit IllegalMove when square is already occupied', function () {

        given = [playerOneCreatesGame, playerTwoJoinedGame, playerMovePlaced("Player1", "X", "4")]
        when =  playerPlaceMove("Player2", "O", "4");
        then = [{
            gameId:"123987",
            type: "IllegalMove",
            user: {
                userName: "Player2"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: "O",
            placement: "4"
        }];
    });

    it('should emit game won on', function () {

        given = [playerOneCreatesGame,
            playerTwoJoinedGame,
            placeMove("Player1", "X", "7"),
            placeMove("Player2", "O", "3"),
            placeMove("Player1", "X", "1"),
            placeMove("Player2", "O", "5")
        ];
        when = playerPlaceMove("Player1", "X", "4");
        then = [{
            gameId:"123987",
            type: "GameWon",
            user: {
                userName: "Player1"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: "X",
            placement: "4"
        }];
    });

    it('should emit game draw when neither wins', function () {

        given = [playerOneCreatesGame,
            playerTwoJoinedGame,
            placeMove("Player1", "X", "1"),
            placeMove("Player2", "O", "2"),
            placeMove("Player1", "X", "3"),
            placeMove("Player2", "O", "5"),
            placeMove("Player1", "X", "4"),
            placeMove("Player2", "O", "7"),
            placeMove("Player1", "X", "6"),
            placeMove("Player2", "O", "9")
        ];
        when = playerPlaceMove("Player1", "X", "8");
        then = [{
            gameId:"123987",
            type: "GameDraw",
            user: {
                userName: "Player1"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: "X",
            placement: "8"
        }];
    });
    it('Should not emit game draw if won on last move', function () {

        given = [playerOneCreatesGame,
            playerTwoJoinedGame,
            placeMove("Player1", "X", "1"),
            placeMove("Player2", "O", "2"),
            placeMove("Player1", "X", "3"),
            placeMove("Player2", "O", "5"),
            placeMove("Player1", "X", "4"),
            placeMove("Player2", "O", "7"),
            placeMove("Player1", "X", "6"),
            placeMove("Player2", "O", "8")
        ];
        when = playerPlaceMove("Player1", "X", "9");
        then = [{
            gameId:"123987",
            type: "GameWon",
            user: {
                userName: "Player1"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29",
            side: "X",
            placement: "9"
        }];

        expect(then[0].type).not.toBe("GameDraw")
    });

});
