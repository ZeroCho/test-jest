const { User } = require('../models');
const localStrategyInit = require('./localStrategy');
const bcrypt = require('bcrypt');

describe('localStrategy', () => {
  it('유저가 존재하고 비밀번호도 일치하면 done 콜백을 호출한다', async () => {
    const done = jest.fn();
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1 });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    await localStrategyInit.localStrategy('zerohch0@gmail.com', 'password', done);
    expect(done).toHaveBeenCalledWith(null, { id: 1 });
  });

  it('유저가 존재하고 비밀번호가 틀리면 메시지와 함께 done 콜백을 호출한다', async () => {
    const done = jest.fn();
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1 });
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await localStrategyInit.localStrategy('zerohch0@gmail.com', 'password', done);
    expect(done).toHaveBeenCalledWith(null, false, { message: '비밀번호가 일치하지 않습니다.' });
  });

  it('유저가 존재하지 않는 경우 메시지와 함께 done 콜백을 호출한다', async () => {
    const done = jest.fn();
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await localStrategyInit.localStrategy('zerohch0@gmail.com', 'password', done);
    expect(done).toHaveBeenCalledWith(null, false, { message: '가입되지 않은 회원입니다.' });
    expect(bcrypt.compare).not.toHaveBeenCalled()
  });

  it('유저 조회 중에 에러가 발생하면 에러를 응답한다', async () => {
    const error = new Error();
    const done = jest.fn();
    jest.spyOn(User, 'findOne').mockRejectedValue(error);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await localStrategyInit.localStrategy('zerohch0@gmail.com', 'password', done);
    expect(done).toHaveBeenCalledWith(error);
    expect(bcrypt.compare).not.toHaveBeenCalled()
  });
});
