const fs = require('fs');
jest.mock('../controllers/post')

beforeEach(() => {
    jest.resetModules();
})
it('post가 잘 실행된다', () => {
    const post = require('./post');
    expect(post).toBeDefined();
})
it('fs.readdirSync가 실패하면 mkdirSync가 실행된다', () => {
    jest.spyOn(fs, 'readdirSync').mockImplementation(() => {
        throw new Error();
    })
    jest.spyOn(fs, 'mkdirSync').mockImplementation();
    require('./post');
    expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
})
it('destination 함수를 호출하면 콜백 함수를 호출한다', () => {
    const cb = jest.fn();
    const { multerOption } = require('./post');
    multerOption.destination(null, null, cb);
    expect(cb).toHaveBeenCalledWith(null, 'uploads/')
})
it('filename 함수를 호출하면 콜백 함수를 호출한다', () => {
    jest.useFakeTimers().setSystemTime(new Date(2024, 7, 28))
    const cb = jest.fn();
    const { multerOption } = require('./post');
    multerOption.filename(null, { originalname: 'test.png' }, cb);
    expect(cb).toHaveBeenCalledWith(null, 'test1724770800000.png')
})

afterEach(() => {
    jest.useRealTimers();
})