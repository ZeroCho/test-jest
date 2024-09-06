const Post = require('./post');

describe('Post', () => {
  it('initiate가 정상 작동한다', () => {
    const fn = jest.spyOn(Post, 'init').mockImplementation();
    Post.initiate({});
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('associate가 정상 작동한다', () => {
    const db = {
      Post: {
        belongsTo: jest.fn(),
        belongsToMany: jest.fn(),
      }
    }
    Post.associate(db);
    expect(db.Post.belongsTo).toHaveBeenCalledTimes(1);
    expect(db.Post.belongsToMany).toHaveBeenCalledTimes(1);
  })  
});