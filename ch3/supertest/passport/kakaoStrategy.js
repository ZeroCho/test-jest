const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

const kakaoStrategy = async (accessToken, refreshToken, profile, done) => {
  console.log('kakao profile', profile);
  try {
    const exUser = await User.findOne({
      where: { snsId: profile.id, provider: 'kakao' },
    });
    if (exUser) {
      done(null, exUser);
    } else {
      const newUser = await User.create({
        email: profile._json?.kakao_account?.email,
        nick: profile.displayName,
        snsId: profile.id,
        provider: 'kakao',
      });
      done(null, newUser);
    }
  } catch (error) {
    console.error(error);
    done(error);
  }
};
const kakaoStrategyInit = () => {
  passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID,
    callbackURL: '/auth/kakao/callback',
  }, kakaoStrategy));
};
kakaoStrategyInit.kakaoStrategy = kakaoStrategy;
module.exports = kakaoStrategyInit;
