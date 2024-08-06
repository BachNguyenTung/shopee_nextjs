import { useAtom } from "jotai";
import pageIndexAtom from "../store/pageIndex.atom";

export default function usePagination<T>({ items, pageSize }: { items: T[], pageSize: number }) {
  const [pageIndex, setPageIndex] = useAtom(pageIndexAtom)

  const pageTotal = Math.ceil(items.length / pageSize);

  return {
    pageIndex,
    setPageIndex,
    pageTotal
  }
}
