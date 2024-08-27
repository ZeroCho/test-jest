const Hashtag = require('./hashtag');

describe('Hashtag', () => {
  it('initiate가 정상 작동한다', () => {
    const fn = jest.spyOn(Hashtag, 'init').mockImplementation();
    Hashtag.initiate({});
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('associate가 정상 작동한다', () => {
    const db = {
      Hashtag: {
        belongsToMany: jest.fn(),
      }
    }
    Hashtag.associate(db);
    expect(db.Hashtag.belongsToMany).toHaveBeenCalledTimes(1);
  })  
});