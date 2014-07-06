var server = require( "./lib/server" );

server.start( 1337, "test", function() {
	console.log( "Server initialized".green );
} );
