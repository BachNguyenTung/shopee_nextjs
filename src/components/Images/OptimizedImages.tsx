import Image from 'next/image';
import React from 'react';
import shoppeLogo from '@/assets/images/shoppe-logo.png';
import noCart from '@/assets/images/no-cart.png';
import visa from '@/assets/images/visa.png';
import master from '@/assets/images/master.png';
import jcb from '@/assets/images/jcb.png';
import express from '@/assets/images/express.png';
import nobrand from '@/assets/images/nobrand.png';
import protect from '@/assets/images/protect.png';
import qrCodeHome from '@/assets/images/qr-code-home.png';
import appShopee from '@/assets/images/app-shopee.png';
import googlePlayShopee from '@/assets/images/gg-shopee.png';
import appGalleryShopee from '@/assets/images/app-gal-shopee.png';
import cimbBank from '@/assets/images/ic_cimb_bank@4x.png';
import mbBank from '@/assets/images/ic_MBBank@4x.png';
import socialShare from '@/assets/images/1876c121524255f7eb6a64b4d8d0b7e3.png';
import paymentShipping from '@/assets/images/payment&shipping.png';

// Logo Images
export const ShoppeLogo: React.FC<{
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}> = ({ width = 150, height = 50, priority = false, className = '' }) => (
  <Image
    src={shoppeLogo}
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
    src={noCart}
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
    src={visa}
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
    src={master}
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
    src={jcb}
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
    src={express}
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
    src={nobrand}
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
    src={protect}
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
    src={qrCodeHome}
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
    src={appShopee}
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
    src={googlePlayShopee}
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
    src={appGalleryShopee}
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
    src={cimbBank}
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
    src={mbBank}
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
    src={socialShare}
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
    src={paymentShipping}
    alt="Payment and Shipping Methods"
    width={width}
    height={height}
    className={className}
  />
);
