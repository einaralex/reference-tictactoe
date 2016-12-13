var should = require('should');
var _ = require('lodash');

var TictactoeState = require('./tictactoe-state')(inject({}));

var tictactoe = require('./tictactoe-handler')(inject({
    TictactoeState
}));

var playerOneCreatesGame = {
    type: "GameCreated",
    user: {
        userName: "Player1"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29"
};

var playerOneJoinedGame = {
    type: "GameJoined",
    user: {
        userName: "Player1"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29",
    side: "X"
};

var playerTwoJoinsGame = {
  type: "JoinGame",
  user: {
      userName: "Player2"
  },
  name: "TheFirstGame",
  timeStamp: "2014-12-02T11:30:29",
  side: "O"
};

var playerTwoJoinedGame = {
  type: "GameJoined",
  user: {
      userName: "Player2"
  },
  name: "TheFirstGame",
  timeStamp: "2014-12-02T11:30:29",
  side: "O"
};

var playerOnePlacesMove = {
    type: "PlaceMove",
    user: {
        userName: "Player1"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29",
    side: "X",
    placement: "4"
};

var playerOneMovePlaced = {
    type: "MovePlaced",
    user: {
        userName: "Player1"
    },
    name: "TheFirstGame",
    timeStamp: "2014-12-02T11:29:29",
    side: "X",
    placement: "4"
};

function playerPlaceMove(thisUser, thisSide, thisPlacement) {
    return {
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
        when =
        {
            id:"123987",
            type: "CreateGame",
            user: {
                userName: "TheGuy"
            },
            name: "TheFirstGame",
            timeStamp: "2014-12-02T11:29:29"
        };
        then = [
            {
                type: "GameCreated",
                user: {
                    userName: "TheGuy"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side:'X'
            }
        ];

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
        when = playerTwoJoinsGame
        then = [
            {
                type: "GameJoined",
                user: {
                    userName: "Player2"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:30:29",
                side:'O'
            }
        ];

    });

    it('should emit FullGameJoinAttempted event when game full', function () {

      given = [playerOneCreatesGame, playerTwoJoinedGame];
      when =
      {
          type: "JoinGame",
          user: {
              userName: "Player3"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:30:50"
      };
      then = [
          {
              type: "FullGameJoinAttempted",
              user: {
                  userName: "Player3"
              },
              name: "TheFirstGame",
              timeStamp: "2014-12-02T11:30:50"
          }
      ];
    });
    it('should emit a IllegalMove event when trying to place a move without a second player', function () {

      given = [playerOneCreatesGame];
      when = playerOnePlacesMove
      then = [{
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
    it('should emit MovePlaced after placing a move', function () {

      given = [playerOneCreatesGame, playerTwoJoinedGame];
      when = playerOnePlacesMove;
      then = [{
                type: "MovePlaced",
                user: {
                    userName: "Player1"
                },
                name: "TheFirstGame",
                timeStamp: "2014-12-02T11:29:29",
                side: "X",
                placement: "4"
            }];
    });
    it('should emit NotYourMove when trying to place the same sign again', function () {

        given = [playerOneCreatesGame, playerTwoJoinedGame, placeMove("Player1", "X", "3")];
        when = playerPlaceMove("Player1", "X", "4");
        then = [{
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

    it('should emit GameWon when player gets three signs in a row', function () {

        given = [playerOneCreatesGame,
            playerTwoJoinedGame,
            placeMove("Player1", "X", "7"),
            placeMove("Player2", "O", "3"),
            placeMove("Player1", "X", "1"),
            placeMove("Player2", "O", "5")
        ];
        when = playerPlaceMove("Player1", "X", "4")
        then = [{
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

    it('should emit GameDraw when player gets three signs in a row', function () {

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
        when = playerPlaceMove("Player1", "X", "8")
        then = [{
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

});
