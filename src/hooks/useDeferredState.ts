import { useDeferredValue, useState } from "react";

export default function useDeferredState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const deferredState = useDeferredValue(state)
  return [state, deferredState, setState]
}
