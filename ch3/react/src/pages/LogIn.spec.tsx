import { act } from 'react';
import ReactDOM from 'react-dom/client';
import LogIn from './LogIn';

test('LogIn 화면이 잘 보인다', async () => {
  const container = document.createElement('div');
  await act(() => {
    ReactDOM.createRoot(container).render(<LogIn />);
  });

  expect(container.querySelector('header')?.textContent).toBe('Sleact');
});

test('이메일, 비밀번호 입력 없이 로그인 버튼을 클릭하면 에러메시지가 표시된다', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  await act(() => {
    ReactDOM.createRoot(container).render(<LogIn />);
  });

  expect(container.querySelector('header')?.textContent).toBe('Sleact');

  const submitButton = container.querySelector('#submit');
  let errorMessage = container.querySelector('#errorMessage');
  expect(errorMessage?.textContent).toBe(undefined);

  await act(() => {
    submitButton?.dispatchEvent(new MouseEvent('click'));
  });

  errorMessage = container.querySelector('#errorMessage');
  expect(errorMessage?.textContent).toBe('이메일과 비밀번호 조합이 일치하지 않습니다.');
});