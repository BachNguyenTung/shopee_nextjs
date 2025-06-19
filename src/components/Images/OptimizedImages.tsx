import Image from 'next/image';
import React from 'react';

// Logo Images
export const ShoppeLogo: React.FC<{
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}> = ({ width = 150, height = 50, priority = false, className = '' }) => (
  <Image
    src="/img/shoppe-logo.png"
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
}> = ({ width = 200, height = 200, className = '' }) => (
  <Image
    src="/img/no-cart.png"
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
    src="/img/visa.png"
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
    src="/img/master.png"
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
    src="/img/jcb.png"
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
    src="/img/express.png"
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
    src="/img/nobrand.png"
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
    src="/img/protect.png"
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
    src="/img/qr-code-home.png"
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
    src="/img/app-shopee.png"
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
    src="/img/gg-shopee.png"
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
    src="/img/app-gal-shopee.png"
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
    src="/img/ic_cimb_bank@4x.png"
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
    src="/img/ic_MBBank@4x.png"
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
    src="/img/1876c121524255f7eb6a64b4d8d0b7e3.png"
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
    src="/img/payment&shipping.png"
    alt="Payment and Shipping Methods"
    width={width}
    height={height}
    className={className}
  />
);
