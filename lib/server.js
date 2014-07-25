var express = require( "express" ),
    colors = require( "colors" ),
    database = require( "./database" ),
    winston = require( "winston" ),
    bodyParser = require('body-parser');

// Controller imports
var controllers = [
    require( "../app/controllers/users_controller" ),
    require( "../app/controllers/posts_controller" )
];

// Models imports
var models = [
    require( "../app/models/users" ),
    require( "../app/models/tokens" ),
    require( "../app/models/posts" )
];

var server;

console.log( controllers.length );

exports.start = function( opts, cb ) {
    var port = opts.port || 1337;
    var enviroment = opts.enviroment || "test";

    if( opts.print !== null && opts.print === false ) {
        try {
            winston.remove( winston.transports.Console );
        } catch( e ) {
            // NOOP: There already was no transport.Console in winston
        }
    }

    var app = express();
    app.use( bodyParser.json() );

    server = app.listen( port, function() {
        winston.info( "listening".green );

        winston.info( "Now listening on port 1337".green );

        // Controllers routing
        controllers.forEach( function( controller ) {
            controller.setRoutes( app );
        } );

        database.initializeDatabase( "mlin", enviroment, models, function() {
            winston.info( "Database initialize finished".green );
            cb();
        } );
    } );

    server.on( "error", function( err ) {
        winston.error( err );
    } );

    server.on( "close", function() {
        winston.info( "closed".yellow );
    } );
};

exports.close = function( cb ) {
    server.on( "close", cb );
    server.close();
};
