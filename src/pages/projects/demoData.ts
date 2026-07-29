// ============================================================================
// 1. COSMETICS STORE & SKINCARE DEMO (Cosmetics Co. / Senn Cosmetics)
// ============================================================================
const COSMETICS_HTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cosmetics Co. — Website Mỹ Phẩm & Skincare Y Khoa</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #9B2A4C22; border-radius: 10px; }
  </style>
</head>
<body class="bg-[#FDFBF7] text-[#1C2526] antialiased min-h-screen custom-scrollbar">

  <!-- Top Announcement Bar -->
  <div class="bg-[#9B2A4C] text-white text-[11px] font-bold py-2 px-4 text-center tracking-wide flex justify-between items-center max-w-full overflow-hidden">
    <div class="hidden sm:flex items-center gap-2">
      <i class="ri-phone-fill"></i> <span>HOTLINE HỖ TRỢ BÁC SĨ DA LIỄU: 1800 6899</span>
    </div>
    <div class="mx-auto sm:mx-0 flex items-center gap-2">
      <span>✨ TẶNG VOUCHER 100K CHO ĐƠN HÀNG ĐẦU TIÊN | NHẬP MÃ: <strong class="underline bg-white/20 px-2 py-0.5 rounded text-amber-200">AIMASTERY100</strong></span>
    </div>
    <div class="hidden md:flex items-center gap-3">
      <span>Giao hàng 2h tại TP.HCM & Hà Nội</span>
    </div>
  </div>

  <!-- Header / Navigation -->
  <header class="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-sm">
    <div class="flex items-center gap-8">
      <div class="font-black text-xl tracking-wider text-[#9B2A4C] flex items-center gap-2 cursor-pointer" onclick="showTab('home')">
        <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9B2A4C] to-[#7B1E3A] text-white flex items-center justify-center text-base font-black shadow-md shadow-[#9B2A4C]/30">C</span>
        COSMETICS CO.
      </div>
      <nav class="hidden md:flex items-center gap-6 text-xs font-bold text-[#5A6A72]">
        <button onclick="showTab('home')" class="hover:text-[#9B2A4C] transition-colors text-[#9B2A4C]">Trang chủ</button>
        <button onclick="showTab('products')" class="hover:text-[#9B2A4C] transition-colors">Cửa hàng</button>
        <button onclick="openQuizModal()" class="hover:text-[#9B2A4C] transition-colors flex items-center gap-1.5 text-[#9B2A4C] bg-[#9B2A4C]/10 px-3 py-1.5 rounded-full border border-[#9B2A4C]/20">
          <i class="ri-magic-line text-amber-500"></i> Phân tích da AI
        </button>
        <button onclick="scrollToSection('clinical')" class="hover:text-[#9B2A4C] transition-colors">Nghiên cứu y khoa</button>
        <button onclick="scrollToSection('reviews')" class="hover:text-[#9B2A4C] transition-colors">Đánh giá khách hàng (2,450+)</button>
      </nav>
    </div>

    <div class="flex items-center gap-3 text-xs font-bold">
      <!-- Search Input -->
      <div class="hidden lg:flex items-center bg-gray-100 rounded-full px-3 py-1.5 border border-gray-200 focus-within:border-[#9B2A4C] transition-colors">
        <i class="ri-search-line text-gray-400 mr-2"></i>
        <input type="text" placeholder="Tìm serum, retinol, kem chống nắng..." class="bg-transparent text-xs outline-none w-48" onkeyup="filterProducts(this.value)" />
      </div>

      <button onclick="toggleCart()" class="relative bg-[#9B2A4C] text-white px-4.5 py-2.5 rounded-full flex items-center gap-2 hover:opacity-95 shadow-md shadow-[#9B2A4C]/25 transition-all cursor-pointer">
        <i class="ri-shopping-bag-3-line text-sm"></i>
        <span>Giỏ hàng</span>
        <span id="cartCount" class="bg-white text-[#9B2A4C] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-extrabold ml-1">0</span>
      </button>
    </div>
  </header>

  <!-- Main Content Tab: Home -->
  <div id="tab-home" class="tab-content">
    <!-- Hero Banner -->
    <section class="p-4 md:p-8 max-w-7xl mx-auto">
      <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#9B2A4C] via-[#7B1E3A] to-[#1C2526] text-white p-8 md:p-14 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="space-y-5 max-w-2xl text-center lg:text-left z-10">
          <div class="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-extrabold px-4 py-1.5 rounded-full border border-white/20">
            <i class="ri-leaf-line text-emerald-300"></i> 100% Thuần Chay & Y Khoa Kiểm Định Quốc Tế
          </div>
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            Phục Hồi Làn Da <br/><span class="bg-gradient-to-r from-pink-200 via-amber-200 to-white bg-clip-text text-transparent">Căng Mọng Khoa Học</span>
          </h1>
          <p class="text-xs md:text-sm text-pink-100/90 leading-relaxed max-w-xl">
            Công thức tinh chất Hyaluronic Acid nồng độ cao kết hợp Retinol sinh học độc quyền giúp tái tạo hàng rào bảo vệ da, mờ thâm nám và săn chắc da chỉ sau 14 ngày.
          </p>

          <!-- Key Metrics Badge -->
          <div class="grid grid-cols-3 gap-3 py-2 max-w-md border-t border-b border-white/15 my-4">
            <div class="text-center lg:text-left">
              <p class="text-lg font-black text-amber-200">99.4%</p>
              <p class="text-[10px] text-pink-100/80">Hài lòng về độ ẩm</p>
            </div>
            <div class="text-center lg:text-left">
              <p class="text-lg font-black text-amber-200">14 Ngày</p>
              <p class="text-[10px] text-pink-100/80">Phục hồi màng ẩm</p>
            </div>
            <div class="text-center lg:text-left">
              <p class="text-lg font-black text-amber-200">50.000+</p>
              <p class="text-[10px] text-pink-100/80">Khách hàng tin dùng</p>
            </div>
          </div>

          <div class="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <button onclick="showTab('products')" class="bg-white text-[#9B2A4C] font-extrabold text-xs px-6 py-3.5 rounded-full shadow-lg hover:bg-pink-50 transition-all cursor-pointer flex items-center gap-2">
              <i class="ri-shopping-cart-2-line"></i> Khám Phá Cửa Hàng
            </button>
            <button onclick="openQuizModal()" class="border border-white/40 text-white font-bold text-xs px-5 py-3.5 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer">
              <i class="ri-sparkles-line text-amber-300"></i> Trắc Nghiệm Phân Tích Da AI
            </button>
          </div>
        </div>

        <div class="relative w-72 md:w-96 aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 shrink-0 group">
          <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80" alt="Skin Serum" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white flex justify-between items-center">
            <div>
              <p class="text-xs font-bold">HA 2% + B5 Ultra Serum</p>
              <p class="text-[10px] text-amber-300">★ 4.9/5 (1,280 đánh giá)</p>
            </div>
            <button onclick="addToCart('Hyaluronic Acid 2% + B5 Serum', 576000)" class="bg-[#9B2A4C] text-white text-xs px-3 py-1.5 rounded-xl font-bold hover:bg-pink-700 transition-colors cursor-pointer">
              + 576.000đ
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Filter Bar -->
    <section class="max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button onclick="filterCategory('all')" class="cat-btn active bg-[#9B2A4C] text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-sm cursor-pointer">Tất Cả Sản Phẩm</button>
        <button onclick="filterCategory('serum')" class="cat-btn bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer">Serum Phục Hồi</button>
        <button onclick="filterCategory('sunscreen')" class="cat-btn bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer">Kem Chống Nắng</button>
        <button onclick="filterCategory('cleanser')" class="cat-btn bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer">Sữa Rửa Mặt</button>
        <button onclick="filterCategory('retinol')" class="cat-btn bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap">Retinol & Anti-Aging</button>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="max-w-7xl mx-auto px-4 md:px-8 space-y-6 pb-16">
      <div class="flex justify-between items-end border-b pb-4">
        <div>
          <span class="text-[10px] font-extrabold uppercase text-[#9B2A4C] tracking-widest">Sản phẩm bán chạy nhất</span>
          <h2 class="text-2xl font-black text-[#1C2526]">Bộ Sưu Tập Skincare Chuyên Sâu Y Khoa</h2>
        </div>
        <button onclick="showTab('products')" class="text-xs font-extrabold text-[#9B2A4C] hover:underline flex items-center gap-1 cursor-pointer">Xem tất cả 16 sản phẩm <i class="ri-arrow-right-line"></i></button>
      </div>
      <div id="productGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
    </section>

    <!-- Clinical Science Breakdown Section -->
    <section id="clinical" class="bg-white border-y border-gray-100 py-16 px-4 md:px-8">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <span class="bg-[#9B2A4C]/10 text-[#9B2A4C] text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Nghiên Cứu & Lâm Sàng
          </span>
          <h2 class="text-3xl font-black text-[#1C2526] leading-tight">
            Thành Phần Nồng Độ Cao <br/><span class="text-[#9B2A4C]">Kiểm Định Bởi Viện Da Liễu</span>
          </h2>
          <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
            Mỗi sản phẩm Cosmetics Co. đều trải qua 6 tháng kiểm nghiệm lâm sàng trên 500 tình nguyện viên có làn da nhạy cảm tại Châu Á, cam kết không chứa cồn khô, paraben hay hương liệu nhân tạo gây kích ứng.
          </p>

          <div class="space-y-4">
            <div class="p-4 rounded-2xl bg-[#FDFBF7] border border-gray-200/80 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-[#9B2A4C] text-white flex items-center justify-center font-bold text-lg shrink-0">1</div>
              <div>
                <h4 class="font-extrabold text-xs text-[#1C2526]">Niacinamide 10% + Zinc 1%</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">Kiểm soát dầu thừa, se khít lỗ chân lông và làm mờ các vết thâm sau mụn rõ rệt.</p>
              </div>
            </div>
            <div class="p-4 rounded-2xl bg-[#FDFBF7] border border-gray-200/80 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-[#9B2A4C] text-white flex items-center justify-center font-bold text-lg shrink-0">2</div>
              <div>
                <h4 class="font-extrabold text-xs text-[#1C2526]">Hyaluronic Acid Đa Kích Thước Phân Tử</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">Thấm sâu qua 3 lớp biểu bì, giữ nước gấp 1,000 lần trọng lượng giúp da căng bóng từ bên trong.</p>
              </div>
            </div>
            <div class="p-4 rounded-2xl bg-[#FDFBF7] border border-gray-200/80 flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-[#9B2A4C] text-white flex items-center justify-center font-bold text-lg shrink-0">3</div>
              <div>
                <h4 class="font-extrabold text-xs text-[#1C2526]">Madecassoside 5% Từ Rau Má Đảo Jeju</h4>
                <p class="text-[11px] text-gray-500 mt-0.5">Làm dịu hiện tượng đỏ rát, phục hồi da tổn thương sau điều trị laser hoặc retinol.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative">
          <img src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80" class="rounded-3xl shadow-2xl border-4 border-white object-cover w-full h-[450px]" />
          <div class="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 hidden sm:flex items-center gap-4 max-w-xs">
            <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl font-bold"><i class="ri-shield-check-line"></i></div>
            <div>
              <p class="text-xs font-black text-[#1C2526]">Đạt chuẩn GMP & FDA</p>
              <p class="text-[10px] text-gray-500">Chứng nhận an toàn cho da nhạy cảm & mẹ bầu</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section id="reviews" class="max-w-7xl mx-auto px-4 md:px-8 py-16 space-y-8">
      <div class="text-center max-w-xl mx-auto space-y-2">
        <span class="text-xs font-black uppercase tracking-widest text-[#9B2A4C]">Cảm nhận thực tế</span>
        <h2 class="text-2xl md:text-3xl font-black text-[#1C2526]">Hơn 2,450+ Đánh Giá 5 Sao Từ Người Dùng</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div class="flex text-amber-400 text-sm">★★★★★</div>
          <p class="text-xs text-gray-600 italic leading-relaxed">"Mình dùng serum B5 của Cosmetics Co. sau khi peel da, thực sự ngạc nhiên vì da hết rát chỉ sau 1 đêm. Da mịn màng và căng bóng rõ rệt!"</p>
          <div class="flex items-center gap-3 pt-2 border-t">
            <div class="w-8 h-8 rounded-full bg-pink-100 text-[#9B2A4C] font-bold text-xs flex items-center justify-center">NL</div>
            <div>
              <p class="text-xs font-bold text-[#1C2526]">Ngọc Linh (27 tuổi, TP.HCM)</p>
              <p class="text-[10px] text-emerald-600 font-semibold">✓ Đã mua hàng chính hãng</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div class="flex text-amber-400 text-sm">★★★★★</div>
          <p class="text-xs text-gray-600 italic leading-relaxed">"Retinol dạng bọc 1% này rất êm, không gây bong tróc nặng như các dòng khác. Vết thâm mụn cũ mờ hẳn sau 2 tuần sử dụng."</p>
          <div class="flex items-center gap-3 pt-2 border-t">
            <div class="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">TH</div>
            <div>
              <p class="text-xs font-bold text-[#1C2526]">Trần Hoàng (31 tuổi, Hà Nội)</p>
              <p class="text-[10px] text-emerald-600 font-semibold">✓ Đã mua hàng chính hãng</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
          <div class="flex text-amber-400 text-sm">★★★★★</div>
          <p class="text-xs text-gray-600 italic leading-relaxed">"Kem chống nắng mỏng nhẹ, nâng tông tự nhiên không hề bị vệt trắng. Rất thích hợp cho da dầu mụn như mình!"</p>
          <div class="flex items-center gap-3 pt-2 border-t">
            <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">MA</div>
            <div>
              <p class="text-xs font-bold text-[#1C2526]">Minh Anh (24 tuổi, Đà Nẵng)</p>
              <p class="text-[10px] text-emerald-600 font-semibold">✓ Đã mua hàng chính hãng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>

  <!-- Main Content Tab: All Products Store -->
  <div id="tab-products" class="tab-content hidden p-6 max-w-7xl mx-auto space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
      <div>
        <h2 class="text-2xl font-black text-[#1C2526]">Danh Mục Sản Phẩm Đầy Đủ</h2>
        <p class="text-xs text-gray-500 mt-1">Tất cả sản phẩm đều đi kèm tem chống hàng giả & hóa đơn kiểm định</p>
      </div>
      <div class="flex items-center gap-3">
        <select onchange="sortProducts(this.value)" class="bg-white border rounded-xl px-3 py-2 text-xs font-bold outline-none border-gray-200">
          <option value="default">Sắp xếp: Mới nhất</option>
          <option value="price-asc">Giá: Thấp đến Cao</option>
          <option value="price-desc">Giá: Cao đến Thấp</option>
        </select>
      </div>
    </div>
    <div id="fullProductGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"></div>
  </div>

  <!-- AI Skin Quiz Modal -->
  <div id="quizModal" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-fadeIn">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="font-black text-sm text-[#9B2A4C] flex items-center gap-2"><i class="ri-sparkles-line text-amber-500"></i> TRẮC NGHIỆM PHÂN TÍCH LOẠI DA AI</h3>
        <button onclick="closeQuizModal()" class="text-gray-400 hover:text-gray-700 font-bold p-1 cursor-pointer">✕</button>
      </div>
      <div class="space-y-4 text-xs">
        <div>
          <label class="font-bold block mb-1.5 text-gray-800">1. Tình trạng da chính của bạn hiện tại?</label>
          <select id="q1" class="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 font-medium">
            <option value="oily">Da dầu nhiều bã nhờn, dễ nổi mụn</option>
            <option value="dry">Da khô bong tróc, thiếu độ ẩm</option>
            <option value="combo">Da hỗn hợp thiên dầu vùng T-zone</option>
            <option value="sensitive">Da nhạy cảm, dễ mẩn đỏ rát</option>
          </select>
        </div>
        <div>
          <label class="font-bold block mb-1.5 text-gray-800">2. Vấn đề da bạn cần ưu tiên cải thiện nhất?</label>
          <select id="q2" class="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 font-medium">
            <option value="acne">Mụn ẩn, mụn viêm & thâm sau mụn</option>
            <option value="aging">Lão hóa, nếp nhăn & sạm nám</option>
            <option value="dehydrated">Da xỉn màu & xù xì thô ráp</option>
          </select>
        </div>
        <div>
          <label class="font-bold block mb-1.5 text-gray-800">3. Thời gian dành cho chu trình skincare mỗi ngày?</label>
          <select id="q3" class="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 font-medium">
            <option value="fast">Nhanh gọn (2-3 bước: Rửa mặt + Serum + Chống nắng)</option>
            <option value="full">Đầy đủ chuẩn y khoa (5-7 bước chuyên sâu)</option>
          </select>
        </div>
      </div>
      <button onclick="analyzeQuiz()" class="w-full bg-[#9B2A4C] text-white font-black py-3.5 rounded-xl text-xs hover:opacity-95 shadow-md shadow-[#9B2A4C]/30 flex items-center justify-center gap-2 cursor-pointer">
        <i class="ri-magic-line"></i> NHẬN CHẨN ĐOÁN & PHÁC ĐỒ PHÙ HỢP
      </button>
    </div>
  </div>

  <!-- Shopping Cart Slide-out Drawer -->
  <div id="cartDrawer" class="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl p-6 hidden flex-col justify-between border-l border-gray-200 z-50">
    <div class="space-y-4">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="font-extrabold text-sm flex items-center gap-2 text-[#9B2A4C]"><i class="ri-shopping-bag-3-line"></i> GIỎ HÀNG CỦA BẠN</h3>
        <button onclick="toggleCart()" class="text-gray-400 hover:text-gray-700 font-bold p-1 cursor-pointer">✕</button>
      </div>

      <!-- Free shipping progress -->
      <div class="bg-pink-50 p-3 rounded-xl border border-pink-100 text-[11px] space-y-1">
        <p class="font-bold text-[#9B2A4C] flex items-center gap-1"><i class="ri-truck-line"></i> Miễn phí vận chuyển cho đơn từ 500k</p>
        <div class="w-full bg-pink-200 h-1.5 rounded-full overflow-hidden">
          <div id="shipProgress" class="bg-[#9B2A4C] h-full w-0 transition-all duration-300"></div>
        </div>
      </div>

      <div id="cartItems" class="space-y-2.5 text-xs max-h-[350px] overflow-y-auto custom-scrollbar"></div>
    </div>

    <div class="border-t pt-4 space-y-3">
      <div class="flex justify-between text-sm font-black">
        <span>TỔNG CỘNG HÓA ĐƠN:</span>
        <span id="cartTotal" class="text-[#9B2A4C] text-base">0đ</span>
      </div>
      <button onclick="checkout()" class="w-full bg-[#9B2A4C] text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-[#9B2A4C]/30 hover:bg-pink-800 transition-colors flex items-center justify-center gap-2 cursor-pointer">
        <i class="ri-shield-check-line"></i> HOÀN TẤT ĐẶT HÀNG THANH TOÁN
      </button>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-[#1C2526] text-white border-t border-gray-800 py-12 px-4 md:px-8 mt-16 text-xs">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="space-y-3">
        <div class="font-black text-lg text-pink-400 flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-[#9B2A4C] text-white flex items-center justify-center text-xs font-black">C</span>
          COSMETICS CO.
        </div>
        <p class="text-gray-400 leading-relaxed text-[11px]">
          Thương hiệu dược mỹ phẩm y khoa hàng đầu, cam kết mang đến làn da khỏe đẹp bền vững từ gốc.
        </p>
      </div>
      <div>
        <h4 class="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Danh Mục</h4>
        <ul class="space-y-2 text-gray-400 text-[11px]">
          <li><a href="#" class="hover:text-white">Serum Phục Hồi B5</a></li>
          <li><a href="#" class="hover:text-white">Retinol Bọc Sinh Học</a></li>
          <li><a href="#" class="hover:text-white">Kem Chống Nắng Y Khoa</a></li>
          <li><a href="#" class="hover:text-white">Sữa Rửa Mặt Tái Tạo</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Chính Sách</h4>
        <ul class="space-y-2 text-gray-400 text-[11px]">
          <li><a href="#" class="hover:text-white">Chính sách đổi trả 30 ngày</a></li>
          <li><a href="#" class="hover:text-white">Cam kết chính hãng 100%</a></li>
          <li><a href="#" class="hover:text-white">Hướng dẫn soi da online</a></li>
          <li><a href="#" class="hover:text-white">Bảo mật thông tin khách hàng</a></li>
        </ul>
      </div>
      <div class="space-y-3">
        <h4 class="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Đăng Ký Nhận Mã Giảm Giá</h4>
        <div class="flex gap-2">
          <input type="email" placeholder="Email của bạn..." class="bg-gray-800 border border-gray-700 px-3 py-2 rounded-lg text-xs outline-none w-full" />
          <button onclick="alert('🎉 Đăng ký thành công! Mã giảm 10% đã được gửi vào email của bạn.')" class="bg-[#9B2A4C] px-4 py-2 rounded-lg font-bold text-white cursor-pointer">Gửi</button>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-[10px]">
      © 2026 Cosmetics Co. Powered by Aimastery AI E-Commerce Platform.
    </div>
  </footer>

  <script>
    const PRODUCTS = [
      { id: 1, cat: 'serum', name: 'Hyaluronic Acid 2% + B5 Serum', price: 576000, desc: 'Phục hồi màng ẩm, giúp da căng mướt tức thì sau 14 ngày.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', rating: '5.0' },
      { id: 2, cat: 'retinol', name: 'Retinol 1% Encapsulated Booster', price: 690000, desc: 'Tăng tốc độ tái tạo tế bào, giảm thâm mụn & chống lão hóa.', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80', rating: '4.9' },
      { id: 3, cat: 'serum', name: 'Pure Vitamin C 15% Glow Serum', price: 620000, desc: 'Làm đều màu da, dưỡng sáng & mờ thâm nám y khoa.', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80', rating: '4.8' },
      { id: 4, cat: 'sunscreen', name: 'Ultra Shield Sunscreen SPF 50+ PA++++', price: 480000, desc: 'Chống nắng mỏng nhẹ khô thoáng 12h, nâng tông tự nhiên.', img: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&auto=format&fit=crop&q=80', rating: '5.0' },
      { id: 5, cat: 'cleanser', name: 'Gentle Amino Acid Gel Cleanser', price: 340000, desc: 'Sữa rửa mặt tạo bọt mịn pH 5.5 không gây khô rát.', img: 'https://images.unsplash.com/photo-1556228722-d119f4104711?w=600&auto=format&fit=crop&q=80', rating: '4.9' },
      { id: 6, cat: 'retinol', name: 'Niacinamide 10% Zinc PCA Essence', price: 520000, desc: 'Kiểm soát dầu thừa, giảm vi khuẩn mụn & se khít lỗ chân lông.', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80', rating: '4.9' }
    ];
    let cart = [];
    let currentCategory = 'all';

    function renderProducts(list, containerId) {
      const container = document.getElementById(containerId);
      if(!container) return;
      container.innerHTML = list.map(p => \`
        <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div class="relative overflow-hidden rounded-xl aspect-square bg-gray-50">
            <img src="\${p.img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span class="absolute top-2 right-2 bg-white/90 backdrop-blur-md text-[10px] font-bold text-amber-600 px-2 py-0.5 rounded-full border">★ \${p.rating}</span>
          </div>
          <div class="space-y-1">
            <h3 class="font-extrabold text-xs text-[#1C2526] line-clamp-1">\${p.name}</h3>
            <p class="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">\${p.desc}</p>
          </div>
          <div class="flex justify-between items-center border-t pt-2.5">
            <span class="text-sm font-black text-[#9B2A4C]">\${p.price.toLocaleString()}đ</span>
            <button onclick="addToCart('\${p.name}', \${p.price})" class="bg-[#9B2A4C] hover:bg-pink-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1 cursor-pointer">
              <i class="ri-add-line"></i> Thêm
            </button>
          </div>
        </div>
      \`).join('');
    }

    renderProducts(PRODUCTS, 'productGrid');
    renderProducts(PRODUCTS, 'fullProductGrid');

    function filterCategory(cat) {
      currentCategory = cat;
      const filtered = cat === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
      renderProducts(filtered, 'productGrid');
      renderProducts(filtered, 'fullProductGrid');
    }

    function filterProducts(query) {
      const q = query.toLowerCase();
      const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
      renderProducts(filtered, 'productGrid');
      renderProducts(filtered, 'fullProductGrid');
    }

    function addToCart(n, p) {
      cart.push({ n, p, id: Date.now() });
      updateCart();
      toggleCart(true);
    }

    function toggleCart(forceOpen) {
      const drawer = document.getElementById('cartDrawer');
      if (forceOpen) {
        drawer.classList.remove('hidden');
        drawer.classList.add('flex');
      } else {
        drawer.classList.toggle('hidden');
        drawer.classList.toggle('flex');
      }
    }

    function updateCart() {
      document.getElementById('cartCount').innerText = cart.length;
      let total = cart.reduce((a, b) => a + b.p, 0);
      document.getElementById('cartTotal').innerText = total.toLocaleString() + 'đ';
      
      const percent = Math.min(100, (total / 500000) * 100);
      document.getElementById('shipProgress').style.width = percent + '%';

      document.getElementById('cartItems').innerHTML = cart.length === 0 
        ? '<p class="text-center text-gray-400 py-8">Giỏ hàng của bạn đang trống.</p>'
        : cart.map((i, idx) => \`
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p class="font-bold text-xs text-[#1C2526]">\${i.n}</p>
              <p class="text-[11px] text-[#9B2A4C] font-black mt-0.5">\${i.p.toLocaleString()}đ</p>
            </div>
            <button onclick="removeItem(\${idx})" class="text-gray-400 hover:text-red-500 font-bold px-2 cursor-pointer">✕</button>
          </div>
        \`).join('');
    }

    function removeItem(idx) {
      cart.splice(idx, 1);
      updateCart();
    }

    function checkout() {
      if(cart.length === 0) {
        alert('Giỏ hàng trống! Vui lòng chọn sản phẩm.');
        return;
      }
      alert('🎉 ĐẶT HÀNG THÀNH CÔNG! Mã đơn hàng: #ORD-2026-8921. Bộ phận tư vấn sẽ gọi xác nhận trong 15 phút.');
      cart = [];
      updateCart();
      toggleCart(false);
    }

    function openQuizModal() {
      const modal = document.getElementById('quizModal');
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }

    function closeQuizModal() {
      const modal = document.getElementById('quizModal');
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    function analyzeQuiz() {
      closeQuizModal();
      addToCart('Hyaluronic Acid 2% + B5 Serum', 576000);
      addToCart('Retinol 1% Encapsulated Booster', 690000);
      alert('✨ ĐÃ PHÂN TÍCH THÀNH CÔNG! Chúng tôi đã tự động thêm Combo Phục Hồi & Trẻ Hóa Da chuẩn y khoa vào giỏ hàng của bạn kèm ưu đãi 10%.');
    }

    function showTab(tab) {
      document.querySelectorAll('.tab-content').forEach(e => e.classList.add('hidden'));
      document.getElementById('tab-' + tab).classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function scrollToSection(id) {
      showTab('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if(el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  </script>
</body>
</html>
`;

// ============================================================================
// 2. REAL ESTATE PORTAL DEMO (Landmark Estates)
// ============================================================================
const REAL_ESTATE_HTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landmark Estates — Cổng Thông Tin Bất Động Sản Hạng Sang</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-white antialiased min-h-screen">

  <!-- Top Announcement Bar -->
  <div class="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 text-[11px] font-extrabold py-2 px-4 flex justify-between items-center">
    <div class="flex items-center gap-2">
      <i class="ri-vip-crown-fill"></i> <span>HOTLINE TƯ VẤN ĐẦU TƯ BĐS HẠNG SANG: 0909 888 999</span>
    </div>
    <div>
      ✨ MỞ BÁN ĐỢT 1 BIỆT THỰ VEN SÔNG THẢO ĐIỀN | ƯU ĐÃI LÃI SUẤT 0% TRONG 24 THÁNG
    </div>
  </div>

  <!-- Header -->
  <header class="border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur-md z-40">
    <div class="font-black text-xl text-amber-400 flex items-center gap-2 cursor-pointer">
      <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">L</span>
      LANDMARK ESTATES
    </div>
    <div class="text-xs font-bold text-slate-300 gap-6 hidden md:flex">
      <button onclick="filterType('all')" class="hover:text-amber-400 text-amber-400 transition-colors">Tất cả dự án</button>
      <button onclick="filterType('villa')" class="hover:text-amber-400 transition-colors">Biệt thự Ven Sông</button>
      <button onclick="filterType('penthouse')" class="hover:text-amber-400 transition-colors">Penthouse Panorama</button>
      <button onclick="openCalcModal()" class="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
        <i class="ri-[#9B2A4C] ri-calculator-line"></i> Tính Lãi Vay Bank
      </button>
    </div>
    <button onclick="openBookingModal()" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full cursor-pointer shadow-lg shadow-amber-500/20 transition-all">
      <i class="ri-calendar-check-line mr-1"></i> Đặt Lịch Tour 360°
    </button>
  </header>

  <!-- Hero Section -->
  <section class="p-6 max-w-7xl mx-auto space-y-8 pt-8">
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 p-8 md:p-14 text-center space-y-6 shadow-2xl">
      <span class="bg-amber-500/10 text-amber-400 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-amber-500/30 tracking-widest inline-flex items-center gap-1.5">
        <i class="ri-vip-crown-line"></i> Tuyệt Tác Không Gian Sống Thượng Lưu 2026
      </span>
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
        Sở Hữu Bất Động Sản Hạng Sang <br/><span class="bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Vị Trí Kim Cương Độc Quyền</span>
      </h1>
      <p class="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
        Hệ thống biệt thự ven sông Thảo Điền & Penthouse Phú Mỹ Hưng tích hợp công nghệ quản lý nhà thông minh AI, an ninh 5 lớp và đặc quyền bến du thuyền 5 sao.
      </p>

      <!-- Key Metrics -->
      <div class="grid grid-cols-3 gap-4 max-w-lg mx-auto border-y border-amber-500/20 py-3">
        <div>
          <p class="text-xl font-black text-amber-400">1,200+</p>
          <p class="text-[10px] text-slate-400">Căn hộ & Biệt thự đã bàn giao</p>
        </div>
        <div>
          <p class="text-xl font-black text-amber-400">3.5x ROAS</p>
          <p class="text-[10px] text-slate-400">Tăng trưởng giá trị tài sản</p>
        </div>
        <div>
          <p class="text-xl font-black text-amber-400">100%</p>
          <p class="text-[10px] text-slate-400">Sổ hồng lâu dài</p>
        </div>
      </div>
      
      <!-- Interactive Property Search Bar -->
      <div class="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-2xl max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-left shadow-2xl">
        <div>
          <label class="text-[10px] text-slate-400 font-bold block mb-1">KHU VỰC DỰ ÁN</label>
          <select id="searchRegion" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold outline-none">
            <option value="all">Tất cả khu vực</option>
            <option value="thaodien">Thảo Điền / Thủ Đức</option>
            <option value="phumyhung">Phú Mỹ Hưng / Q.7</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] text-slate-400 font-bold block mb-1">LOẠI HÌNH BĐS</label>
          <select id="searchType" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold outline-none">
            <option value="all">Tất cả loại hình</option>
            <option value="villa">Biệt thự ven sông</option>
            <option value="penthouse">Penthouse Panorama</option>
          </select>
        </div>
        <div>
          <label class="text-[10px] text-slate-400 font-bold block mb-1">KHOẢNG GIÁ</label>
          <select id="searchPrice" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold outline-none">
            <option value="all">Tất cả khoảng giá</option>
            <option value="low">15 - 35 Tỷ VNĐ</option>
            <option value="high">35 - 85 Tỷ VNĐ</option>
          </select>
        </div>
        <div class="flex items-end">
          <button onclick="executeSearch()" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl transition-all shadow-md cursor-pointer">
            <i class="ri-search-2-line mr-1"></i> TÌM KIẾM BĐS
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Project Listing Grid -->
  <section class="max-w-7xl mx-auto px-6 py-8 space-y-6">
    <div class="flex justify-between items-center border-b border-slate-800 pb-4">
      <div>
        <span class="text-xs font-black uppercase text-amber-400 tracking-wider">Danh mục dự án nổi bật</span>
        <h2 class="text-2xl font-black text-white">Tuyệt Tác Bất Động Sản 2026</h2>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="filterType('all')" class="bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-full text-xs cursor-pointer">Tất cả</button>
        <button onclick="filterType('villa')" class="bg-slate-800 text-slate-300 font-bold px-4 py-1.5 rounded-full text-xs hover:bg-slate-700 cursor-pointer">Biệt Thự</button>
        <button onclick="filterType('penthouse')" class="bg-slate-800 text-slate-300 font-bold px-4 py-1.5 rounded-full text-xs hover:bg-slate-700 cursor-pointer">Penthouse</button>
      </div>
    </div>

    <div id="realEstateGrid" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
  </section>

  <!-- Interactive Loan Calculator Modal -->
  <div id="calcModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 class="font-black text-sm text-amber-400 flex items-center gap-2">
          <i class="ri-calculator-line"></i> BẢNG TÍNH LÃI VAY NGÂN HÀNG HÀNG THÁNG
        </h3>
        <button onclick="closeCalcModal()" class="text-slate-400 hover:text-white font-bold p-1 cursor-pointer">✕</button>
      </div>

      <div class="space-y-4 text-xs">
        <div>
          <label class="text-slate-300 font-bold block mb-1">Số tiền vay (VNĐ): <span id="loanValText" class="text-amber-400 font-black">10,000,000,000đ</span></label>
          <input type="range" id="loanAmount" min="2000000000" max="30000000000" step="1000000000" value="10000000000" oninput="calculateLoan()" class="w-full accent-amber-500 cursor-pointer" />
        </div>
        <div>
          <label class="text-slate-300 font-bold block mb-1">Thời hạn vay: <span id="yearsValText" class="text-amber-400 font-black">20 Năm</span></label>
          <input type="range" id="loanYears" min="5" max="35" step="5" value="20" oninput="calculateLoan()" class="w-full accent-amber-500 cursor-pointer" />
        </div>
        <div>
          <label class="text-slate-300 font-bold block mb-1">Lãi suất ưu đãi hàng năm (%):</label>
          <input type="number" id="loanRate" value="7.5" step="0.1" oninput="calculateLoan()" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-bold" />
        </div>

        <div class="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-center space-y-1">
          <p class="text-[11px] text-slate-400">Ước tính số tiền cần trả hàng tháng (Gốc + Lãi):</p>
          <p id="monthlyPayment" class="text-2xl font-black text-amber-400">79,500,000 VNĐ/Tháng</p>
        </div>
      </div>

      <button onclick="alert('🎉 Đã gửi bảng tính chi tiết dư nợ giảm dần qua Zalo cho bạn!')" class="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-all cursor-pointer">
        NHẬN LỊCH TRẢ NỢ CHI TIẾT QUA ZALO
      </button>
    </div>
  </div>

  <!-- Booking Modal -->
  <div id="bookingModal" class="fixed inset-0 bg-black/80 backdrop-blur-md z-50 hidden items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 class="font-black text-sm text-amber-400">ĐẶT LỊCH THAM QUAN VIRTUAL TOUR 360°</h3>
        <button onclick="closeBookingModal()" class="text-slate-400 hover:text-white font-bold p-1 cursor-pointer">✕</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="text-slate-300 font-bold block mb-1">Họ & Tên khách hàng:</label>
          <input type="text" id="bName" placeholder="vd: Nguyễn Văn A" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
        </div>
        <div>
          <label class="text-slate-300 font-bold block mb-1">Số điện thoại nhận Zalo Tour:</label>
          <input type="text" id="bPhone" placeholder="vd: 0909 123 456" class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white" />
        </div>
        <div>
          <label class="text-slate-300 font-bold block mb-1">Thời gian xem dự án mong muốn:</label>
          <select class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white">
            <option>Sáng nay (09:00 - 11:30)</option>
            <option>Chiều nay (14:30 - 17:00)</option>
            <option>Cuối tuần này</option>
          </select>
        </div>
      </div>

      <button onclick="submitBooking()" class="w-full bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs hover:bg-amber-400 transition-all cursor-pointer">
        XÁC NHẬN ĐẶT LỊCH THAM QUAN
      </button>
    </div>
  </div>

  <footer class="bg-slate-950 border-t border-slate-800 py-12 px-6 text-xs text-slate-400 text-center">
    © 2026 Landmark Estates. Powered by Aimastery Real Estate Marketing Platform.
  </footer>

  <script>
    const PROJECTS = [
      { id: 1, type: 'villa', region: 'thaodien', price: '45.0 Tỷ', name: 'Landmark Thảo Điền Riverfront Villa', desc: 'Biệt thự đơn lập sân vườn 450m2, thiết kế Indochine sang trọng, hồ bơi vô cực riêng.', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80' },
      { id: 2, type: 'penthouse', region: 'phumyhung', price: '28.5 Tỷ', name: 'Penthouse Duplex Sky Oasis Phú Mỹ Hưng', desc: 'Căn hộ Penthouse thông tầng tầng 36 view trọn sông Sài Gòn & trung tâm Quận 1.', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80' },
      { id: 3, type: 'villa', region: 'thaodien', price: '68.0 Tỷ', name: 'The Grand Heritage Mansion Thủ Đức', priceVal: 'high', desc: 'Dinh thự tân cổ điển 800m2 bến du thuyền riêng, hệ thống AI SmartHome 5 lớp.', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80' }
    ];

    function renderProjects(list) {
      document.getElementById('realEstateGrid').innerHTML = list.map(p => \`
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 group">
          <div class="relative h-56 overflow-hidden">
            <img src="\${p.img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span class="absolute top-3 right-3 bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg">\${p.price}</span>
          </div>
          <div class="p-6 space-y-3">
            <h3 class="font-extrabold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1">\${p.name}</h3>
            <p class="text-xs text-slate-400 leading-relaxed line-clamp-2">\${p.desc}</p>
            <div class="pt-3 border-t border-slate-800 flex justify-between items-center">
              <button onclick="openBookingModal()" class="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer">
                <i class="ri-eye-line"></i> Xem Tour 360°
              </button>
              <button onclick="openBookingModal()" class="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer">
                Nhận Báo Giá Zalo
              </button>
            </div>
          </div>
        </div>
      \`).join('');
    }

    renderProjects(PROJECTS);

    function filterType(type) {
      const list = type === 'all' ? PROJECTS : PROJECTS.filter(p => p.type === type);
      renderProjects(list);
    }

    function executeSearch() {
      const reg = document.getElementById('searchRegion').value;
      const type = document.getElementById('searchType').value;
      const list = PROJECTS.filter(p => (reg === 'all' || p.region === reg) && (type === 'all' || p.type === type));
      renderProjects(list.length ? list : PROJECTS);
    }

    function openCalcModal() {
      document.getElementById('calcModal').classList.remove('hidden');
      document.getElementById('calcModal').classList.add('flex');
    }
    function closeCalcModal() {
      document.getElementById('calcModal').classList.add('hidden');
      document.getElementById('calcModal').classList.remove('flex');
    }

    function calculateLoan() {
      const amount = parseFloat(document.getElementById('loanAmount').value);
      const years = parseFloat(document.getElementById('loanYears').value);
      const rate = parseFloat(document.getElementById('loanRate').value) / 100 / 12;
      const months = years * 12;

      document.getElementById('loanValText').innerText = amount.toLocaleString() + 'đ';
      document.getElementById('yearsValText').innerText = years + ' Năm';

      const monthly = (amount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      document.getElementById('monthlyPayment').innerText = Math.round(monthly).toLocaleString() + ' VNĐ/Tháng';
    }

    function openBookingModal() {
      document.getElementById('bookingModal').classList.remove('hidden');
      document.getElementById('bookingModal').classList.add('flex');
    }
    function closeBookingModal() {
      document.getElementById('bookingModal').classList.add('hidden');
      document.getElementById('bookingModal').classList.remove('flex');
    }

    function submitBooking() {
      const name = document.getElementById('bName').value || 'Khách hàng';
      alert('🎉 ĐÃ ĐẶT LỊCH THÀNH CÔNG! Chuyên viên BĐS Landmark Estates sẽ gửi mã xem Virtual Tour 360° trực tiếp vào Zalo cho ' + name + '!');
      closeBookingModal();
    }
  </script>
</body>
</html>
`;

// ============================================================================
// 3. ENTERPRISE ODOO 18 ERP DEMO (Odoo 18 HRM)
// ============================================================================
const ODOO_HRM_HTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Odoo 18 ERP & Mobile Attendance Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 antialiased min-h-screen">

  <header class="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
    <div class="flex items-center gap-3 font-black text-lg text-purple-400">
      <span class="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black">O</span>
      ODOO 18 ENTERPRISE HR & ATTENDANCE
    </div>
    <div class="flex items-center gap-3">
      <button onclick="triggerScanModal()" class="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer">
        <i class="ri-user-unfollow-line"></i> Chấm Công AI Khuôn Mặt Live
      </button>
    </div>
  </header>

  <main class="max-w-7xl mx-auto p-6 space-y-8">
    <!-- Top Stats Bar -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
        <p class="text-xs text-slate-400 font-bold">Tổng Nhân Sự Công Ty</p>
        <p class="text-2xl font-black text-white">528 Nhân viên</p>
      </div>
      <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
        <p class="text-xs text-slate-400 font-bold">Đã Chấm Công Hôm Nay</p>
        <p class="text-2xl font-black text-emerald-400">492 / 528 (93%)</p>
      </div>
      <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
        <p class="text-xs text-slate-400 font-bold">Đi Muộn / Vắng Mặt</p>
        <p class="text-2xl font-black text-amber-400">12 Trường hợp</p>
      </div>
      <div class="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 space-y-1">
        <p class="text-xs text-slate-400 font-bold">Thời Gian Chấm Công Trung Bình</p>
        <p class="text-2xl font-black text-purple-400">0.18 Giây / Lượt</p>
      </div>
    </div>

    <!-- Attendance Simulation Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-8 bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="font-extrabold text-base text-white flex items-center gap-2">
            <i class="ri-user-scan-line text-purple-400"></i> Bật Máy Quét Chấm Công AI Camera
          </h3>
          <span class="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">● GPS Connected</span>
        </div>

        <div class="relative bg-slate-950 aspect-video rounded-2xl overflow-hidden border border-slate-700 flex flex-col justify-center items-center">
          <img id="facePreview" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80" class="w-full h-full object-cover opacity-60" />
          <div class="absolute inset-0 border-2 border-dashed border-purple-500/60 rounded-2xl m-8 pointer-events-none animate-pulse"></div>
          <div class="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 text-xs flex justify-between items-center">
            <div>
              <p class="font-bold text-white">Nhận diện: Nguyễn Minh Tuấn (DEV-882)</p>
              <p class="text-[10px] text-slate-400">Vị trí GPS: Tòa nhà Landmark 81, Bình Thạnh, TP.HCM</p>
            </div>
            <button onclick="triggerScanModal()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-lg transition-colors cursor-pointer">
              BẮT ĐẦU CHECK-IN AI
            </button>
          </div>
        </div>
      </div>

      <!-- Live Attendance Log -->
      <div class="lg:col-span-4 bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 space-y-4">
        <h3 class="font-extrabold text-sm text-white">Lịch Sử Chấm Công Realtime</h3>
        <div id="logList" class="space-y-3 text-xs max-h-[320px] overflow-y-auto"></div>
      </div>
    </div>
  </main>

  <script>
    const LOGS = [
      { name: 'Nguyễn Văn Anh', dept: 'Phòng AI Labs', time: '08:14:02', status: 'Đúng giờ' },
      { name: 'Trần Thị Mai', dept: 'Phòng Marketing', time: '08:22:15', status: 'Đúng giờ' },
      { name: 'Lê Hoàng Nam', dept: 'Phòng Kinh Doanh', time: '08:47:00', status: 'Đi muộn 17p' }
    ];

    function renderLogs() {
      document.getElementById('logList').innerHTML = LOGS.map(l => \`
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-700/80 flex justify-between items-center">
          <div>
            <p class="font-bold text-white">\${l.name}</p>
            <p class="text-[10px] text-slate-400">\${l.dept} • \${l.time}</p>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full \${l.status === 'Đúng giờ' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}">\${l.status}</span>
        </div>
      \`).join('');
    }
    renderLogs();

    function triggerScanModal() {
      LOGS.unshift({ name: 'Nguyễn Minh Tuấn', dept: 'Kỹ sư AI', time: new Date().toLocaleTimeString(), status: 'Đúng giờ' });
      renderLogs();
      alert('✅ CHẤM CÔNG THÀNH CÔNG! Đã xác nhận khuôn mặt & tọa độ GPS của Nguyễn Minh Tuấn.');
    }
  </script>
</body>
</html>
`;

// ============================================================================
// 4. AURA BEAUTY SPA DEMO (Aura Spa)
// ============================================================================
const AURA_SPA_HTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura Beauty Spa — Landing Page Đặt Lịch Chăm Sóc Da</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#FAF6F0] text-[#2C221E] antialiased min-h-screen">

  <header class="bg-white/90 backdrop-blur-md border-b border-[#E8DCCF] px-6 py-4 flex justify-between items-center sticky top-0 z-40">
    <div class="font-black text-xl text-[#9B2A4C] flex items-center gap-2">
      <span class="w-8 h-8 rounded-full bg-[#9B2A4C] text-white flex items-center justify-center font-black">A</span>
      AURA BEAUTY SPA
    </div>
    <button onclick="openBooking()" class="bg-[#9B2A4C] hover:bg-[#7B1E3A] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg shadow-[#9B2A4C]/25 transition-all cursor-pointer">
      <i class="ri-calendar-event-line mr-1"></i> Đặt Lịch Chăm Sóc Da
    </button>
  </header>

  <section class="p-6 max-w-7xl mx-auto space-y-8 pt-6">
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#9B2A4C] via-[#7B1E3A] to-[#4A1525] text-white p-8 md:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-4 max-w-xl">
        <span class="bg-white/15 text-pink-200 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
          Liệu Trình Chuẩn Y Khoa 2026
        </span>
        <h1 class="text-3xl md:text-5xl font-black leading-tight">
          Tái Tạo Làn Da Mịn Màng <br/><span class="text-amber-200">Không Tùy Vết Với Hifu 7D</span>
        </h1>
        <p class="text-xs md:text-sm text-pink-100/90 leading-relaxed">
          Cam kết hoàn tiền 100% nếu không đạt hiệu quả cải thiện sắc tố da và mờ thâm mụn sau 1 liệu trình duy nhất.
        </p>
        <button onclick="openBooking()" class="bg-white text-[#9B2A4C] font-extrabold text-xs px-6 py-3.5 rounded-full shadow-lg hover:bg-pink-50 transition-all cursor-pointer">
          ĐẶT LỊCH HẸN TRỰC TUYẾN
        </button>
      </div>

      <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80" class="rounded-3xl shadow-2xl border-4 border-white/20 w-full h-[350px] object-cover" />
    </div>

    <!-- Services Grid -->
    <div class="space-y-4">
      <h2 class="text-2xl font-black text-[#2C221E]">Dịch Vụ Spa Được Yêu Thích Nhất</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-5 rounded-3xl border border-[#E8DCCF] shadow-sm space-y-3">
          <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80" class="w-full aspect-video object-cover rounded-2xl" />
          <h3 class="font-black text-base text-[#2C221E]">Chăm Sóc Da Hydrafacial 9 Bước</h3>
          <p class="text-xs text-gray-500">Hút sạch bã nhờn, thải độc tố chì và cấp ẩm sâu tầng trung bì.</p>
          <div class="flex justify-between items-center border-t pt-3">
            <span class="font-black text-[#9B2A4C] text-sm">890.000đ</span>
            <button onclick="openBooking()" class="bg-[#9B2A4C] text-white px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer">Đặt Lịch</button>
          </div>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#E8DCCF] shadow-sm space-y-3">
          <img src="https://images.unsplash.com/photo-1512290900673-7002fffe9353?w=600&auto=format&fit=crop&q=80" class="w-full aspect-video object-cover rounded-2xl" />
          <h3 class="font-black text-base text-[#2C221E]">Triệt Lông Băng Băng Diode Laser</h3>
          <p class="text-xs text-gray-500">Công nghệ làm lạnh 0°C không đau rát, bảo hành 5 năm toàn quốc.</p>
          <div class="flex justify-between items-center border-t pt-3">
            <span class="font-black text-[#9B2A4C] text-sm">1.200.000đ</span>
            <button onclick="openBooking()" class="bg-[#9B2A4C] text-white px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer">Đặt Lịch</button>
          </div>
        </div>

        <div class="bg-white p-5 rounded-3xl border border-[#E8DCCF] shadow-sm space-y-3">
          <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&auto=format&fit=crop&q=80" class="w-full aspect-video object-cover rounded-2xl" />
          <h3 class="font-black text-base text-[#2C221E]">Trẻ Hóa Nâng Cơ Hifu 7D Max</h3>
          <p class="text-xs text-gray-500">Kích thích tăng sinh Collagen tự nhiên, săn chắc nọng cằm và cơ mặt.</p>
          <div class="flex justify-between items-center border-t pt-3">
            <span class="font-black text-[#9B2A4C] text-sm">2.500.000đ</span>
            <button onclick="openBooking()" class="bg-[#9B2A4C] text-white px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer">Đặt Lịch</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Booking Modal -->
  <div id="bModal" class="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 hidden items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="font-black text-sm text-[#9B2A4C]">ĐẶT LỊCH HẸN AURA BEAUTY SPA</h3>
        <button onclick="closeBooking()" class="text-gray-400 hover:text-black font-bold p-1 cursor-pointer">✕</button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="font-bold block mb-1 text-gray-800">Chọn Chi Nhánh Spa:</label>
          <select class="w-full border border-gray-200 rounded-xl p-3 bg-gray-50">
            <option>Chi nhánh 1: Quận 1, TP.HCM</option>
            <option>Chi nhánh 2: Quận 3, TP.HCM</option>
            <option>Chi nhánh 3: Cầu Giấy, Hà Nội</option>
          </select>
        </div>
        <div>
          <label class="font-bold block mb-1 text-gray-800">Số Điện Thoại Nhận SMS/Zalo:</label>
          <input type="text" id="spaPhone" placeholder="vd: 0988 123 456" class="w-full border border-gray-200 rounded-xl p-3 bg-gray-50" />
        </div>
      </div>

      <button onclick="alert('🎉 ĐÃ ĐẶT LỊCH THÀNH CÔNG! Mã xác nhận hẹn đã gửi về Zalo của bạn.')" class="w-full bg-[#9B2A4C] text-white font-black py-3.5 rounded-xl text-xs shadow-md cursor-pointer">
        XÁC NHẬN ĐẶT LỊCH
      </button>
    </div>
  </div>

  <script>
    function openBooking() {
      document.getElementById('bModal').classList.remove('hidden');
      document.getElementById('bModal').classList.add('flex');
    }
    function closeBooking() {
      document.getElementById('bModal').classList.add('hidden');
      document.getElementById('bModal').classList.remove('flex');
    }
  </script>
</body>
</html>
`;

// ============================================================================
// 5. GOURMET BISTRO DEMO (Gourmet Bistro)
// ============================================================================
const GOURMET_BISTRO_HTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gourmet Bistro — Website Nhà Hàng & Thực Đơn QR</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#12121A] text-white antialiased min-h-screen">

  <header class="bg-black/90 border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
    <div class="font-black text-xl text-amber-400 flex items-center gap-2">
      <span class="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black">G</span>
      GOURMET BISTRO
    </div>
    <button onclick="alert('📱 Đã quét mã QR Bàn 5! Bắt đầu chọn món trực tiếp.')" class="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-5 py-2.5 rounded-full cursor-pointer">
      <i class="ri-qr-code-line mr-1"></i> Gọi Món QR Tại Bàn
    </button>
  </header>

  <section class="p-6 max-w-7xl mx-auto space-y-8 pt-6">
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/80 via-slate-900 to-black p-8 md:p-14 border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-4 max-w-xl">
        <span class="bg-amber-500/10 text-amber-400 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/20">
          Ẩm Thực Á - Âu Thượng Hạng
        </span>
        <h1 class="text-3xl md:text-5xl font-black leading-tight text-white">
          Thưởng Thức Hương Vị <br/><span class="text-amber-400">Beefsteak Bò Wagyu A5</span>
        </h1>
        <p class="text-xs md:text-sm text-gray-300 leading-relaxed">
          Được chế biến bởi Bếp Trưởng Michelin với nguyên liệu nhập khẩu tươi sống 100% trong ngày.
        </p>
        <button onclick="alert('🎉 Đã đặt bàn thành công cho 2 người lúc 19:30 tối nay!')" class="bg-amber-500 text-black font-extrabold text-xs px-6 py-3.5 rounded-full shadow-lg hover:bg-amber-400 transition-all cursor-pointer">
          ĐẶT BÀN TRỰC TUYẾN GIẢM 10%
        </button>
      </div>

      <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80" class="rounded-3xl shadow-2xl border-4 border-white/10 w-full h-[350px] object-cover" />
    </div>
  </section>

  <footer class="border-t border-gray-800 py-8 text-center text-xs text-gray-500">
    © 2026 Gourmet Bistro. Powered by Aimastery F&B POS Platform.
  </footer>
</body>
</html>
`;

// ============================================================================
// 6. EDUMASTER LMS DEMO (EduMaster LMS)
// ============================================================================
const EDUMASTER_LMS_HTML = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduMaster — Nền Tảng Đào Tạo & Khóa Học Trực Tuyến</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-[#0B0F19] text-white antialiased min-h-screen">

  <header class="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
    <div class="font-black text-xl text-cyan-400 flex items-center gap-2">
      <span class="w-8 h-8 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-black">E</span>
      EDUMASTER LMS
    </div>
    <button onclick="alert('🎓 Đã kích hoạt quyền học thử Khóa học AI Automation!')" class="bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs px-5 py-2.5 rounded-full shadow-lg shadow-cyan-500/20 cursor-pointer">
      <i class="ri-play-circle-line mr-1"></i> Học Thử Video DRM
    </button>
  </header>

  <section class="p-6 max-w-7xl mx-auto space-y-8 pt-6">
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/20 p-8 md:p-14 text-center space-y-6 shadow-2xl">
      <span class="bg-cyan-500/10 text-cyan-400 text-xs font-black uppercase px-4 py-1.5 rounded-full border border-cyan-500/20 tracking-wider">
        Nền Tảng Đào Tạo Công Nghệ AI 2026
      </span>
      <h1 class="text-3xl md:text-5xl font-black text-white leading-tight">
        Làm Chủ Công Nghệ AI Automation <br/><span class="text-cyan-400">Tăng Gấp 5 Lần Hiệu Suất</span>
      </h1>
      <p class="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto leading-relaxed">
        Hơn 150+ bài giảng HD chất lượng cao, thực hành dự án thực tế kèm chứng chỉ kiểm định y khoa và công nghệ.
      </p>

      <div class="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-video bg-black flex justify-center items-center">
        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1000&auto=format&fit=crop&q=80" class="absolute inset-0 w-full h-full object-cover opacity-30" />
        <button onclick="alert('▶️ Đang phát Video Bài 1: Tổng quan quy trình tự động hóa n8n & ChatGPT')" class="relative w-16 h-16 rounded-full bg-cyan-500 text-black flex items-center justify-center text-2xl font-black shadow-xl hover:scale-110 transition-transform cursor-pointer">
          <i class="ri-play-fill"></i>
        </button>
      </div>
    </div>
  </section>

  <footer class="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
    © 2026 EduMaster LMS. Powered by Aimastery E-Learning Platform.
  </footer>
</body>
</html>
`;

// ============================================================================
// PRODUCT DEMO DICTIONARY EXPORT
// ============================================================================
export const PRODUCT_DEMO_HTML: Record<string, string> = {
  'cosmetics-co': COSMETICS_HTML,
  'senn-cosmetics': COSMETICS_HTML,
  'landmark-real-estate': REAL_ESTATE_HTML,
  'odoo-hrm-mobile': ODOO_HRM_HTML,
  'aura-beauty-spa': AURA_SPA_HTML,
  'gourmet-bistro': GOURMET_BISTRO_HTML,
  'edumaster-lms': EDUMASTER_LMS_HTML,
};
