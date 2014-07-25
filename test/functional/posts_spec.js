var request = require( "supertest" ),
    assert = require( "assert" ),
    server = require( "../../lib/server" ),
    winston = require( "winston" );

describe( "Post Routing", function() {
    var url = "http://localhost:1337";
    var token = "";

    before( function( beforeDone ) {
        server.start( { port: 1337, enviroment: "test", print: false }, function() {

            winston.info( "Server started" );

            // Register / Signon before testing posts
            describe( "User Login", function() {
                var profile = {
                    username: "test2",
                    password: "test2",
                    email: "test2@test.com"
                };

                request( url )
                    .post( "/register" )
                    .send( profile )
                    .expect( 200 )
                    .end( function( err, res ) {
                        if( err ) { 
                            winston.error( "Server doesn't seem to be responding" );
                            throw err; 
                        }

                        winston.info( "Created user" );

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

                                        // All tests for posts happen here, after successful login
                                        beforeDone();
                                    } );
                            } );
                    } );
            } );

        } );
    } );

    after( function( done ) {
        server.close( function() {
            done();
        } );
    } );

    describe('Create post', function() {
        post = {
            content: "This is a post"
        };

        it('Should create a post', function(done) {
            request( url )
                .post( '/posts' )
                .send( post )
                .expect( 200 )
                .end( function( err, res ) {
                    assert( res.body );
                    assert.equal( res.body.content, post.content );

                    done();
                } );
        });
    });
} );


