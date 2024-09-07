import LogIn from './LogIn';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

test('LogIn 화면이 잘 보인다', async () => {
  render(<LogIn />);

  expect(screen.getByText(/sleact/i)).toBeInTheDocument();
});

test('이메일, 비밀번호 입력 없이 로그인 버튼을 클릭하면 에러메시지가 표시된다', async () => {
  render(<LogIn />);

  fireEvent.click(screen.getByRole('button'));

  expect(screen.getByText(/일치하지 않습니다/i)).toBeInTheDocument();
});

test('로그인 화면은 이메일 주소, 비밀번호 인풋이 무조건 있어야 한다', () => {
  const { container } = render(<LogIn />);
  expect(container.querySelector('#email-label span')?.textContent)
    .toMatchInlineSnapshot(`"이메일"`);
  expect(container.querySelector('#password-label span')?.textContent)
    .toMatchInlineSnapshot('"패스워드"');
});