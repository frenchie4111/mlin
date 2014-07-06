var server = require( "./lib/server" ),
	winston = require( "winston" );

server.start( { port: 1337, enviroment: "test" }, function() {
	winston.info( "Server initialized".green );
} );
