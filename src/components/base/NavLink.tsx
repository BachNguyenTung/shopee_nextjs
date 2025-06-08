import Link, { LinkProps } from "next/link";
import { FC, PropsWithChildren } from "react";
import { usePathname } from "next/navigation";

interface NavLinkProps extends LinkProps, PropsWithChildren {
  className?: string
  exact?: boolean
}

const NavLink: FC<NavLinkProps> = ({
                                     exact = false,
                                     as,
                                     href,
                                     passHref,
                                     replace,
                                     scroll,
                                     shallow,
                                     children,
                                     className,
                                     ...props
                                   }) => {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname?.startsWith(href as string);

  if (isActive) {
    className += ' active';
  }
  return (
    <Link as={as}
          href={href}
          passHref={passHref}
          replace={replace}
          scroll={scroll}
          shallow={shallow}
          className={className}
          {...props}
    >
      {children}
    </Link>
  )
}

export default NavLink
