var database = require( "../../lib/database" );

function Post() {

}
exports.Post = Post;

exports.posts = function( filters ) {
    
};

exports.createViews = function( db, cb ) {
    db.insert( {
        "views": {

        }
    }, "_design/posts", function( error, response ) {
        cb();
    } );
};
