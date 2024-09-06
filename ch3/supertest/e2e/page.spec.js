const request = require('supertest');
const { app } = require('../app');
const { sequelize } = require('../models');

beforeAll(async () => {
  // DB 연결, 테이블 초기화
  await sequelize.sync({ force: true });
});

describe('GET /', () => {
  test('/로 요청을 보내면 200 응답이 온다', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
    expect(response).toBeDefined();
  });
})

describe('POST /auth/join', () => {
  test('회원가입에 성공하면 /으로 리다이렉트', (done) => {
    request(app)
      .post('/auth/join')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
        nick: '제로초',
      })
      .expect('Location', '/')
      .expect(302, done)
  });

  test('이미 존재하는 유저를 또 가입하면 /join으로 리다이렉트', (done) => {
    request(app)
      .post('/auth/join')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
        nick: '제로초',
      })
      .expect('Location', '/join?error=exist')
      .expect(302, done)
  });
});

describe('POST /auth/login', () => {
  const agent = request.agent(app);
  beforeAll((done) => {
    agent
      .post('/auth/join')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
        nick: '제로초',
      })
      .end(done)
  });

  test('가입하지 않은 회원이 로그인하려는 경우 실패 알리기', (done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'zerohch1@gmail.com',
        password: 'nodejsbook',
      })
      .expect('Location', '/?error=%EA%B0%80%EC%9E%85%EB%90%98%EC%A7%80%20%EC%95%8A%EC%9D%80%20%ED%9A%8C%EC%9B%90%EC%9E%85%EB%8B%88%EB%8B%A4.')
      .expect(302, done);
  });

  test('가입한 사람이 로그인 하는 경우 메인 페이지로 돌려보내기', (done) => {
    agent
      .post('/auth/login')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
      })
      .expect('Location', '/')
      .expect(302, done);
  })
})

describe('POST /auth/logout', () => {
  const agent = request.agent(app)
  beforeAll((done) => {
    agent.post('/auth/login')
      .send({
        email: 'zerohch0@gmail.com',
        password: 'nodejsbook',
      })
      .end(done)
  });
  it('로그아웃 성공하면 /로 돌려보낸다', (done) => {
    agent
      .get('/auth/logout')
      .expect('Location', '/')
      .expect(302, done);
  });
  it('로그인을 안 했는데 로그아웃하면 /로 돌려보낸다', (done) => {
    expect.assertions(1);
    agent
      .get('/auth/logout')
      .expect(403)
      .then((response) => {
        expect(response.text).toBe('로그인 필요')
        done();
      });
  });
})

afterAll(async () => {
  // DB 연결 끊기
  await sequelize.close()
  jest.clearAllTimers();
})