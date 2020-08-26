const createError = require('http-errors');

exports.isLoggedIn = () => (req, res, next) => {
  console.log('req session is logged',req.session)
  if (req.session.currentUser) next();
  else next(createError(401));
};

exports.isNotLoggedIn = () => (req, res, next) => {
  if (!req.session.currentUser) next();
  else next(createError(403));
};

exports.validationLoggin = () => (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) next(createError(400));
  else next();
}

