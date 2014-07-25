var request = require( "supertest" ),
    assert = require( "assert" ),
    server = require( "../../lib/server" );

describe( "User Routing", function() {
    var url = "http://localhost:1337";

    before( function( done ) {
        server.start( { port: 1337, enviroment: "test", print: true }, function() {
            done();
        } );
    } );

    after( function( done ) {
        server.close( function() {
            done();
        } );
    } );

    describe( "User Registration", function() {
        var profile = {
            username: "test",
            password: "test",
            email: "test@test.com"
        };

        it( "Should create account", function( done ) {
            request( url )
                .post( "/register" )
                .send( profile )
                .expect( 200 )
                .end( function( err, body ) {
                    if( err ) { throw err; }



                    done();
                } );
        } );
    } );

    describe( "User Login", function() {
        var profile = {
            username: "test2",
            password: "test2",
            email: "test2@test.com"
        };

        it( "Should create account and sign in with it", function( done ) {
            request( url )
                .post( "/register" )
                .send( profile )
                .expect( 200 )
                .end( function( err, res ) {
                    if( err ) { throw err; }

                    assert.equal( profile.username, res.body.username );
                    assert.equal( profile.email, res.body.email );

                    request( url )
                        .post( "/login" )
                        .send( profile )
                        .expect( 200 )
                        .end( function( err, res ) {

                            assert( res.body.token !== null );

                            request( url )
                                .get( "/me" )
                                .set( "mlin-authentication", res.body.token )
                                .expect( 200 )
                                .end( function( err, res ) {

                                    assert( res.body );
                                    assert.equal( res.body.username, profile.username );
                                    assert.equal( res.body.email, profile.email );

                                    done();
                                } );
                        } );
                } );
        } );
    } );

} );
