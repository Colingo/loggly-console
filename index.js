var loggly = require('loggly')
    , slice = Array.prototype.slice
    , sent = false

module.exports = augmentConsole

function augmentConsole(options) {
    var client = loggly.createClient({
            subdomain: options.subdomain
            , json: true
        })
        , inputKey = options.inputKey

    ;["log", "info", "error", "debug", "warn"].forEach(modifyConsole)

    process.once("uncaughtException", handlException)

    function modifyConsole(name) {
        var old = console[name]

        console[name] = interceptConsole

        function interceptConsole(first) {
            log({
                content: first
                , methodName: name
                , first: arguments[1]
                , second: arguments[2]
                , third: arguments[3]
                , fourth: arguments[4]
                , timestamp: Date.now()
            })
            old && old.apply(console, arguments)
        }
    }

    function handlException(err) {
        if (sent === false) {
            sent = true
            process.stdout.write("logging exception" + err.message)
            process.stdout.write("**uncaughtException**\n" +
                err.stack + "\n")

            log({
                content: "uncaught exception"
                , methodName: "log"
                , first: err
                , timestamp: Date.now()
            })
        }

        setTimeout(throwError, 3000)

        function throwError() {
            throw err
        }
    }

    function log() {
        var args = [inputKey].concat(slice.call(arguments))
        try {
            client.log.apply(client, args)
        } catch (err) {
            /* ignore errors. Most likely json stringify errors */
        }
    }
}