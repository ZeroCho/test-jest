const { kakaoCallbackSuccess } = require("./auth")

it('kakaoCallbackSuccess는 카카오로그인 성공 시 /로 되돌려보내야 한다', () => {
    const res = {
        redirect: jest.fn()
    }
    kakaoCallbackSuccess({}, res);
    expect(res.redirect).toHaveBeenCalledWith('/');
})