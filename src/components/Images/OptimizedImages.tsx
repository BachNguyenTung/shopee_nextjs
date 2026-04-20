import Image from 'next/image';
import React from 'react';

/** Static assets under `public/img` (avoid missing `src/assets` in CI / fresh clones). */
const IMG = {
  shoppeLogo: '/img/shoppe-logo.png',
  noCart: '/img/no-cart.png',
  visa: '/img/visa.png',
  master: '/img/master.png',
  jcb: '/img/jcb.png',
  express: '/img/express.png',
  nobrand: '/img/nobrand.png',
  protect: '/img/protect.png',
  qrCodeHome: '/img/qr-code-home.png',
  appShopee: '/img/app-shopee.png',
  googlePlayShopee: '/img/gg-shopee.png',
  appGalleryShopee: '/img/app-gal-shopee.png',
  cimbBank: '/img/ic_cimb_bank@4x.png',
  mbBank: '/img/ic_MBBank@4x.png',
  socialShare: '/img/1876c121524255f7eb6a64b4d8d0b7e3.png',
  paymentShipping: '/img/payment-shipping.png',
} as const;

// Logo Images
export const ShoppeLogo: React.FC<{
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}> = ({ width = 150, height = 50, priority = false, className = '' }) => (
  <Image
    src={IMG.shoppeLogo}
    alt="Shopee Logo"
    width={width}
    height={height}
    priority={priority}
    className={className}
  />
);

// Cart Images
export const NoCartImage: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 200, height = 160, className = '' }) => (
  <Image
    src={IMG.noCart}
    alt="Empty cart"
    width={width}
    height={height}
    className={className}
  />
);

// Payment Card Images
export const VisaCard: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 65, height = 40, className = '' }) => (
  <Image
    src={IMG.visa}
    alt="Visa Card"
    width={width}
    height={height}
    className={className}
  />
);

export const MasterCard: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 60, height = 40, className = '' }) => (
  <Image
    src={IMG.master}
    alt="Mastercard"
    width={width}
    height={height}
    className={className}
  />
);

export const JCBCard: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 60, height = 40, className = '' }) => (
  <Image
    src={IMG.jcb}
    alt="JCB Card"
    width={width}
    height={height}
    className={className}
  />
);

export const ExpressCard: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 60, height = 40, className = '' }) => (
  <Image
    src={IMG.express}
    alt="American Express Card"
    width={width}
    height={height}
    className={className}
  />
);

export const NoBrandCard: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 60, height = 40, className = '' }) => (
  <Image
    src={IMG.nobrand}
    alt="No Brand Card"
    width={width}
    height={height}
    className={className}
  />
);

// Protection Icon
export const ProtectIcon: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 20, height = 20, className = '' }) => (
  <Image
    src={IMG.protect}
    alt="Protection Icon"
    width={width}
    height={height}
    className={className}
  />
);

// QR Code and App Images
export const QRCodeHome: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 80, height = 80, className = '' }) => (
  <Image
    src={IMG.qrCodeHome}
    alt="QR Code"
    width={width}
    height={height}
    className={className}
  />
);

export const AppShopee: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 80, height = 20, className = '' }) => (
  <Image
    src={IMG.appShopee}
    alt="Shopee App"
    width={width}
    height={height}
    className={className}
  />
);

export const GooglePlayShopee: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 80, height = 20, className = '' }) => (
  <Image
    src={IMG.googlePlayShopee}
    alt="Google Play Shopee"
    width={width}
    height={height}
    className={className}
  />
);

export const AppGalleryShopee: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 80, height = 20, className = '' }) => (
  <Image
    src={IMG.appGalleryShopee}
    alt="App Gallery Shopee"
    width={width}
    height={height}
    className={className}
  />
);

// Bank Images
export const CIMBBank: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 84, height = 32, className = '' }) => (
  <Image
    src={IMG.cimbBank}
    alt="CIMB Bank"
    width={width}
    height={height}
    className={className}
  />
);

export const MBBank: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 84, height = 32, className = '' }) => (
  <Image
    src={IMG.mbBank}
    alt="MB Bank"
    width={width}
    height={height}
    className={className}
  />
);

// Social Share Image (used in detail container)
export const SocialShareImage: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 26, height = 26, className = '' }) => (
  <Image
    src={IMG.socialShare}
    alt="Social Share"
    width={width}
    height={height}
    className={className}
  />
);

// Payment & Shipping Sprite (for footer)
export const PaymentShippingSprite: React.FC<{
  width?: number;
  height?: number;
  className?: string;
}> = ({ width = 55, height = 29, className = '' }) => (
  <Image
    src={IMG.paymentShipping}
    alt="Payment and Shipping Methods"
    width={width}
    height={height}
    className={className}
  />
);
