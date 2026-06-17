# Sơn Xin Chào — Personal Portfolio Website

Website portfolio cá nhân cho dịch vụ SEO, Ads và WordPress.

## Cách chạy

```bash
# Cài dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## Cấu trúc

```
son-xin-chao/
├── app/
│   ├── layout.tsx       # Layout & metadata SEO
│   ├── page.tsx         # Trang chính
│   └── globals.css      # CSS toàn cục + animations
├── components/
│   ├── Navbar.tsx       # Navigation cố định
│   ├── Hero.tsx         # Hero section với particle animation
│   ├── About.tsx        # Giới thiệu + skill bars
│   ├── Services.tsx     # 3 dịch vụ chính
│   ├── Portfolio.tsx    # Portfolio có filter
│   ├── Pricing.tsx      # Bảng giá 3 gói + add-ons
│   ├── Contact.tsx      # Form liên hệ + FAQ
│   └── Footer.tsx       # Footer
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Tùy chỉnh

Sửa thông tin liên hệ trong `components/Contact.tsx`:
- Số Zalo: tìm `0901 234 567`
- Facebook: tìm `fb.com/sonxinchao`
- Email: tìm `son@sonxinchao.com`

Sửa portfolio trong `components/Portfolio.tsx` → mảng `projects`.

Sửa bảng giá trong `components/Pricing.tsx` → mảng `plans`.

## Deploy

```bash
npm run build
npm start
```

Hoặc deploy lên Vercel: [vercel.com](https://vercel.com)
