import classNames from "classnames";
import PaginationItemNumber from "./PaginationItemNumber";
import usePagination from "@shoppe_nextjs/utils/hooks/usePagination";
import './pagination.module.scss'

//TODO: need rewrite as module css

// Define the Props interface with a generic type parameter T
interface Props<T> {
  items: T[];
  pageSize?: number;
  numOfPageShowing?: number
  numberOfPageShowingFromStart?: number
  numberOfPageShowingFromEnd?: number
}

// Use a generic type parameter T in the Pagination component
// can use arrow type but <T> will be <T,>
export default function Pagination<T>({
                         items,
                         pageSize = 10,
                         numOfPageShowing = 5,
                         numberOfPageShowingFromStart = 3,
                         numberOfPageShowingFromEnd = 3
                       }: Props<T>) {
  const { pageTotal, pageIndex, setPageIndex } = usePagination({ items, pageSize });

  if (items.length <= pageSize) {
    return null;
  } else {
    return (
      <ul className="pagination pagination--mtb3">
        <li
          onClick={
            pageIndex <= 1 ? undefined : () => setPageIndex(pageIndex - 1)
          }
          className={classNames("pagination-item", "pagination-item__left", {
            "pagination-item--disabled": pageIndex <= 1,
          })}
        >
          <div className="pagination-item__link">
            <i className="pagination-item__icon bi bi-chevron-left"></i>
          </div>
        </li>
        <PaginationItemNumber
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageTotal={pageTotal}
          numOfPageShowing={numOfPageShowing}
          numberOfPageShowingFromStart={numberOfPageShowingFromStart}
          numberOfPageShowingFromEnd={numberOfPageShowingFromEnd}
        />
        <li
          onClick={
            pageIndex >= pageTotal
              ? undefined
              : () => setPageIndex(pageIndex + 1)
          }
          className={classNames("pagination-item", "pagination-item__right", {
            "pagination-item--disabled": pageIndex >= pageTotal,
          })}
        >
          <div className="pagination-item__link">
            <i className="pagination-item__icon bi bi-chevron-right"></i>
          </div>
        </li>
      </ul>
    );
  }
}
