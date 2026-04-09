import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimedMessageOptions {
  duration?: number;
}

export const useTimedMessage = (
  options: UseTimedMessageOptions = {},
) => {
  const { duration = 3000 } = options;
  const [message, setMessage] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearMessage = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessage("");
  }, []);

  const showMessage = useCallback(
    (nextMessage: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(nextMessage);

      if (!nextMessage) {
        timeoutRef.current = null;
        return;
      }

      timeoutRef.current = setTimeout(() => {
        setMessage("");
        timeoutRef.current = null;
      }, duration);
    },
    [duration],
  );

  useEffect(() => clearMessage, [clearMessage]);

  return {
    message,
    showMessage,
    clearMessage,
  };
};
