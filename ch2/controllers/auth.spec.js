const {join, login, logout, localCallback} = require('./auth');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

describe('join', () => {
  it('이메일이 없으면 프론트로 no_email 에러를 쿼리스트링으로 보낸다', async () => {
    const req = {
      body: {
        email: '',
        password: 'password0!',
        nick: '제로초',
      }
    }
    const res = {
      redirect: jest.fn(),
    };
    const next = () => {};

    await join(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/join?error=no_email');
  });

  it('닉네임이 없으면 프론트로 no_nick 에러를 쿼리스트링으로 보낸다', async () => {
    const req = {
      body: {
        email: 'zerohch0@gmail.com',
        password: 'password0!',
        nick: '',
      }
    }
    const res = {
      redirect: jest.fn(),
    };
    const next = () => {};

    await join(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/join?error=no_nick');
  });

  it('비밀번호가 없으면 프론트로 no_password 에러를 쿼리스트링으로 보낸다', async () => {
    const req = {
      body: {
        email: 'zerohch0@gmail.com',
        password: '',
        nick: '제로초',
      }
    }
    const res = {
      redirect: jest.fn(),
    };
    const next = () => {};

    await join(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/join?error=no_password');
  });

  it('이미 가입한 이메일이면 에러를 띄운다', async () => {
    const req = {
      body: {
        email: 'zerohch0@gmail.com',
        password: 'password0!',
        nick: '제로초',
      }
    }
    const res = {
      redirect: jest.fn(),
    };
    const next = () => {};
    jest.spyOn(User, 'findOne').mockResolvedValue({ id: 1 });
    jest.spyOn(User, 'create').mockImplementation();
    
    await join(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/join?error=exist');
    expect(User.create).not.toHaveBeenCalled();
  });

  it('회원가입 도중에 에러가 발생하면 에러를 응답한다', async () => {
    const req = {
      body: {
        email: 'zerohch0@gmail.com',
        password: 'password0!',
        nick: '제로초',
      }
    }
    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();
    const error = new Error();

    jest.spyOn(User, 'findOne').mockRejectedValue(error);
    jest.spyOn(User, 'create').mockImplementation();
    
    await join(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
    expect(User.create).not.toHaveBeenCalled();
  });

  it('이미 가입한 이메일이 아니면 회원가입을 진행한다(암호화 후 디비 저장)', async () => {
    const req = {
      body: {
        email: 'zerohch0@gmail.com',
        password: 'password0!',
        nick: '제로초',
      }
    }
    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    jest.spyOn(User, 'create').mockImplementation();
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');
    
    await join(req, res, next);
    expect(res.redirect).toHaveBeenCalledWith('/');
    expect(User.create).toHaveBeenCalledWith({
      email: 'zerohch0@gmail.com',
      password: 'hashed',
      nick: '제로초',
    });
  });
});

describe('login', () => {
  it('로그인함수는 passport.authenticate 함수를 실행한다', () => {
    jest.spyOn(passport, 'authenticate').mockImplementation(() => () => {});
    const req = {};
    const res = {};
    const next = () => {};

    login(req, res, next);
    expect(passport.authenticate).toHaveBeenCalledTimes(1);
  });

  it('로컬 로그인 시 에러가 있으면 에러처리함수로 에러를 넘긴다', () => {
    const authError = new Error();
    const req = {};
    const res = {};
    const next = jest.fn();
    localCallback(req, res, next)(authError);
    expect(next).toHaveBeenCalledWith(authError);
  })

  it('로컬 로그인 시 에러가 없지만 유저도 없으면 프론트 쿼리스트링으로 에러를 보낸다', () => {
    const req = {};
    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();
    localCallback(req, res, next)(null, null, {
      message: '유저 없음'
    });
    expect(res.redirect).toHaveBeenCalledWith(`/?error=유저 없음`);
  })

  it('로컬 로그인은 성공했는데 req.login에서 에러가 있으면 에러처리함수로 에러를 보낸다', () => {
    const loginError = new Error();
    const req = {
      login: jest.fn((user, cb) => {
        cb(loginError);
      })
    };
    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();
    localCallback(req, res, next)(null, {}, null);
    expect(req.login).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(loginError);
  })

  it('로컬 로그인은 성공했고 req.login에도 에러가 없으면 프론트 /로 돌려보낸다', () => {
    const loginError = new Error();
    const req = {
      login: jest.fn((user, cb) => {
        cb();
      })
    };
    const res = {
      redirect: jest.fn(),
    };
    const next = jest.fn();
    localCallback(req, res, next)(null, {}, null);
    expect(req.login).toHaveBeenCalledTimes(1);
    expect(res.redirect).toHaveBeenCalledWith('/');
    expect(next).not.toHaveBeenCalled();
  })
});

describe('logout', () => {
  it('로그아웃 시에는 req.logout 호출 후 /로 되돌려 보낸다.', () => {
    const req = {
      logout: jest.fn((cb) => {
        cb();
      }),
    };
    const res = {
      redirect: jest.fn(),
    };

    logout(req, res);
    expect(req.logout).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  });
})