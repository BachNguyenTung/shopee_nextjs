# Image Optimization Refactoring

This document outlines the comprehensive refactoring of all images in the `public/img` folder to use Next.js Image
component for better performance and optimization.

## 🎯 Goals

- **Performance**: Automatic image optimization, lazy loading, and responsive images
- **SEO**: Better Core Web Vitals scores
- **User Experience**: Faster page loads and better mobile performance
- **Maintainability**: Type-safe, reusable image components

## 📁 File Structure

```
src/
├── components/
│   └── Images/
│       └── OptimizedImages.tsx          # All optimized image components
├── services/
│   └── getOptimizedIcons.tsx            # Optimized icon service
└── [other components using images]
```

## 🖼️ Optimized Images

### Logo Images

- **ShoppeLogo**: Main Shopee logo with priority loading for above-the-fold content

### Cart Images

- **NoCartImage**: Empty cart illustration

### Payment Card Images

- **VisaCard**: Visa payment method icon
- **MasterCard**: Mastercard payment method icon
- **JCBCard**: JCB payment method icon
- **ExpressCard**: American Express payment method icon
- **NoBrandCard**: Default card icon for unknown brands

### Protection & Security

- **ProtectIcon**: Security/protection icon for payment forms

### QR Code & App Images

- **QRCodeHome**: QR code for mobile app download
- **AppShopee**: Shopee app store icon
- **GooglePlayShopee**: Google Play store icon
- **AppGalleryShopee**: App Gallery store icon

### Bank Images

- **CIMBBank**: CIMB Bank logo
- **MBBank**: MB Bank logo

### Social & UI Images

- **SocialShareImage**: Social media sharing sprite
- **PaymentShippingSprite**: Payment and shipping methods sprite

## 🔧 Usage Examples

### Basic Usage

```tsx
import { ShoppeLogo, NoCartImage } from '@/components/Images/OptimizedImages';

// Simple usage with default dimensions
<ShoppeLogo />

// Custom dimensions and priority loading
<ShoppeLogo width={200} height={80} priority />

// With custom CSS classes
<NoCartImage className="my-custom-class" />
```

### Dynamic Card Selection

```tsx
import { getOptimizedCardByBrand } from '@/services/getOptimizedIcons';

// Get the appropriate card component based on brand
const CardComponent = getOptimizedCardByBrand('visa');
<CardComponent className="payment-card" />
```

### Inline Component Usage

```tsx
{(() => {
  const CardComponent = getOptimizedCardByBrand(item.card.brand);
  return <CardComponent className="checkout-card" />;
})()}
```

## 📊 Performance Benefits

### Before (Regular `<img>` tags)

- ❌ No automatic optimization
- ❌ No lazy loading
- ❌ No responsive images
- ❌ Larger bundle sizes
- ❌ Poor Core Web Vitals

### After (Next.js Image components)

- ✅ Automatic WebP/AVIF conversion
- ✅ Lazy loading by default
- ✅ Responsive images with `sizes` prop
- ✅ Optimized bundle sizes
- ✅ Better Core Web Vitals scores
- ✅ Priority loading for above-the-fold images

## 🔄 Refactored Components

### Header Components

- `HeaderSearch.tsx` - Uses `ShoppeLogo` with priority loading

### Cart Components

- `CartContainer.tsx` - Uses `NoCartImage` for empty cart state

### Footer Components

- `Footer.js` - Uses `QRCodeHome`, `AppShopee`, `GooglePlayShopee`, `AppGalleryShopee`

### Payment Components

- `AccountPayment.js` - Uses dynamic card components via `getOptimizedCardByBrand`
- `CheckoutContainer.tsx` - Uses dynamic card components
- `CardInfoModal.tsx` - Uses `ProtectIcon` for security messaging

## 🎨 CSS Considerations

### Responsive Design

All image components support responsive design through:

- Custom `width` and `height` props
- CSS classes for styling
- Automatic responsive behavior from Next.js Image

### Styling Examples

```scss
// Footer app images
.footer__app-img {
  width: 8rem;
  height: auto; // Next.js Image handles aspect ratio
}

// Payment card logos
.payment-profile__card-logo {
  padding: 1rem 0.6rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
```

## 🚀 Migration Guide

### For New Images

1. Add the image to `public/img/`
2. Create a component in `OptimizedImages.tsx`
3. Export it from `getOptimizedIcons.tsx`
4. Use the component in your code

### For Existing Images

1. Replace `<img src="/img/..." />` with the appropriate component
2. Update imports to use the new optimized components
3. Test the component with different screen sizes

## 🔧 Configuration

### Next.js Config

The project already has proper image optimization configured in `next.config.js`:

```js
images: {
  domains: ['res.cloudinary.com', 'fakestoreapi.com', 'firebasestorage.googleapis.com'],
}
```

### TypeScript Support

All components are fully typed with TypeScript interfaces:

```tsx
interface ImageProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}
```

## 📈 Performance Monitoring

### Core Web Vitals

Monitor these metrics after deployment:

- **LCP (Largest Contentful Paint)**: Should improve with priority loading
- **CLS (Cumulative Layout Shift)**: Should improve with proper dimensions
- **FID (First Input Delay)**: Should improve with optimized images

### Bundle Analysis

Use tools like `@next/bundle-analyzer` to monitor bundle size improvements.

## 🐛 Troubleshooting

### Common Issues

1. **Missing dimensions**: Always provide `width` and `height` props
2. **Layout shift**: Use proper aspect ratios and container sizing
3. **Priority conflicts**: Only use `priority` for above-the-fold images

### Debug Tips

- Use browser dev tools to inspect image loading
- Check Network tab for optimized image formats
- Verify responsive behavior on different screen sizes

## 📚 Additional Resources

- [Next.js Image Documentation](https://nextjs.org/docs/api-reference/next/image)
- [Web Vitals](https://web.dev/vitals/)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)

## 🤝 Contributing

When adding new images:

1. Follow the naming convention in `OptimizedImages.tsx`
2. Add proper TypeScript types
3. Include appropriate alt text
4. Test on multiple devices and screen sizes
5. Update this documentation

---

**Note**: This refactoring maintains backward compatibility while providing significant performance improvements. All
existing functionality remains intact.
