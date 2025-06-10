import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import HeaderCart from "./HeaderCart";
import { Close } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSearchHistory from "@/hooks/useSearchHistory";

interface Props {
  isCartPage: boolean,
  isCheckoutPage: boolean,
  xsBreakpointMatches: boolean
}

const HeaderSearch: React.FC<Props> = ({ isCartPage, isCheckoutPage, xsBreakpointMatches }) => {
  const [searchInput, setSearchInput] = useState<string>('')
  const { addToSearchHistory, deleteFromSearchHistory, suggestions } =
    useSearchHistory(searchInput);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isHistory, setIsHistory] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.trim();
    setSearchInput(text);
  };

  const replaceUrlWithSearchText = (text: string) => {
    const params = new URLSearchParams(searchParams);
    if (text) {
      params.set('query', text);
      replace(`/search?${params.toString()}`);
    } else {
      params.delete('query');
      replace(pathname);
    }
  }

  const handleInputClick = () => {
    if (!xsBreakpointMatches) {
      setIsHistory(!isHistory);
    }
  };

  const handleSuggestionClick = (text: string) => {
    replaceUrlWithSearchText(text)
    handleSearchIconClick();
    if (inputRef?.current)
      inputRef.current.value = text; // Update input value
  };

  const handleSearchIconClick = () => {
    addToSearchHistory(searchInput);
    replaceUrlWithSearchText(searchInput);
    setIsHistory(false);
  };

  const handleHistoryDelete = (item: string) => {
    deleteFromSearchHistory(item);
  };

  const inputOnKeyUp = (event: any) => {
    const enter = 13;
    if (event.keyCode === enter) {
      event.currentTarget.blur();
      addToSearchHistory(event.target.value);
      replaceUrlWithSearchText(event.target.value);
      setIsHistory(false);
    }
  };

  useEffect(() => {
    if (xsBreakpointMatches) {
      setIsHistory(false);
    }
  }, [xsBreakpointMatches]);

  const onMouseDown = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsHistory(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener("mousedown", onMouseDown);
      return () => {
        document.removeEventListener("mousedown", onMouseDown);
      };
    }
  }, []);

  return (
    <div
      className={classNames("header__search", {
        "header__search--cart":
          (isCartPage && !xsBreakpointMatches) ||
          (isCheckoutPage && !xsBreakpointMatches),
      })}
    >
      <div className="header__logo-wrapper">
        <Link
          href="/"
          className={classNames("header__logo-link", {
            "header__logo-link--notHome": isCartPage || isCheckoutPage,
          })}
        >
          <img src={"/img/shoppe-logo.png"} alt="shoppe-logo" />
        </Link>
        {isCartPage && <div className="header__page-name">Giỏ hàng</div>}
        {isCheckoutPage && <div className="header__page-name">Thanh Toán</div>}
      </div>

      {!isCheckoutPage && (
        <>
          <div
            ref={wrapperRef}
            className={classNames("header__search-content", {
              "header__search-content--cart":
                isCartPage && !xsBreakpointMatches,
            })}
          >
            <div className="header__search-wrapper">
              <input
                type="text"
                onChange={handleChange}
                onClick={handleInputClick}
                // onBlur={handleSearchBlur}
                onKeyUp={inputOnKeyUp}
                className="header__search-input"
                placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
                defaultValue={searchParams.get('query')?.toString()}
                ref={inputRef}
              />
              <div
                onClick={handleSearchIconClick}
                className="header__search-icon"
              >
                <SearchIcon sx={{ fontSize: '2rem', color: 'white' }}></SearchIcon>
              </div>
              {isHistory && (
                <ul className="header__history-list">
                  <li className="header__history-title">Lịch Sử Tìm Kiếm</li>
                  {suggestions.map((item, index) => (
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        "&:hover": {
                          backgroundColor: "var(--lighter-grey-color)",
                        },
                      }}
                      key={index}
                    >
                      <li
                        onClick={() => handleSuggestionClick(item)}
                        className="header__history-item"
                      >
                        <a href="" className="header__history-link">
                          {item}
                        </a>
                      </li>
                      <Box
                        sx={{
                          marginRight: "0.6rem",
                          "& :hover": { color: "var(--primary-color)" },
                          cursor: "pointer",
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Close
                          onClick={() => handleHistoryDelete(item)}
                        ></Close>
                      </Box>
                    </Stack>
                  ))}
                </ul>
              )}
            </div>

            <ul className="header__search-list">
              {/* list of recommends */}
              {/*{[].map((item) => (*/}
              {/*  <li className="header__search-item">*/}
              {/*    <a href="# " className="header__item-link">*/}
              {/*      {item}*/}
              {/*    </a>*/}
              {/*  </li>*/}
              {/*))}*/}
            </ul>
          </div>
          {!isCartPage && <HeaderCart></HeaderCart>}
        </>
      )}
    </div>
  );
};
export default HeaderSearch;
