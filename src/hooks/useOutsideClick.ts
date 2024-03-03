import { useEffect, useRef, MutableRefObject } from "react";

type OutsideClickHandler = () => void;

// Reusable outsude click for any component
export function useOutsideClick(
  handler: OutsideClickHandler,
  listenCapturing: boolean = true
): MutableRefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent): void {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return ref;
}
