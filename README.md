# loggly-console

Loggly wrapper for console. Used by colingo

## Example

    var augmentConsole = require("loggly-console")

    augmentConsole({
        domain: "your loggly sub domain"
        , key: "your input key"
    })

    // Now console.log / error / etc is overwritten to send logging data
    // directly to your loggly input.

## Installation

`npm install loggly-console`

## Contributors

 - Raynos

## MIT Licenced