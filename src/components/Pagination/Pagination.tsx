import React from "react";
import PaginationItemNumber from "./PaginationItemNumber";
import classNames from "classnames";

interface Props {
  items: any[],
  pageTotal: number,
  pageIndex?: number,
  setPageIndex?: React.Dispatch<React.SetStateAction<number>>,
  pageSize?: number,
}

const Pagination = ({
  items,
                      pageIndex = 1,
                      setPageIndex = () => {
                      },
                      pageSize = 10,
  pageTotal,
                    }: Props) => {
  if (items.length <= pageSize) {
    return null;
  } else
    return (
      <ul className="pagination pagination--mtb3">
        <li
          onClick={
            pageIndex <= 1 ? undefined : () => setPageIndex(pageIndex - 1)
          }
          className={classNames("pagination-item", " pagination-item__left", {
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
        ></PaginationItemNumber>
        <li
          onClick={
            pageIndex >= pageTotal
              ? undefined
              : () => setPageIndex(pageIndex + 1)
          }
          className={classNames("pagination-item", " pagination-item__right", {
            "pagination-item--disabled": pageIndex >= pageTotal,
          })}
        >
          <div className="pagination-item__link">
            <i className="pagination-item__icon bi bi-chevron-right"></i>
          </div>
        </li>
      </ul>
    );
};

export default Pagination;
