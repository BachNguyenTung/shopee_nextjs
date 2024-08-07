import React from "react";
import classNames from "classnames";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import usePagination from "@shoppe_nextjs/utils/hooks/usePagination";
import './miniPageControl.module.scss'

export default function MiniPageControl<T>({ items, pageSize }: { items: T[], pageSize: number }) {
  const { pageTotal, pageIndex, setPageIndex } = usePagination({ items, pageSize })
  return (
    <>
      <div className="app__page-number">
        {items.length >= pageSize && (
          <>
            <span className="app__page-index">{pageIndex}</span>/
            <span className="app__page-page-total">{pageTotal}</span>
          </>
        )}

        {/* <!--  app__pre-page--disabled --> */}
      </div>
      <div
        onClick={pageIndex <= 1 ? undefined : () => setPageIndex(pageIndex - 1)}
        className={classNames("app__filter-page-item", "app__pre-page", {
          "app__pre-page--disabled": pageIndex <= 1,
        })}
      >
        <ChevronLeft className="app__pre-icon"></ChevronLeft>
      </div>
      <div
        onClick={
          pageIndex >= pageTotal ? undefined : () => setPageIndex(pageIndex + 1)
        }
        className={classNames("app__filter-page-item", "app__next-page", {
          "app__next-page--disabled": pageIndex >= pageTotal,
        })}
      >
        <ChevronRight className="app__next-icon"></ChevronRight>
      </div>
    </>
  );
};

