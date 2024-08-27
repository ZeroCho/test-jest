jest.mock('./localStrategy');
jest.mock('./kakaoStrategy');
const passport = require('passport');
const { User } = require('../models');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');

it('패스포트 초기화 코드에서 serializeUser, deserializeUser, kakao, local 함수가 잘 실행된다', () => {

    jest.spyOn(passport, 'serializeUser').mockImplementation();
    jest.spyOn(passport, 'deserializeUser').mockImplementation();
    const passportInit = require('./index');
    passportInit();
    expect(passport.serializeUser).toHaveBeenCalledTimes(1);
    expect(passport.deserializeUser).toHaveBeenCalledTimes(1);
    expect(local).toHaveBeenCalledTimes(1);
    expect(kakao).toHaveBeenCalledTimes(1);
})
it('serializeUser 유저 아이디를 done 콜백으로 호출해야한다', () => {
    const done = jest.fn();
    jest.spyOn(passport, 'serializeUser').mockImplementation((cb) => {
        cb({ id: 1 }, done)
    });
    jest.spyOn(passport, 'deserializeUser').mockImplementation();
    const passportInit = require('./index');
    passportInit();
    expect(done).toHaveBeenCalledWith(null, 1);
})
it('deserializeUser 유저 객체를 done 콜백으로 호출해야한다', () => {
    const done = jest.fn();
    const {afterDeserialize} = require('./index');
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1 });
    const promise = afterDeserialize(1, done);
    return promise.then(() => {
        expect(done).toHaveBeenCalledWith(null, { id: 1 });
    })
})
it('deserializeUser 유저 조회 시 에러가 나면 done 콜백으로 에러를 호출해야한다', () => {
    const done = jest.fn();
    const {afterDeserialize} = require('./index');
    const error = new Error();
    jest.spyOn(User, 'findOne').mockRejectedValue(error);
    const promise = afterDeserialize(1, done);
    return promise.then(() => {
        expect(done).toHaveBeenCalledWith(error);
    })
})