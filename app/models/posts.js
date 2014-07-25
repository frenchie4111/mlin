var database = require( '../../lib/database' ),
	model = require( './model' ),
	util = require( 'util' );

function Post( json ) {
	this.updateFromJson( json );
}
exports.Post = Post;
util.inherits( Post, model.Model );

Post.prototype.updateFromJson = function( json ) {
	this._id = json._id;
    this._rev = json._rev;
    this.content = json.content;
    this.type = "post";
};

exports.posts = function( filters ) {
    
};

exports.createViews = function( db, cb ) {
    db.insert( {
        'views': {
        	'':''
        }
    }, '_design/posts', cb );
};
