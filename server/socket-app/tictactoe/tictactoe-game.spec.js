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
    side: 'X'
};

var playerTwoJoinsGame = {
  type: "JoinGame",
  user: {
      userName: "Player2"
  },
  name: "TheFirstGame",
  timeStamp: "2014-12-02T11:30:29",
  side: 'O'
};

var playerTwoJoinedGame = {
  type: "GameJoined",
  user: {
      userName: "Player2"
  },
  name: "TheFirstGame",
  timeStamp: "2014-12-02T11:30:29",
  side: 'O'
};

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
    it('should emit a GameNotFullCantPlaceMove event when trying to place a move without a second player', function () {

      given = [playerOneCreatesGame];
      when =
      {
          type: "PlaceMove",
          user: {
              userName: "Player1"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29",
          json: { side: 'X',
          placement: "4" }
      };

      then = [{
          type: "GameNotFullCantPlaceMove",
          user: {
              userName: "Player1"
          },
          name: "TheFirstGame",
          timeStamp: "2014-12-02T11:29:29"
      }
      ];
    });
});
