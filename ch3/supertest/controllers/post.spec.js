const { afterUploadImage, uploadPost } = require("./post");
const { Post, Hashtag } = require('../models');

it('afterUploadImage은 res.json으로 url을 반환해야 한다', () => {
  const req = {
    file: {
      filename: 'test.png',
    }
  }
  const res = {
    json: jest.fn()
  }
  afterUploadImage(req, res);
  expect(res.json).toHaveBeenCalledWith({
    url: '/img/test.png'
  })
});

describe('uploadPost', () => {
  it('게시글 등록 시 실패하면 에러 처리 함수를 호출한다', async () => {
    const error = new Error();
    const next = jest.fn();
    const res = {
      redirect: jest.fn()
    }
    jest.spyOn(Post, 'create').mockRejectedValue(error);
    await uploadPost({ body: {}, user: {} }, res, next);
    expect(next).toHaveBeenCalledWith(error);
    expect(res.redirect).not.toHaveBeenCalled();
  });
  it('게시글 등록 성공 후 해시태그가 없으면 그냥 /로 돌려보낸다', async () => {
    const newPost = {
      addHashtags: jest.fn(),
    }
    jest.spyOn(Post, 'create').mockResolvedValue(newPost);
    jest.spyOn(Hashtag, 'findOrCreate').mockImplementation();
    const next = jest.fn();
    const res = {
      redirect: jest.fn()
    }
    await uploadPost({ body: {
      content: '게시글',
      url: '주소',
    }, user: { id: 1 } }, res, next);
    expect(Post.create).toHaveBeenCalledWith({
      content: '게시글',
      img: '주소',
      UserId: 1,
    })
    expect(next).not.toHaveBeenCalled();
    expect(newPost.addHashtags).not.toHaveBeenCalled();
    expect(Hashtag.findOrCreate).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  })
  it('게시글 등록 성공 후 해시태그 있으면 해시태그까지 저장 후 /로 돌려보낸다', async () => {
    const newPost = {
      addHashtags: jest.fn(),
    }
    jest.spyOn(Post, 'create').mockResolvedValue(newPost);
    jest.spyOn(Hashtag, 'findOrCreate')
      .mockResolvedValueOnce(['결과1'])
      .mockResolvedValueOnce(['결과2'])
      .mockResolvedValueOnce(['결과3'])
    const next = jest.fn();
    const res = {
      redirect: jest.fn()
    }
    await uploadPost({ body: {
      content: '#Post #해시태그 #ZeroCho',
      url: '주소',
    }, user: { id: 1 } }, res, next);
    expect(Post.create).toHaveBeenCalledWith({
      content: '#Post #해시태그 #ZeroCho',
      img: '주소',
      UserId: 1,
    })
    expect(next).not.toHaveBeenCalled();
    expect(Hashtag.findOrCreate).toHaveBeenCalledTimes(3);
    expect(Hashtag.findOrCreate.mock.calls[0][0].where.title).toBe('post')
    expect(Hashtag.findOrCreate.mock.calls[1][0].where.title).toBe('해시태그')
    expect(Hashtag.findOrCreate.mock.calls[2][0].where.title).toBe('zerocho')
    expect(newPost.addHashtags).toHaveBeenCalledTimes(1);
    expect(newPost.addHashtags).toHaveBeenCalledWith(['결과1','결과2','결과3']);
    expect(res.redirect).toHaveBeenCalledWith('/');
  })
})