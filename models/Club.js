const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = new Schema ({
    imageUrl: {type: String, default:'https://res.cloudinary.com/martajank/image/upload/v1597920274/Club-lectura_zz28u3.jpg'},
    title: {type: String, required: true},
    description: String,
    bookToReadCover: {type: String, default:'https://res.cloudinary.com/martajank/image/upload/v1597920372/vintage-book-cover-vector-22334307_o6kale.jpg'},
    currentBookTitle: String,
    meetingDate: String,
    meetingHour: String,
    meetingLink: String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;