import { EventHandler, ChangeEvent, useCallback, useState } from 'react';

const useInput = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  const handler = useCallback<EventHandler<ChangeEvent<HTMLInputElement>>>((e) => {
    setValue(e.target?.value);
  }, []);
  return [value, handler, setValue] as const;
};

export default useInput;