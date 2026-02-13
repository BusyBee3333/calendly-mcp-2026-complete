import { useState, useCallback } from 'react';

export function useDirtyState<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [dirty, setDirty] = useState(false);

  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(newValue);
    setDirty(true);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setDirty(false);
  }, [initialValue]);

  return { value, setValue: updateValue, dirty, reset };
}
