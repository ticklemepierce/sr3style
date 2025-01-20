import { useCallback, useEffect, useState } from 'react';

const useTabActive = ({
  onFocus,
  onBlur,
}: {
  onFocus: () => void;
  onBlur?: () => void;
}) => {
  const [visibilityState, setVisibilityState] = useState(true);

  const handleVisibilityChange = useCallback(() => {
    const isVisible = document.visibilityState === 'visible';
    setVisibilityState(isVisible);

    if (isVisible && onFocus) {
      onFocus();
    }
    if (!isVisible && onBlur) {
      onBlur();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return visibilityState;
};

export default useTabActive;
