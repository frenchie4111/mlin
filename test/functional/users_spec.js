var request = require( "supertest" ),
    assert = require( "assert" ),
    server = require( "../../lib/server" );

describe( "User Routing", function() {
    var url = "http://localhost:1337";

    beforeEach( function( done ) {
        server.start( { port: 1337, enviroment: "test", print: false }, function() {
            done();
        } );
    } );

    describe( "User Registration", function() {
        var profile = {
            username: "test",
            password: "test",
            email: "test@test.com"
        }

        it( "Should create account", function( done ) {
            request( url )
                .post( "/register" )
                .send( profile )
                .expect( 200 )
                .end( function( err, body ) {
                    if( err ) { throw err; };
                    done();
                } );
        } );
    } );


} );
