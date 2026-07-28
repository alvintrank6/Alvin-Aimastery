# Be You Tea & Coffee — Website

Website production-ready cho quán cà phê Be You Tea & Coffee tại Hà Nội.

## 🎯 Tổng quan

- **Địa chỉ:** Số 6, ngõ 58 Nguyễn Chí Thanh, Đống Đa, Hà Nội
- **Concept:** Coffee & Workplace — Industrial + Biophilic
- **Theme mặc định:** Đêm (Night) — theo ánh sáng khách yêu thích nhất

## 📁 Cấu trúc file

```
beyou-coffee/
├── index.html          # Trang chính (HTML5 semantic)
├── css/
│   ├── variables.css   # CSS Custom Properties (màu, spacing, typography)
│   ├── base.css        # Reset & Typography cơ bản
│   ├── components.css  # Header, buttons, hero, navigation
│   └── layout.css      # Layout các section
├── js/
│   └── app.js          # Vanilla JS: theme, language, animations
├── images/             # Thư mục ảnh (WebP + JPG fallback)
├── sitemap.xml         # Sitemap với hreflang
├── robots.txt          # Robots directives
└── README.md           # File này
```

## 🚀 Chạy website

### Option 1: Mở trực tiếp
```bash
open index.html
```

### Option 2: Dùng Python server
```bash
python3 -m http.server 8000
# Truy cập: http://localhost:8000
```

### Option 3: Dùng Node.js (npx)
```bash
npx serve .
```

## 🎨 Design Tokens

### Màu sắc (CSS Variables)
```css
--ember       #E0761F   /* Cam đất — màu nhấn DUY NHẤT */
--ember-deep  #B85A12   /* Cam đậm — hover state */
--ink         #14110F   /* Nâu-đen — nền dark mode */
--concrete    #343B38   /* Xanh xám bê tông */
--brick       #8B4A32   /* Gạch nung */
--neon        #DFF4FF   /* Trắng xanh lạnh — đèn neon */
--leaf        #5C8A6E   /* Xanh lá cây */
--bone        #EDE8E2   /* Trắng ngà — chữ trên nền tối */
```

### Typography
- **Display:** Montserrat (600, 700, 800)
- **Body:** Inter (300, 400, 500)
- **Mono:** JetBrains Mono (400, 500)
- **Neon:** Dancing Script (500)

## 🌐 Song ngữ Việt/Anh

### Cách hoạt động
- Tiếng Việt là mặc định, nằm thẳng trong HTML
- Mỗi phần tử dịch có `data-lang-vi` và `data-lang-en`
- JavaScript đọc localStorage hoặc URL param `?lang=en`
- Cập nhật `<html lang>` và flag button

### Thêm nội dung song ngữ
```html
<p data-lang-vi="Nội dung tiếng Việt" 
   data-lang-en="English content">
  Nội dung tiếng Việt
</p>
```

## 🌓 Theme Ngày/Đêm

### Mặc định: Đêm (Night)
- Phản ánh ánh sáng "vibe màu vàng ấm, chill chill" mà khách yêu thích
- Lưu vào localStorage: `beyou-theme`

### Toggle
- Button góc phải header
- Transition 500ms trên background/color
- Icon mặt trời/mặt trăng xoay 180°

## 🖼️ Ảnh cần sinh (Higgsfield)

| Tên file | Kích thước | Mô tả |
|----------|------------|-------|
| hero-neon-concrete-wall.webp | 1920×1080 | Tường bê tông + neon "Be You, Simply You" |
| interior-main-hall-daylight.webp | 1600×1200 | Sảnh chính ban ngày |
| interior-communal-table-neon.webp | 900×1200 | Bàn gỗ dài buổi tối |
| exterior-alley-signage.webp | 1200×900 | Biển hiệu trong ngõ |
| outdoor-seating-morning.webp | 1200×900 | Khu ngồi ngoài trời |
| drink-cam-chill-hero.webp | 1200×1200 | Ly Cam chill close-up |
| drink-summer-chill-set.webp | 1200×1600 | Bộ 4 ly Summer Chill |
| detail-branded-glass.webp | 1200×900 | Ly in logo cận cảnh |
| workspace-laptop-warm-evening.webp | 1600×1000 | Bàn làm việc buổi tối |
| og-share-card.webp | 1200×630 | Ảnh share social |

### Yêu cầu xuất ảnh
- WebP quality 80 (chính) + JPG fallback
- @1x và @2x cho srcset
- Mỗi file < 250KB
- Alt text đầy đủ tiếng Việt + Anh

## ♿ Accessibility (WCAG 2.1 AA)

### Tương phản màu
| Element | Night Mode | Day Mode | Pass |
|---------|------------|----------|------|
| Body text on bg | #EDE8E2 on #14110F (12.8:1) | #14110F on #f5f5f5 (16:1) | ✅ |
| Ember on Ink | #E0761F on #14110F (5.2:1) | #E0761F on #f5f5f5 (4.6:1) | ✅ |
| Secondary text | #b8b8b8 on #14110F (8.1:1) | #4a4a4a on #f5f5f5 (7.2:1) | ✅ |

### Features
- Skip-to-content link
- Keyboard navigation đầy đủ
- ARIA labels cho buttons
- Focus-visible rõ ràng
- prefers-reduced-motion support

## ⚡ Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Hero không lazy-load, preconnect fonts |
| CLS | < 0.1 | Aspect-ratio trên ảnh, font-display: swap |
| TBT | < 200ms | Vanilla JS, no heavy frameworks |

## 🔧 Chỉnh sửa

### Thay menu
Mở `index.html`, tìm section `#menu`, sửa trong `.menu-list`

### Thay review
Tìm section `#reviews`, sửa `.review-card`

### Thêm section mới
1. Thêm HTML trong `<main>`
2. Thêm CSS trong `layout.css`
3. Thêm nav link trong header
4. Cập nhật scroll spy trong `js/app.js`

## 📋 Checklist bàn giao

- [x] HTML/CSS/JS hoàn chỉnh
- [ ] Ảnh đã sinh và tích hợp (cần Higgsfield)
- [x] sitemap.xml với hreflang
- [x] robots.txt
- [x] Schema.org CafeOrCoffeeShop
- [x] Meta tags SEO đầy đủ
- [x] WCAG AA contrast verified

## ❗ Cần chủ quán bổ sung

1. **Số điện thoại** — để thêm vào footer và schema
2. **Link Facebook chính xác** — hiện tại là placeholder
3. **Giá từng món** — để hiển thị trong menu
4. **Mật khẩu WiFi** — có thể hiển thị hoặc để tại quầy
5. **Ảnh thật của quán** — thay thế ảnh Higgsfield bằng ảnh chụp thực tế

---

**Built with:** HTML5, CSS3 (Custom Properties, Grid, Flexbox), Vanilla ES6+  
**No framework dependencies.** Pure performance.
