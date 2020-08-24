const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const parser = require('../config/cloudinary');

const User = require("../models/User");
const Book = require('../models/Book');
const Club = require("../models/Club");

// HELPERS
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin,
} = require("../helpers/middlewares");

//PROFILE
router.get('/profile/:userId', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
        /* .populate('createdBooks') */
    /*, 'paperBooks', 'eBooks', 'audiobooks', 'pendingBooks', 'progressBooks', 'readBooks') */
        .then(response => {
          response.password = '*****';
          res.status(200).json(response);
        })
        .catch(err => {
          res.json(err);
        });
});

router.patch('/profile/:userId/edit', isLoggedIn(), (req, res, next) => {
    let { email, password, username, img } = req.body;

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt)

    User.findByIdAndUpdate(req.params.userId, { email, password: hashPass, username, img: req.body.img ? req.body.img : req.session.currentUser.img }, { new: true })
        .then((user) => {
            req.session.currentUser = user;
            console.log('session', req.session.currentUser)
            res.json({ message: `User with ${req.params.userId} is updated successfully.` });
        })
        .catch(err => {
          res.json(err);
        });
});

//BOOKS
router.post('/books/add', parser.single('imageUrl'), isLoggedIn(), (req, res, next) => {
    console.log(req.body.title);
    Book.create({
        /* let imgPath;
        if (req.file) imgPath = req.file.url; */
       title: req.body.title,
       author: req.body.author, 
       description: req.body.description, 
       genre: req.body.genre, 
       year: req.body.year, 
       publishingHouse: req.body.publishingHouse, 
       isbn: req.body.isbn,
       creator: req.body.userId
       /* , img: imgPath */ 
    })
    .then(response => {
        console.log('response', response)
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { createdBooks: response._id }, $set: {isBookCreator: true}}, {new: true})
        .then(theResponse => {
            req.session.currentUser = theResponse
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        });
    })
    .catch(err => {
        res.json(err);
    });
});

router.patch('/books/:bookId/edit', parser.single('imageUrl'), isLoggedIn(), (req, res, next) => {
    let { title, author, description, genre, year, publishingHouse, isbn, img } = req.body;
    User.findById(req.session.currentUser._id)
    .then(user => {
        const userBooks = user.createdBooks
        if(!userBooks.includes(req.params.bookId)) {
            next(createError(401))
        } else {
            return Book.findByIdAndUpdate(req.params.bookId, { title, author, description, genre, year, publishingHouse, isbn, img: req.body.img ? req.body.img : req.session.currentUser.img }, {new: true});
        }
    })
    .then(() => {
        res.json({ message: `Book with ${req.params.bookId} is updated successfully.` });
    })
    .catch(err => {
      res.json(err);
    });
});

router.delete('/books/:bookId', isLoggedIn(), (req, res, next) => {
    Book.findByIdAndRemove(req.params.bookId)
    .then((response) => {
        console.log('response', response);
        User.findByIdAndUpdate(req.session.currentUser._id, {$pull: { createdBooks: req.params.bookId }, $set: createdBooks.length > 0 ? {isBookCreator: true} : {isBookCreator: false}}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch( err => {
      res.json(err);
    });
});

router.post('/books/:bookId/paperBooks', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { paperBooks: req.params.bookId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch(err => {
        res.json(err);
    });
});

router.post('/books/:bookId/eBooks', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { eBooks: req.params.bookId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch(err => {
        res.json(err);
    });
});

router.post('/books/:bookId/audiobooks', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { audiobooks: req.params.bookId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch(err => {
        res.json(err);
    });
});

router.post('/books/:bookId/pendingBooks', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { pendingBooks: req.params.bookId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch(err => {
        res.json(err);
    });
});

router.post('/books/:bookId/progressBooks', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { progressBooks: req.params.bookId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch(err => {
        res.json(err);
    });
});

router.post('/books/:bookId/readBooks', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { readBooks: req.params.bookId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch(err => {
        res.json(err);
    });
});

router.get('/books/created/:userId', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('createdBooks')
    .then(user => {
        res.json(user.createdBooks);
    })
    .catch(err => {
        res.json(err);
    });
});

router.post('/books/:bookId', isLoggedIn(), (req, res, next) => {
    const { title, author, comment } = req.body;
    Book.findByIdAndUpdate(req.params.bookId, { $push: { review: { title, author: req.session.currentUser._id, comment } } }, {new: true})
    .then(theResponse => {
        res.json(theResponse)
    })
    .catch( err => {
        res.json(err);
    });
});

//LISTS
router.get('/lists/:userId/bookshelf/paper', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('paperBooks')
    .then(user => {
        res.json(user.paperBooks);
    })
    .catch(err => {
        res.json(err);
    });
});

router.get('/lists/:userId/bookshelf/ebook', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('eBooks')
    .then(user => {
        res.json(user.eBooks);
    })
    .catch(err => {
        res.json(err);
    });
});

