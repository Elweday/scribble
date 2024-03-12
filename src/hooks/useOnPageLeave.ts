import { useEffect } from "react";
export const useOnPageLeave = (handler: () => void) => {
    useEffect(() => {
      window.onbeforeunload = () => handler();
  
      window.addEventListener('beforeunload', (event) => {
        handler();
      });
      return () => {
        document.removeEventListener('beforeunload', handler);
      };
    });
  };
  