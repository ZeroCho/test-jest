const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

const afterDeserialize = (id, done) => {
  console.log('deserialize');
  return User.findOne({
    where: { id },
    include: [{
      model: User,
      attributes: ['id', 'nick'],
      as: 'Followers',
    }, {
      model: User,
      attributes: ['id', 'nick'],
      as: 'Followings',
    }],
  })
    .then(user => {
      console.log('user', user);
      done(null, user);
     })
    .catch(err => done(err));
};
const passportInit = () => {
  passport.serializeUser((user, done) => {
    console.log('serialize');
    done(null, user.id);
  });

  passport.deserializeUser(afterDeserialize);

  local();
  kakao();
};
passportInit.afterDeserialize = afterDeserialize;
module.exports = passportInit;