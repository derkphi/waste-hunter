import { SetStateAction, useState} from 'react';

const useInput = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setValue(event.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};

export default useInput;
