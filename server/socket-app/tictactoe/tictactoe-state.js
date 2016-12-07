var _ = require('lodash');



module.exports = function (injected) {

    return function (history) {

        var gamefullIndicator = false

        function processEvent(event) {
          if(event.type=="GameJoined"){
            gamefullIndicator=true
          }
          console.debug("event", event)
        }

        function processEvents(history) {
            _.each(history, processEvent);
        }

        function gameFull() {
          return gamefullIndicator;
        }

        processEvents(history);

        return {
            gameFull: gameFull,
            processEvents: processEvents
        }
    };
};
