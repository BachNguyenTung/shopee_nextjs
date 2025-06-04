import React, {useEffect, useMemo} from "react";
import ProductItem from "./ProductItem";
import {Box, useMediaQuery} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import usePagination from "@shoppe_nextjs/utils/hooks/usePagination";
import {pageSize} from "@/constants/pagination";
import {useInView} from "react-intersection-observer";

function ProductList({ items }) {
  const { pageIndex, setPageIndex, pageTotal } = usePagination({ items, pageSize });
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");
  const { ref, inView } = useInView({
    threshold: 0
  });

  // scrollToTop
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && xsBreakpointMatches) {
      setPageIndex(prev => prev < pageTotal ? prev + 1 : prev);
    }
  }, [inView, xsBreakpointMatches, pageTotal, setPageIndex]);

  const renderItemsByPagination = useMemo(() => {
    return xsBreakpointMatches ? items.slice(0, pageIndex * pageSize)
      : items.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
  }, [items, pageIndex, pageSize, xsBreakpointMatches]);

  return (
    <>
      <Grid2 container columnSpacing="0.5rem" rowSpacing="1rem">
        {renderItemsByPagination.length === 0 && (
          <Box
            sx={{
              flex: 1,
              textAlign: "center",
              padding: "14.5rem",
              fontSize: "1.6rem",
              color: "var(--primary-color)",
              fontWeight: "600",
            }}
          >
            Không có sản phẩm...
          </Box>
        )}
        {renderItemsByPagination?.map((item) => (
          <ProductItem key={item.id} item={item}></ProductItem>
        ))}
      </Grid2>
      <div ref={ref} />
    </>
  );
}

export default ProductList;
