const {sequelize} = require('./models');
jest.mock('express', () => {
  const app = jest.requireActual('express')();
  jest.spyOn(app, 'listen').mockImplementation();
  const express = () => app;
  Object.assign(express, jest.requireActual('express'))
  return express;
});
beforeEach(() => {
  jest.resetModules();
})
it('app.js가 실행될 때 sequelize.sync가 성공하면 then을 호출한다', () => {
  jest.spyOn(sequelize, 'sync').mockResolvedValue(undefined);
  const app = require('./app');
  expect(app).toBeDefined();
});
it('app.js가 실행될 때 sequelize.sync가 실패하면 catch를 호출한다', () => {
  jest.spyOn(sequelize, 'sync').mockRejectedValue(new Error());
  const app = require('./app');
  expect(app).toBeDefined();
});
it('notFoundHandler가 잘 실행된다', () => {
  const {notFoundHandler} = require('./app');
  const next = jest.fn();
  const error = new Error(`GET / 라우터가 없습니다.`);
  error.status = 404;
  notFoundHandler({ method: 'GET', url: '/' }, {}, next);
  expect(next).toHaveBeenCalledWith(error);
})
it('NODE_ENV가 production이 아닐 때 errorHandler가 error와 함께 실행된다', () => {
  const {errorHandler} = require('./app');
  const error = new Error('메시지1');
  error.status = 503;
  const res = {
    locals: {},
    status: jest.fn(),
    render: jest.fn(),
  }
  errorHandler(error, {}, res)
  expect(res.locals.message).toBe('메시지1');
  expect(res.locals.error).toStrictEqual(error);
  expect(res.status).toHaveBeenCalledWith(503);
  expect(res.render).toHaveBeenCalledWith('error');
})
it('NODE_ENV가 production일 때 errorHandler가 error 없이 실행된다', () => {
  process.env.NODE_ENV = 'production';
  const {errorHandler} = require('./app');
  const error = new Error('메시지2');
  const res = {
    locals: {},
    status: jest.fn(),
    render: jest.fn(),
  }
  errorHandler(error, {}, res)
  expect(res.locals.message).toBe('메시지2');
  expect(res.locals.error).toStrictEqual({});
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.render).toHaveBeenCalledWith('error');
})
it('listenCallback이 잘 실행된다', () => {
  const {listenCallback} = require('./app');
  expect(listenCallback()).toBe(undefined);
})
it('syncSuccess가 잘 실행된다', () => {
  const {syncSuccess} = require('./app');
  expect(syncSuccess()).toBe(undefined);
})

afterEach(() => {
  process.env.NODE_ENV = 'test';
});