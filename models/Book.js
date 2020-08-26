const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema ({
    title: {type: String, required: true},
    imageUrl: {type: String, default:'https://res.cloudinary.com/martajank/image/upload/v1597920372/vintage-book-cover-vector-22334307_o6kale.jpg'},
    author: String,
    description: String,
    year: String,
    publishingHouse: String,
    isbn: String,
    rating: Number,
    review: [{
        title: String,
        comment: String,
        author: {type: Schema.Types.ObjectId, ref: 'User'}
    }],
    creator: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;