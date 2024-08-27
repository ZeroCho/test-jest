const User = require('./user');

describe('User', () => {
  it('initiate가 정상 작동한다', () => {
    const fn = jest.spyOn(User, 'init').mockImplementation();
    User.initiate({});
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('associate가 정상 작동한다', () => {
    const db = {
      User: {
        hasMany: jest.fn(),
        belongsToMany: jest.fn(),
      }
    }
    User.associate(db);
    expect(db.User.hasMany).toHaveBeenCalledTimes(1);
    expect(db.User.belongsToMany).toHaveBeenCalledTimes(2);
  })  
});