import React from 'react';
import {
  AppGalleryShopee,
  AppShopee,
  CIMBBank,
  ExpressCard,
  GooglePlayShopee,
  JCBCard,
  MasterCard,
  MBBank,
  NoBrandCard,
  NoCartImage,
  PaymentShippingSprite,
  ProtectIcon,
  QRCodeHome,
  ShoppeLogo,
  SocialShareImage,
  VisaCard
} from '@/components/Images/OptimizedImages';

// Type for icon components
type IconComponent = React.ComponentType<{
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}>;

// Optimized icon components
export const optimizedIcons = {
  // Logo
  shoppeLogo: ShoppeLogo,

  // Cart
  noCartIcon: NoCartImage,

  // Payment Cards
  visaIcon: VisaCard,
  masterIcon: MasterCard,
  jcbIcon: JCBCard,
  expressIcon: ExpressCard,
  noBrandIcon: NoBrandCard,

  // Protection
  protectIcon: ProtectIcon,

  // QR and Apps
  qrCodeNavImg: QRCodeHome,
  appShopeeImg: AppShopee,
  ggShopeeImg: GooglePlayShopee,
  appGalShopeeImg: AppGalleryShopee,

  // Banks
  cimbBank: CIMBBank,
  mbBank: MBBank,

  // Social Share
  socialShareImage: SocialShareImage,

  // Payment & Shipping Sprite
  paymentShippingSprite: PaymentShippingSprite,
};

// Helper function to get card image by brand
export const getOptimizedCardByBrand = (brand: string): IconComponent => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return optimizedIcons.visaIcon;
    case 'mastercard':
      return optimizedIcons.masterIcon;
    case 'jcb':
      return optimizedIcons.jcbIcon;
    case 'american express':
      return optimizedIcons.expressIcon;
    default:
      return optimizedIcons.noBrandIcon;
  }
};

// Export individual components for direct use
export {
  ShoppeLogo,
  NoCartImage,
  VisaCard,
  MasterCard,
  JCBCard,
  ExpressCard,
  NoBrandCard,
  ProtectIcon,
  QRCodeHome,
  AppShopee,
  GooglePlayShopee,
  AppGalleryShopee,
  CIMBBank,
  MBBank,
  SocialShareImage,
  PaymentShippingSprite
};
