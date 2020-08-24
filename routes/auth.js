const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User");

// HELPERS
const {
    isLoggedIn,
    isNotLoggedIn,
    validationLoggin,
} = require("../helpers/middlewares");

//SIGNUP

router.post('/signup', isNotLoggedIn(), validationLoggin(), async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const emailExists = await User.findOne({ email }, 'email');
        if(emailExists) return next(createError(400));
        else {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashPass = bcrypt.hashSync(password, salt);
            const newUser = await User.create({ username, email, password: hashPass });

            req.session.currentUser = newUser;
            res
                .status(200)
                .json(newUser);
        }
    } catch (error) {
        next(error);
    }
});

//LOGIN
router.post('/login', isNotLoggedIn(), validationLoggin(), async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            next(createError(404));
        } else if (bcrypt.compareSync(password, user.password)) {
            req.session.currentUser = user;
            res.status(200).json(user);
        } else {
            next(createError(401));
        }
    } catch (error) {
        next(error);
    }
});

//LOGOUT
router.post('/logout', isLoggedIn(), (req, res, next) => {
    req.session.destroy();
    res
        .status(204)
        .send();
    return;
});

//PRIVATE
router.get('/private', isLoggedIn(), (req, res, next) => {
    res
        .status(200)
        .json({ message: 'Test - User is logged in' })
});

module.exports = router;