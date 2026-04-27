import React, { useEffect, useRef, useState } from "react";
import { Box, FormControl, MenuItem, Stack, useMediaQuery } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ArrowBack } from "@mui/icons-material";
import { useUserContext } from "@/context/UserProvider";
import HeaderSearch from "./HeaderSearch";
import Link from "next/link";
import { AppGalleryShopee, AppShopee, GooglePlayShopee, QRCodeHome } from "@/components/Images/OptimizedImages";
import { usePathname, useRouter } from "next/navigation";
import MenuIcon from '@mui/icons-material/Menu';
import { anchorElAtom } from "@/store/anchorEl.atom";
import BasicPopover from "@/components/base/Popover";
import AccountLeftMenu from "@/components/Account/AccountLeftMenu";
import { useAtom } from "jotai";
import clsx from "clsx";
import { z } from "zod";

interface Props {
  isProductPage?: boolean,
  isCartPage?: boolean,
  isCheckoutPage?: boolean,
  isLoginPage?: boolean,
  isRegisterPage?: boolean,
  isAccountPage?: boolean,
  headerText?: string,
}

export const ThemeModeSchema = z.enum(["theme", "light", "dark"]);
export type ThemeMode = z.infer<typeof ThemeModeSchema>;

const Header = ({
                  isProductPage = false,
                  isCartPage = false,
                  isCheckoutPage = false,
                  isLoginPage = false,
                  isRegisterPage = false,
                  isAccountPage,
                  headerText = '',
                }: Props) => {
  const { user, userLoading, isPhotoExist, checkingPhotoURL, signOut } =
    useUserContext();
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useAtom(anchorElAtom)
  const count = useRef<number>(0)
  const pathname = usePathname()
  useEffect(() => {
    if (!xsBreakpointMatches)
      handleClose()
  }, [xsBreakpointMatches])
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openMenuPopover = Boolean(anchorEl);
  const id = openMenuPopover ? 'simple-popover' : undefined;
  const handleLogout = () => {
    signOut();
  };
  const [themeMode, setThemeMode] = useState<ThemeMode>('theme');

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode');
    const parsed = ThemeModeSchema.safeParse(stored);
    if (parsed.success) {
      setThemeMode(parsed.data);
      addThemeClass(parsed.data);
    }
  }, []);

  const handleThemeChange = (e: SelectChangeEvent) => {
    const mode = e.target.value as ThemeMode;
    setThemeMode(mode);
    localStorage.setItem('theme-mode', mode);
    addThemeClass(mode)
  };

  const addThemeClass = (mode: string) => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (mode === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  return (
    <header
      className={clsx("z-40 sticky top-0 left-0 [background-image:linear-gradient(0,var(--primary-light-color),var(--primary-color))] dark:[background-image:linear-gradient(0,var(--black-color),var(--primary-dark-color))]", {
        "header--product": isProductPage,
        "header--login": isLoginPage || isRegisterPage,
        "header--checkout": isCheckoutPage,
      })}
    >
      <div className={`container ${xsBreakpointMatches && isAccountPage && 'max-w-none p-0'} `}>
        <Stack
          sx={{
            flexDirection: { xs: "row-reverse", sm: "column" },
            alignItems: { xs: "center", sm: "initial" },
          }}
        >
          {xsBreakpointMatches && isAccountPage &&
            < div className={'mx-4'} aria-describedby={id} onClick={openMenuPopover ? handleClose : handleClick}>
              <MenuIcon fontSize={'large'} className={'text-white p-0'} />
            </div>
          }
          {openMenuPopover &&
            <BasicPopover id={id} open={openMenuPopover}>
              <AccountLeftMenu />
            </BasicPopover>
          }
          {/* HeaderNav */}
          {!isLoginPage && !isRegisterPage && (
            <nav className="header__nav">
              <div className="header__nav-list">
                <li className="header__nav-item header__nav-item--qr">
                  <a href="# " className="header__nav-item-link">
                    Tải ứng dụng
                  </a>
                  <div className="header__nav-qr">
                    <QRCodeHome className="header__nav-qr-img" />
                    <Link href="" className="header__nav-app">
                      <AppShopee className="header__nav-app-img" />
                      <GooglePlayShopee className="header__nav-app-img" />
                      <AppGalleryShopee className="header__nav-app-img header__nav-app-img--smaller" />
                    </Link>
                  </div>
                </li>

                <li className="header__nav-item">
                  Kết nối
                  <a href="# " className="header__nav-item-link">
                    <i className="header__nav-icon bi bi-facebook"></i>
                  </a>
                  <a href="# " className="header__nav-item-link">
                    <i className="header__nav-icon bi bi-instagram"></i>
                  </a>
                </li>
              </div>
              <ul className="header__nav-list">
                <li style={{ display: 'flex', alignItems: 'center' }}>
                  <FormControl size="small" sx={{ mr: 1, minWidth: 100 }}>
                    <Select
                      value={themeMode}
                      onChange={handleThemeChange}
                      displayEmpty
                      inputProps={{ 'aria-label': 'Chọn chế độ giao diện' }}
                      sx={{
                        backgroundColor: 'white',
                      }}
                    >
                      <MenuItem value="theme">Theo hệ thống</MenuItem>
                      <MenuItem value="light">Sáng</MenuItem>
                      <MenuItem value="dark">Tối</MenuItem>
                    </Select>
                  </FormControl>
                </li>
                <div
                  className={
                    user
                      ? "header__nav-item-right header__nav-item-right--user"
                      : "header__nav-item-right header__nav-item-right--reg"
                  }
                  onClick={(e) => {
                    if (user && pathname !== "/account/profile") {
                      router.push("/account/profile");
                    }
                  }}
                >
                  {!user && !userLoading && (
                    <div className="header__nav-reg">
                      <Link href="/register" className="header__nav-login">
                        Đăng ký
                      </Link>
                      <Link href="/login" className="header__nav-register">
                        Đăng nhập
                      </Link>
                    </div>
                  )}

                  <div className="header__nav-login-link">
                    {user &&
                    isPhotoExist &&
                    !checkingPhotoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="header__nav-avatar"
                      />
                    ) : (
                      <div className="header__nav-noavatar">
                        <svg
                          enableBackground="new 0 0 15 15"
                          viewBox="0 0 15 15"
                          x="0"
                          y="0"
                          className="header__noavatar-svg"
                        >
                          <g>
                            <circle
                              cx="7.5"
                              cy="4.5"
                              fill="none"
                              r="3.8"
                              strokeMiterlimit="10"
                            ></circle>
                            <path
                              d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6"
                              fill="none"
                              strokeLinecap="round"
                              strokeMiterlimit="10"
                            ></path>
                          </g>
                        </svg>
                      </div>
                    )}

                    <Box
                      component="span"
                      sx={{ display: { xs: "none", sm: "inline-block" } }}
                    >
                      {user?.displayName}
                    </Box>
                  </div>
                  {!xsBreakpointMatches && (
                    <div
                      className="header__user-list"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="header__user-arrow"></div>
                      <Link href="/account" className="header__user-item">
                        Tài khoản của tôi
                      </Link>
                      <Link
                        href="/account/purchase"
                        className="header__user-item"
                      >
                        Đơn mua
                      </Link>
                      <div onClick={handleLogout} className="header__user-item">
                        Đăng xuất
                      </div>
                    </div>
                  )}
                </div>
              </ul>
            </nav>
          )}
          {/* HeaderSearch */}
          {!isLoginPage && !isRegisterPage && (
            <HeaderSearch
              isCartPage={isCartPage}
              isCheckoutPage={isCheckoutPage}
              xsBreakpointMatches={xsBreakpointMatches}
            ></HeaderSearch>
          )}
          {xsBreakpointMatches && !isProductPage && (
            <ArrowBack
              sx={{ fontSize: "3rem", color: "white", marginLeft: "0.6rem" }}
              onClick={async () => {
                count.current += 1
                await router.back()
                if (count.current === 3) {
                  count.current = 0
                  await router.replace("/");
                }
              }}
            ></ArrowBack>
          )}

          {/* HeaderSimpleContent */}
          {(isLoginPage || isRegisterPage) && (
            <div className="header__simple-wrapper">
              <div className="header__logo-wrapper">
                <Link
                  href={"/"}
                  className="header__logo-link header__logo-link--login"
                >
                  <svg
                    viewBox="0 0 192 65"
                    className="shopee-svg-icon _3XB6zw _3d2_4f icon-shopee-logo"
                  >
                    <g fillRule="evenodd">
                      <path d="..."></path>
                    </g>
                  </svg>
                </Link>
                <div className="header__page-name header__page-name--login">
                  {headerText}
                </div>
              </div>
              <div className="header__help">Cần trợ giúp?</div>
            </div>
          )}
        </Stack>
      </div>
    </header>
  );
};
export default Header;
