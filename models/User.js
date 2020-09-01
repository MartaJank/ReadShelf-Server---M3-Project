const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = require('./Book')
const AllKindOfBooks = require('./AllKindOfBooks')

const userSchema = new Schema ({
    
    imageUrl: {type: String, default: 'https://res.cloudinary.com/martajank/image/upload/v1597920242/avatar_go6uwv.png'},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    /* isAuthor: {type: Boolean, default: false}, */
    isBookCreator: {type: Boolean, default: false},
    isClubCreator: {type: Boolean, default: false},
    createdBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    paperBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    eBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    audiobooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    pendingBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    progressBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    readBooks: [{type: Schema.Types.ObjectId, ref: 'Book'}],
    paperBooksAPI: [],
    eBooksAPI: [],
    audiobooksAPI: [],
    pendingBooksAPI: [],
    progressBooksAPI: [],
    readBooksAPI: [],
    bookClubs:  [{type: Schema.Types.ObjectId, ref: 'Club'}],
    createdBookClubs: [{type: Schema.Types.ObjectId, ref: 'Club'}],
    joinedBookClubs: [{type: Schema.Types.ObjectId, ref: 'Club'}]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;