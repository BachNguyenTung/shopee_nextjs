import { useEffect, useState } from "react";


function useDebounce<T>({ value, delay }: {
  value: T,
  delay: number
}) {
  const [debouceValue, setDebounceValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value)
    }, delay / 1000);

    return () => {
      clearTimeout(timer)
    }
  }, [delay]);

  return { debouceValue }
}

export default useDebounce

