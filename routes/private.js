const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const parser = require('../config/cloudinary');

const User = require("../models/User");
const Book = require('../models/Book');
const Club = require("../models/Club");
const AllKindOfBooks = require('../models/AllKindOfBooks');

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
    let { email, username, imageUrl } = req.body;

    User.findByIdAndUpdate(req.params.userId, { email, username, imageUrl: req.body.imageUrl ? req.body.imageUrl : req.session.currentUser.imageUrl }, { new: true })
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
       title: req.body.title,
       author: req.body.author, 
       description: req.body.description, 
       year: req.body.year, 
       publishingHouse: req.body.publishingHouse, 
       isbn: req.body.isbn,
       creator: req.session.currentUser._id
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
    .then(async user => {
        const userBooks = user.createdBooks
        if(!userBooks.includes(req.params.bookId)) {
            next(createError(401))
        } else {
            let actualBook = await Book.findById(req.params.bookId)
            return Book.findByIdAndUpdate(req.params.bookId, { title, author, description, genre, year, publishingHouse, isbn, img: req.body.img ? req.body.img : actualBook.img }, {new: true});
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
        User.findByIdAndUpdate(req.session.currentUser._id, {$pull: { createdBooks: req.params.bookId }}, {new: true})
        .then(user =>  {
            let query;
            if (user.createdBooks.length > 0) {
                query = {isBookCreator: true}
            } else {
                query = {isBookCreator: false}
            }

            User.findByIdAndUpdate(req.session.currentUser._id, {$set: query}, {new: true})
            .then(theResponse => {
                res.json(theResponse);
            })
            .catch(err => {
                res.json(err);
            })
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch( err => {
      res.json(err);
    });
});

router.get('/searchBooks/allkindofbooks', (req, res, next) => {
    AllKindOfBooks.find()
    .then(data =>{
        console.log(data)
    res.json(data).status(200)
    })
    .catch(err => {
        console.error(err)
    res.status(500)})
})

router.post('/books/:userId/push/:name', (req, res, next) => {
    console.log('holaaaa', req.body.volumeInfo)
    const { name } = req.params;
    const { id } = req.body
    const { title,
        authors,
        publisher,
        publishedDate,
        description,
        industryIdentifiers,
        readingModes,
        pageCount,
        printedPageCount,
        dimensions,
        printType,
        categories,
        averageRating,
        ratingsCount,
        maturityRating,
        allowAnonLogging,
        contentVersion,
        panelizationSummary,
        imageLinks,
        language,
        previewLink,
        infoLink,
        canonicalVolumeLink } = req.body.volumeInfo;

        AllKindOfBooks.create({
            id,
            title,
            authors,
            publisher,
            publishedDate,
            description,
            industryIdentifiers,
            readingModes,
            pageCount,
            printedPageCount,
            dimensions,
            printType,
            categories,
            averageRating,
            ratingsCount,
            maturityRating,
            allowAnonLogging,
            contentVersion,
            panelizationSummary,
            imageLinks,
            language,
            previewLink,
            infoLink,
            canonicalVolumeLink
        })
        
        .then(datos => {
           
            User.findByIdAndUpdate(req.params.userId, {$push: { [name]: req.body}}, {new: true})
            .then(theResponse => {
                res.json(theResponse).status(200);
            })
            .catch(err => {
                res.json(err).status(500);
            })
            res.json(datos).status(200)
        })
        .catch(err => {
            console.error(err)
            res.status(500)
        })

    })

    router.delete('/books/:userId/pull/:name/:bookobjId', (req, res, next) => {
        const { id } = req.body
        const { name, bookobjId } = req.params
       console.log(req.params.bookobjId, 'sdgjskgksksdkhsk')
            User.findByIdAndUpdate(req.params.userId, {$pull: {[name] :  {id: bookobjId}}}, {new: true})
            .then(theResponse => {
                console.log('voy a cortarme las venas', theResponse)
                res.json(theResponse);
            })
            .catch(err => {
                res.json(err);
            })
        })

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

router.get('/books/created/one/:bookId', isLoggedIn(), (req, res, next) => {
      Book.findById(req.params.bookId)
      .then(response => {
        res.json(response);
      })
      .catch(err => {
        res.json(err);
      })
})

router.post('/books/:bookId', isLoggedIn(), (req, res, next) => {
    const { title, author, comment } = req.body;
    Book.findByIdAndUpdate(req.params.bookId, { $push: { review: { title, author: req.session.currentUser, comment } } }, {new: true})
    .populate('author')
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

router.get('/user/info/:userId', (req, res, next) => {
    const { userId } = req.params
    User.findById(userId)
        .then(data =>{
            console.log(data)
        res.json(data).status(200)})
            .catch(err =>{
                console.error(err)
                res.status(500)})
})

router.get('/lists/:userId/bookshelf/paper', (req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        res.json(user.paperBooksAPI);
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

router.put('/lists/:bookId/move/:from/:to', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, { $pull: { [req.params.from]: req.params.bookId }}, {new: true})
        .then((response) => {
            User.findByIdAndUpdate(req.session.currentUser._id, { $push: {[req.params.to]: req.params.bookId }}, {new: true})
            .then(theResponse => {
                res.json(theResponse);
            })
            .catch(err => {
                res.json(err);
            })
        })
        .catch(err => {
            res.json(err);
        })
    })
    .catch( err => {
        res.json(err);
    });
});

router.delete('/lists/:bookId/delete/:name', isLoggedIn(), (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((response) => {
        User.findByIdAndUpdate(req.session.currentUser._id, {$pull: { [req.params.name]: req.params.bookId}}, {new: true})
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

router.get('/book-clubs/:userId/joined', isLoggedIn(), (req, res, next) => {
    User.findById(req.params.userId)
    .populate('joinedBookClubs')
    .then(user => {
        res.json(user.joinedBookClubs)
    })
    .catch(err => {
        res.json(err)
    })
});

router.get('/book-clubs/:userId/created', isLoggedIn(), (req, res, next) => {
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
router.get('/book-clubs/created/one/:clubId', isLoggedIn(), (req, res, next) => {
    Club.findById(req.params.clubId)
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.json(err);
    })
})

router.post('/book-clubs/add', isLoggedIn(), (req, res, next) => {
    console.log(req.body.title);
    Club.create({
       title: req.body.title,
       description: req.body.description,
       currentBookTitle: req.body.currentBookTitle, 
       meetingDate: req.body.meetingDate,
       meetingHour: req.body.meetingHour, 
       meetingLink: req.body.meetingLink,
       creator: req.session.currentUser._id
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
    .catch( err => {
        res.json(err);
    });
});

router.patch('/book-clubs/:clubId/edit', isLoggedIn(), (req, res, next) => {
    let { title, description, currentBookTitle, meetingDate, meetingHour, meetingLink, imageUrl } = req.body;
    User.findById(req.session.currentUser._id)
    .then(async user => {
        const userClubs = user.createdBookClubs
        if(!userClubs.includes(req.params.clubId)) {
            next(createError(401))
        } else {
            
            return Club.findByIdAndUpdate(req.params.clubId, { title, description, currentBookTitle, meetingDate, meetingHour, meetingLink, imageUrl: req.body.imageUrl ? req.body.imageUrl : req.session.currentUser.imageUrl }, {new: true})
        }
    })
    .then(() => {
        res.json({ message: `Club with ${req.params.clubId} is updated successfully.` });
    })
    .catch(err => {
      res.json(err);
    });
})

router.delete('/book-clubs/:clubId',isLoggedIn(), (req, res, next) => {
    Club.findByIdAndRemove(req.params.clubId)
    .then((response) => {
        console.log('response', response)
        User.findByIdAndUpdate(req.session.currentUser._id, {$pull: { createdBookClubs: req.params.clubId }}, {new: true})
        .then(user =>  {
            let query;
            if (user.createdBookClubs.length > 0) {
                query = {isClubCreator: true}
            } else {
                query = {isClubCreator: false}
            }

            User.findByIdAndUpdate(req.session.currentUser._id, {$set: query}, {new: true})
            .then(theResponse => {
                res.json(theResponse);
            })
            .catch(err => {
                res.json(err);
            })
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
