import { useState } from "react";

export default function usePagination<T>({ items, pageSize }: Partial<{ items: T[], pageSize: number }>) {
  const [pageIndex, setPageIndex] = useState(1);
  const pageTotal = (items && pageSize) ? Math.ceil(items.length / pageSize) : 0;

  return {
    pageIndex,
    setPageIndex,
    pageTotal
  }
}
