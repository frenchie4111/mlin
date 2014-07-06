var restify = require( "restify" ),
    database = require( "../../lib/database" ),
    users = require( "../../app/models/users" ),
    util = require( "util" )
    tokens = require( "../../app/models/tokens" );

function login( req, res, next ) {
    var username = req.body.username;
    var password = req.body.password;

    users.getWithUsername( username, function( user, err ) {
        if( err ) {
            next( new restify.errors.InvalidCredentialsError( { message: "Username Not Found" } ) );
        }
        user.authenticate( password, function( token, err ) {
            if( token != null ) {
                res.send( { success: true, token: token } );
            } else {
                next( new restify.errors.InvalidCredentialsError( { message: err } ) );
            }
        } );
    } );
}

function register( req, res, next ) {
    var user = users.newUser( req.body, req.body.password );

    user.commit( function( body, err ) {
        res.send( user );
    } );
}

function getMe( req, res, next ) {
    res.send( req.user );
}

exports.authenticationCheck = function( req, res, next ) {
    if( req.headers["mlin-authentication"] != null ) {
        tokens.userForToken( req.headers["mlin-authentication"], function( user, err ) {
            if( !err ) {
                req.user = user;
                next();
            } else {
                res.send( new restify.errors.NotAuthorizedError( { message: "Invalid Token" } ) )
            }
        } );
    } else {
        res.send( new restify.errors.NotAuthorizedError( { message: "No Authentication Token Present" } ) )
    }
}

exports.setRoutes = function( server ) {
    server.post( "/login", login );
    server.post( "/register", register );

    server.get( "/me", exports.authenticationCheck, getMe );
}
