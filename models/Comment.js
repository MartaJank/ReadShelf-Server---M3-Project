const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    title:  String,
    comment: String,
    bookReviewed: { type: Schema.Types.ObjectId, ref: 'Book' }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;