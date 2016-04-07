#! /usr/bin/env node

var path = require('path'),
    LOG = require("./utils/LOG").LOG,
    SlimTcpServer = require("./tcp/SlimTcpServer.js"),
    StatementExecutor = require("./exec/StatementExecutor.js"),
    classpath =  process.argv[process.argv.length - 2],
    arrayOfSearchPaths = classpath.split(path.delimiter),
    port = process.argv[process.argv.length - 1];

new SlimJS(port,arrayOfSearchPaths);

var BYE = "bye";
function SlimJS(port,arrayOfSearchPaths){
    var statementExecutor = new StatementExecutor(arrayOfSearchPaths);

    var tcpSlimServer = new SlimTcpServer(port, onReceivedInstructionSet);
    tcpSlimServer.start();

    function onReceivedInstructionSet(instructionSet, onFinalInstructionExecuted) {
        var returnValues = [];

        var currentInstructionIndex = 0;

        if(instructionSet===BYE)
            return onFinalInstructionExecuted(returnValues);

        executeInstruction(instructionSet[0], onInstructionExecutionResult);

        function onInstructionExecutionResult(result) {
            returnValues.push(result);

            currentInstructionIndex++;

            if (wasLastInstructionExecuted(result))
                onFinalInstructionExecuted(returnValues);
            else
                executeInstruction(instructionSet[currentInstructionIndex], onInstructionExecutionResult);
        }

        function wasLastInstructionExecuted(result) {
            return result===BYE || currentInstructionIndex === instructionSet.length;
        }
    }

    function executeInstruction(instructionArguments, cb) {
        var command = instructionArguments[1];

        statementExecutor[command](instructionArguments, cb);
    }
}





