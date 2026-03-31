import { useState, useCallback } from "react";

export function useToggle(initial: boolean = false) {
  const [value, setValue] = useState<boolean>(initial);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setOn = useCallback(() => {
    setValue(true);
  }, []);

  const setOff = useCallback(() => {
    setValue(false);
  }, []);

  return { value, toggle, setOn, setOff, setValue };
}

