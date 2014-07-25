var authenticationCheck = require( './users_controller' ).authenticationCheck,
	Posts = require( '../../app/models/posts' ),
	winston = require( 'winston' );

function posts( req, res, next ) {
    res.send( { hi: 'hi there' } );
}

function createPost( req, res, next ) {
	winston.info( "here" );
	var post = new Posts.Post( req.body );
	post.commit( function() {
		res.send( post );
	} );
}

exports.setRoutes = function( server ) {
	var post_endpoint = '/posts';

    server.get( post_endpoint, posts );
    server.post( post_endpoint, authenticationCheck, createPost );
};