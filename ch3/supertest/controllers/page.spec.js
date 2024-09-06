jest.mock('../models');

const { renderProfile, renderJoin, renderHashtag, renderMain } = require("./page")
const { Post, Hashtag } = require('../models');

it('renderProfile은 res.render profile을 호출해야 함', () => {
  const res = {
    render: jest.fn(),
  };
  renderProfile({}, res);
  expect(res.render).toHaveBeenCalledWith('profile', { title: '내 정보 - NodeBird' });
})

it('renderJoin은 res.render join 호출해야 함', () => {
  const res = {
    render: jest.fn(),
  };
  renderJoin({}, res);
  expect(res.render).toHaveBeenCalledWith('join', { title: '회원가입 - NodeBird' });
})

describe('renderMain', () => {
  it('게시글 조회 시 에러가 발생한다면 에러처리함수로 에러를 넘김', async () => {
    const error = new Error();
    jest.spyOn(Post, 'findAll').mockRejectedValue(error);
    const res = {
      render: jest.fn(),
    }
    const next = jest.fn();
    await renderMain({}, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
  it('게시글 조회한 것을 res.render로 화면에 렌더링', async () => {
    const error = new Error();
    jest.spyOn(Post, 'findAll').mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = {
      render: jest.fn(),
    }
    const next = jest.fn();
    await renderMain({}, res, next);
    expect(res.render).toHaveBeenCalledWith('main', {
      title: 'NodeBird',
      twits: [{ id: 1 }, { id: 2 }],
    })
    expect(next).not.toHaveBeenCalled();
  });
});

describe('renderHashtag', () => {
  it('hashtag 쿼리스트링이 없으면 /로 돌려보낸다', async () => {
    const res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
    const next = jest.fn();
    await renderHashtag({ query: {} }, res, next);
    expect(res.render).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith('/');
  })

  it('hashtag 쿼리스트링이 있으나 DB에서 findOne할 때 에러가 나면 에러처리 함수를 호출한다', async () => {
    const error = new Error();
    const res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
    const next = jest.fn();
    jest.spyOn(Hashtag, 'findOne').mockRejectedValue(error);
    await renderHashtag({ query: { hashtag: '고양이' } }, res, next);
    expect(res.render).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
    expect(res.redirect).not.toHaveBeenCalled();
  })

  it('hashtag 쿼리스트링이 있으나 DB에 해시태그가 없는 경우 빈 화면을 렌더링한다', async () => {
    const res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
    const next = jest.fn();
    jest.spyOn(Hashtag, 'findOne').mockResolvedValue(null);
    await renderHashtag({ query: { hashtag: '고양이' } }, res, next);
    expect(res.render).toHaveBeenCalledWith('main', {
      title: `고양이 | NodeBird`,
      twits: [],
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  })

  it('hashtag 쿼리스트링이 있고 DB에도 해시태그 있는 경우 그 게시글을 화면에 렌더링한다', async () => {
    const res = {
      render: jest.fn(),
      redirect: jest.fn(),
    }
    const next = jest.fn();
    jest.spyOn(Hashtag, 'findOne').mockResolvedValue({ id: 5, getPosts: () => [{ id: 1}, { id: 2 }] });
    await renderHashtag({ query: { hashtag: '고양이' } }, res, next);
    expect(res.render).toHaveBeenCalledWith('main', {
      title: `고양이 | NodeBird`,
      twits: [{ id: 1}, { id: 2 }],
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.redirect).not.toHaveBeenCalled();
  })
})

