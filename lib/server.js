var restify = require( "restify" ),
    colors = require( "colors" ),
    database = require( "./database" )
    winston = require( "winston" );

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

exports.start = function( opts, cb ) {
    var port = opts.port || 1337;
    var enviroment = opts.enviroment || "test";
    if( opts.print != null && opts.print == false ) {
        try {
            winston.remove( winston.transports.Console );
        } catch( e ) {
        }
    }

    server = restify.createServer();
    server.use( restify.bodyParser( { mapParams: false } ) );

    server.listen( 1337, function() {
        winston.info( "Now listening on port 1337".green );

        // Controllers routing
        controllers.forEach( function( controller ) {
            controller.setRoutes( server );
        } );

        database.initializeDatabase( "mlin", enviroment, models, function() {
            winston.info( "Database initialize finished".green );
            cb();
        } );
    });
}

exports.close = function( cb ) {
    server.close( cb );
}