router.get('/lists/:userId/bookshelf/audiobook', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('audiobooks')
    .then(user => {
        res.json(user.audiobooks);
    })
    .catch(err => {
        res.json(err);
    });
});

router.get('/lists/:userId/reads-tracking/pending', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('pendingBooks')
    .then(user => {
        res.json(user.pendingBooks);
    })
    .catch(err => {
        res.json(err);
    });
});

router.get('/lists/:userId/reads-tracking/in-progress', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('progressBooks')
    .then(user => {
        res.json(user.progressBooks);
    })
    .catch(err => {
        res.json(err);
    });
});

router.get('/lists/:userId/reads-tracking/read', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('readBooks')
    .then(user => {
        res.json(user.readBooks);
    })
    .catch(err => {
        res.json(err);
    });
});

router.put('/lists/:bookId/move', isLoggedIn(), (req, res, next) => {

});

router.delete('/lists/:bookId/delete/paper', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$pull: {paperBooks: req.params.bookId}}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch( err =>{
        res.json(err);
    });
});

//CLUBS
router.get('/book-clubs', (req, res, next) => {
    Club.find()
    .then(allClubs => {
        res.json(allClubs);
    })
    .catch(err => {
        res.json(err);
    });
});

router.get('/book-clubs/joined', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('bookClubs')
    .then(user => {
        res.json(user.bookClubs)
    })
    .catch(err => {
        res.json(err)
    })
});

router.get('/book-clubs/created', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('createdBookClubs')
    .then(user => {
        res.json(user.createdBookClubs)
    })
    .catch(err => {
        res.json(err)
    })
});

router.get('/book-clubs/:clubId', isLoggedIn(), (req, res, next) => {
    Club.findById(req.params.clubId)
    .then(theClub =>{
        res.json(theClub);
    })
    .catch( err =>{
        res.json(err);
    })
})

router.post('/book-clubs/:clubId', isLoggedIn(), (req, res, next) => {
    Club.findById(req.params.clubId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { joinedBookClubs: req.params.clubId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch( err =>{
        res.json(err);
    });
});

router.post('/book-clubs/add', isLoggedIn(), (req, res, next) => {
    console.log(req.body.title);
    Club.create({
        /* let imgPath;
        if (req.file) imgPath = req.file.url; */
       title: req.body.title,
       description: req.body.description, 
       meetingDate: req.body.meetingDate,
       meetingHour: req.body.meetingHour, 
       meetingLink: req.body.meetingLink,
       creator: req.body.userId
       /* , img: imgPath */ 
    })
    .then(response => {
        console.log('response', response)
        User.findByIdAndUpdate(req.session.currentUser._id, {$push: { createdBookClubs: response._id }, $set: {isClubCreator: true}}, {new: true})
        .then(theResponse => {
            req.session.currentUser = theResponse
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch(err => {
        res.json(err);
    });
})

router.patch('/book-clubs/:clubId/edit', isLoggedIn(), (req, res, next) => {
    let { title, description, meetingDate, meetingLink } = req.body;
    User.findById(req.session.currentUser._id)
    .then(user => {
        const userClubs = user.createdBookClubs
        if(!userClubs.includes(req.params.clubId)) {
            next(createError(401))
        } else {
            return Club.findByIdAndUpdate(req.params.clubId, { title, description, meetingDate, meetingLink })
        }
    })
    .then(() => {
        res.json({ message: `Club with ${req.params.clubId} is updated successfully.` });
    })
    .catch(err => {
      res.json(err);
    });
})

router.delete('/book-clubs/:clubId', isLoggedIn(), (req, res, next) => {
    Club.findByIdAndRemove(req.params.clubId)
    .then((response) => {
        console.log('response', response)
        User.findByIdAndUpdate(req.session.currentUser._id, {$pull: { createdBookClubs: req.params.clubId }, $set: createdBookClubs.length > 0 ? {isClubCreator: true} : {isClubCreator: false}}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch( err => {
      res.json(err);
    });
});

router.delete('/book-clubs/:clubId/unjoin', isLoggedIn(), (req, res, next) => {
    Club.findById(req.params.clubId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$pull: { joinedBookClubs: req.params.clubId }}, {new: true})
        .then(theResponse => {
            res.json(theResponse);
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch( err => {
        res.json(err);
    });
});

module.exports = router;
