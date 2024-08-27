const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  if (!email) {
    return res.redirect('/join?error=no_email');
  }
  if (!nick) {
    return res.redirect('/join?error=no_nick');
  }
  if (!password) {
    return res.redirect('/join?error=no_password');
  }
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

const localCallback = (req, res, next) => (authError, user, info) => {
  if (authError) {
    console.error(authError);
    return next(authError);
  }
  if (!user) {
    return res.redirect(`/?error=${info?.message}`);
  }
  return req.login(user, (loginError) => {
    if (loginError) {
      console.error(loginError);
      return next(loginError);
    }
    return res.redirect('/');
  });
};
exports.localCallback = localCallback;
exports.login = (req, res, next) => {
  passport.authenticate('local', localCallback(req, res, next))(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
