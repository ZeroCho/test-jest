const { countFollow } = require("./page");

it('countFollow는 팔로우 숫자를 res.locals에 추가해야 한다', () => {
    const req = {
        user: {
            Followers: [{ id: 1 }],
            Followings: [{ id: 2}, { id: 3 }]
        }
    }
    const res = {
        locals: {}
    }
    const next = jest.fn();
    countFollow(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.locals.user).toStrictEqual({
        Followers: [{ id: 1 }],
        Followings: [{ id: 2}, { id: 3 }]
    });
    expect(res.locals.followerCount).toBe(1)
    expect(res.locals.followingCount).toBe(2)
    expect(res.locals.followingIdList).toStrictEqual([2, 3])
});
it('countFollow는 팔로우 숫자가 없으면 기본값을 res.locals에 추가해야 한다', () => {
    const req = {
        user: {
            Followers: [],
            Followings: null
        }
    }
    const res = {
        locals: {}
    }
    const next = jest.fn();
    countFollow(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.locals.user).toStrictEqual({
        Followers: [],
        Followings: null
    });
    expect(res.locals.followerCount).toBe(0)
    expect(res.locals.followingCount).toBe(0)
    expect(res.locals.followingIdList).toStrictEqual([])
});