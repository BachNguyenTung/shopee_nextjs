import { useAtom } from "jotai";
import pageIndexAtom from "../store/pageIndex.atom";

export default function usePagination<T>({ items, pageSize }: Partial<{ items: T[], pageSize: number }>) {
  const [pageIndex, setPageIndex] = useAtom(pageIndexAtom)
  const pageTotal = (!!items && pageSize) ? Math.ceil(items.length / pageSize) : 0;

  return {
    pageIndex,
    setPageIndex,
    pageTotal
  }
}
