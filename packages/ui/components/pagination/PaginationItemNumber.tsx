import React from "react";
import classNames from "classnames";
import styles from './pagination.module.scss'
import { cn } from "@shoppe_nextjs/utils/utils";

export default function PaginationItemNumber({
                                               pageIndex,
                                               setPageIndex,
                                               pageTotal,
                                               numOfPageShowing,
                                               numberOfPageShowingFromStart,
                                               numberOfPageShowingFromEnd
                                             }: {
  pageIndex: number,
  setPageIndex: React.Dispatch<React.SetStateAction<number>>,
  pageTotal: number,
  numOfPageShowing: number,
  numberOfPageShowingFromStart: number,
  numberOfPageShowingFromEnd: number
}) {
  let arrayOfPageIndexElements = [];
  for (let index = numberOfPageShowingFromStart; index <= pageTotal; index++) {
    //show pages from index to ... of pagination bar
    if (pageIndex <= numOfPageShowing && index <= numOfPageShowing) {
      arrayOfPageIndexElements.push(
        <li
          key={index}
          onClick={() => setPageIndex(index)}
          className={classNames(styles.paginationNumber, {
            [styles.paginationNumberActive]: pageIndex === index,
          })}
        >
          <div className={styles.paginationItem__link}>{index}</div>
        </li>
      );
    }

    //show pages between ... and ... of pagination bar
    else if (
      pageIndex >= numOfPageShowing &&
      index < pageIndex + numberOfPageShowingFromEnd &&
      index > pageIndex - numberOfPageShowingFromStart
    ) {
      arrayOfPageIndexElements.push(
        <li
          key={index}
          onClick={() => setPageIndex(index)}
          className={classNames(styles.paginationNumber, {
            [styles.paginationNumberActive]: pageIndex === index,
          })}
        >
          <div className={styles.paginationItem__link}>{index}</div>
        </li>
      );
    }

    //show pages from ... to the end of pagination bar
    else if (
      pageIndex > pageTotal - numberOfPageShowingFromEnd &&
      index > pageTotal - numOfPageShowing
    ) {
      arrayOfPageIndexElements.push(
        <li
          key={index}
          onClick={() => setPageIndex(index)}
          className={classNames(styles.paginationNumber, {
            [styles.paginationNumberActive]: pageIndex === index,
          })}
        >
          <div className={styles.paginationItem__link}>{index}</div>
        </li>
      );
    }
  }

  return (
    <>
      <li
        onClick={() => setPageIndex(1)}
        className={classNames(styles.paginationNumber, {
          [styles.paginationNumberActive]: pageIndex === 1,
        })}
      >
        <div className={styles.paginationItem__link}>1</div>
      </li>
      <li
        onClick={() => setPageIndex(2)}
        className={classNames(styles.paginationNumber, {
          [styles.paginationNumberActive]: pageIndex === 2,
        })}
      >
        <div className={styles.paginationItem__link}>2</div>
      </li>
      {/* Show ... from the start of pagination bar  */}
      {pageIndex > numOfPageShowing && (
        <li className={cn(styles.paginationItem, styles.paginationItemNonClick)}>
          <div className={styles.paginationItem__link}>...</div>
        </li>
      )}
      {arrayOfPageIndexElements}
      {/* show ... from the ending of pagination bar*/}
      {pageTotal > numOfPageShowing &&
        pageIndex <= pageTotal - numberOfPageShowingFromEnd && (
          <li className={cn(styles.paginationItem, styles.paginationItemNonClick)}>
            <div className={styles.paginationItem__link}>...</div>
          </li>
        )}
    </>
  );
}
