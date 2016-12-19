require('./globals');


var JasmineConsoleReporter = require('jasmine-console-reporter');
var consoleReporter = new JasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: false
});
jasmine.getEnv().addReporter(consoleReporter);

var jasmineReporters = require('jasmine-reporters');
var junitReporter = new jasmineReporters.JUnitXmlReporter({
    consolidateAll: false,
    savePath: 'build',
    filePrefix: 'testOutput'

});
jasmine.getEnv().addReporter(junitReporter);
