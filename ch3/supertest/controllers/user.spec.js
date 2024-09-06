const {User} = require('../models');
const { follow } = require('./user');
describe('follow', () => {
  it('유저 조회 시 에러가 나면 에러 처리 함수를 호출한다', async () => {
    const error = new Error();
    jest.spyOn(User, 'findOne').mockRejectedValue(error);
    const next = jest.fn();
    await follow({ user: {} }, {}, next)
    expect(next).toHaveBeenCalledWith(error);
  })
  it('유저가 존재하면 팔로우를 추가한 뒤 success를 응답한다', async () => {
    const user = { id: 1, addFollowing: jest.fn() };
    jest.spyOn(User, 'findOne').mockResolvedValue(user);
    const next = jest.fn();
    const res = {
      status: jest.fn(),
      send: jest.fn(),
    }
    await follow({ user: { id: 1 }, params: { id: 2 } }, res, next)
    expect(next).not.toHaveBeenCalled();
    expect(user.addFollowing).toHaveBeenCalledWith(2);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith('success');
  })
  it('유저가 존재하지 않으면 404 no user를 응답한다', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const next = jest.fn();
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    }
    await follow({ user: { id: 1 }, params: { id: 2 } }, res, next)
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith('no user');
  })
})