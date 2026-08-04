export interface PromptItem {
  id: string;
  title: string;
  category: 'Marketing & Sales' | 'Content & Social' | 'AI Automation' | 'SEO & Copywriting' | 'Consulting & Code';
  model: 'ChatGPT 4o' | 'Claude 3.5 Sonnet' | 'DeepSeek R1' | 'Midjourney v7';
  badgeColor: string;
  summary: string;
  systemPrompt: string;
  userPrompt: string;
  usageGuide: string;
  exampleOutput: string;
  imageUrl?: string;
  variables: { name: string; label: string; placeholder: string }[];
}

export const PROMPT_LIBRARY: PromptItem[] = [
  {
    id: 'meta-tiktok-ads-5-angles',
    title: 'Kịch Bản Video Meta & TikTok Ads 5 Góc Nhìn Đột Phá (Pain Point, FOMO, Social Proof)',
    category: 'Marketing & Sales',
    model: 'ChatGPT 4o',
    badgeColor: 'bg-rose-500',
    summary: 'Tự động tạo 5 góc quay & câu chuyện bán hàng độc đáo giải quyết đúng nỗi đau khách hàng, tối ưu giữ chân 3 giây đầu.',
    systemPrompt: `You are a World-Class Direct Response Copywriter & Creative Strategist with 10+ years of experience generating $10M+ in ad spend revenue.
Your task is to write high-converting short video scripts (15-30s) optimized for Meta Reels, TikTok, and Shorts.
Rules:
1. Hook must be under 3 seconds and trigger curiosity or immediate pain-point recognition.
2. Structure: Hook -> Problem -> Solution Demonstration -> Offer/CTA.
3. Include visual cues [Scene Description], audio/voiceover text, and screen text overlays.`,
    userPrompt: `Hãy lập 5 kịch bản video ngắn bán hàng cho sản phẩm/dịch vụ sau:
- Sản phẩm/Dịch vụ: [Tên sản phẩm / dịch vụ]
- Khách hàng mục tiêu: [Độ tuổi, giới tính, nỗi đau chính]
- Ưu đãi chính: [Giá khuyến mãi / Quà tặng]
- Góc nhìn kịch bản cần có:
  1. Góc Nỗi Đau (Pain Point Focus)
  2. Góc Bằng Chứng Xã Hội (Social Proof & Review)
  3. Góc Tạo Cảm Giác Gấp Rút (FOMO & Limited Offer)
  4. Góc So Sánh Trước - Sau (Before & After Transformation)
  5. Góc Câu Chuyện Cá Nhân (Relatable Storytelling)`,
    usageGuide: 'Thay thế các biến trong dấu ngoặc vuông `[...]` bằng thông tin sản phẩm thực tế của bạn trước khi gửi cho ChatGPT hoặc Claude.',
    exampleOutput: `🎬 KỊCH BẢN 1: GÓC NỖI ĐAU (PAIN POINT)
[Cảnh 1 - 0-3s]
Visual: Quay cận cảnh gương mặt lo lắng nhìn vào màn hình máy tính.
Text trên màn hình: "Lại mất 4 tiếng chỉ để viết bài quảng cáo?"
Voiceover: "Nếu bạn đang mệt mỏi vì cạn ý tưởng viết bài bán hàng mỗi ngày..."
[Cảnh 2 - 3-10s]
Visual: Màn hình thao tác AI tự động tạo bài viết trong 10 giây.
Voiceover: "Đây là giải pháp giúp bạn nhân 5 doanh số mà không tốn công."`,
    variables: [
      { name: 'product', label: 'Tên sản phẩm / dịch vụ', placeholder: 'vd: Khóa học AI Marketing Thực Chiến' },
      { name: 'targetAudience', label: 'Khách hàng mục tiêu', placeholder: 'vd: Chủ shop thời trang, Marketer trẻ' },
      { name: 'offer', label: 'Ưu đãi chính', placeholder: 'vd: Giảm 50% suất đăng ký sớm' },
    ],
  },
  {
    id: 'n8n-zalo-crm-workflow-builder',
    title: 'Tự Động Hóa Workflow n8n & Zalo OA Chăm Sóc Khách Hàng 24/7',
    category: 'AI Automation',
    model: 'Claude 3.5 Sonnet',
    badgeColor: 'bg-purple-600',
    summary: 'Xây dựng sơ đồ quy trình tự động n8n/Make kết nối Webhook landing page với Zalo ZNS và CRM quản lý Lead.',
    systemPrompt: `You are an Enterprise Solutions Architect & Automation Specialist in n8n, Make.com, and REST APIs.
Output format:
1. Architectural Flowchart (Mermaid syntax or Markdown step list).
2. Detailed Node Configuration for n8n (Trigger, HTTP Request, Code Node, Webhook).
3. Payload JSON template for Zalo OA / ZNS API messaging.`,
    userPrompt: `Tôi muốn xây dựng luồng tự động hóa n8n cho quy trình sau:
- Trigger: Nhận thông tin Lead từ [Form Landing Page / Webhook]
- Xử lý 1: Lưu thông tin vào [Google Sheet / HubSpot CRM]
- Xử lý 2: Phân loại nhóm khách hàng qua AI (Tiềm năng cao / Thường)
- Hành động 1: Gửi tin nhắn xác nhận Zalo OA (ZNS API) đến số điện thoại khách hàng.
- Hành động 2: Báo Notification cho đội ngũ Sales trên nhóm [Telegram / Slack] nếu là Lead tiềm năng cao.

Hãy viết chi tiết các node n8n và cấu hình JSON mẫu.`,
    usageGuide: 'Copy đoạn System Prompt & User Prompt để yêu cầu Claude 3.5 tạo mã JSON có thể Import trực tiếp vào n8n Canvas.',
    exampleOutput: `⚙️ N8N WORKFLOW NODES:
1. Webhook Trigger Node (POST /api/leads)
2. OpenAI Node (Classify Lead Priority: High / Medium / Low)
3. Zalo ZNS HTTP Request Node (Authorization: Bearer <ZALO_TOKEN>)
4. Telegram Bot Node (Send Alert to Sales Group)`,
    variables: [
      { name: 'triggerSource', label: 'Nguồn Lead', placeholder: 'vd: Elementor Form / Webhook' },
      { name: 'crmSystem', label: 'Hệ thống CRM', placeholder: 'vd: HubSpot / Google Sheets' },
    ],
  },
  {
    id: 'geo-seo-google-ai-search-top1',
    title: 'Dàn Ý Bài Viết SEO & GEO Top 1 AI Search (Perplexity & ChatGPT Search)',
    category: 'SEO & Copywriting',
    model: 'DeepSeek R1',
    badgeColor: 'bg-emerald-600',
    summary: 'Tạo dàn ý bài viết chuẩn E-E-A-T phục vụ thuật toán tìm kiếm AI thế hệ mới, tối ưu trích dẫn câu trả lời.',
    systemPrompt: `You are a Senior SEO Strategist & Generative Engine Optimizer (GEO).
Rules for GEO Output:
- Focus on Information Gain & Original Insights.
- Use Schema-ready structure (Q&A format, concise summary tables, bullet points).
- Include authoritative citations and clear H2/H3 subheadings.`,
    userPrompt: `Lập dàn ý chi tiết 2,000 từ chuẩn GEO & SEO cho từ khóa chính: [Từ khóa chính]
- Mục tiêu bài viết: Trả lời thỏa mãn Search Intent của người dùng và được AI Search (Perplexity, ChatGPT) trích dẫn làm câu trả lời hàng đầu.
- Yêu cầu cấu trúc:
  1. H1 Tiêu đề hấp dẫn chứa từ khóa.
  2. Đoạn mở đầu (TL;DR Summary Box) tóm tắt trực tiếp câu trả lời trong 3 câu.
  3. Bảng so sánh hoặc số liệu thống kê.
  4. Các thẻ H2, H3 triển khai chi tiết khía cạnh E-E-A-T (Kinh nghiệm, Chuyên môn, Thẩm quyền, Tin cậy).
  5. Mục FAQ (5 câu hỏi thường gặp nhất).`,
    usageGuide: 'Nhập từ khóa ngành nghề của bạn để nhận dàn ý chuẩn SEO được tối ưu hóa cho AI Search 2026.',
    exampleOutput: `📌 DÀN Ý GEO TOP 1:
H1: Hướng Dẫn Tự Động Hóa AI Marketing Cho Doanh Nghiệp 2026
[TL;DR Box] Tóm tắt nhanh: Tự động hóa AI giúp tiết kiệm 70% thời gian vận hành...
H2: 1. AI Automation Là Gì & Tại Sao Lại Cần Thiết?
H2: 2. Bảng So Sánh Chi Phí Vận Hành Thủ Công vs Vận Hành AI`,
    variables: [
      { name: 'keyword', label: 'Từ khóa SEO chính', placeholder: 'vd: Tự động hóa AI Marketing' },
    ],
  },
  {
    id: 'threads-linkedin-viral-thought-leadership',
    title: 'Chuỗi Bài Viết Viral Xây Dựng Thương Hiệu Cá Nhân Trê Threads & LinkedIn',
    category: 'Content & Social',
    model: 'ChatGPT 4o',
    badgeColor: 'bg-cyan-600',
    summary: 'Biến trải nghiệm cá nhân thành chuỗi post bài Threads & LinkedIn thu hút hàng ngàn lượt tương tác tự nhiên.',
    systemPrompt: `You are a Personal Branding Specialist & Viral Ghostwriter for Tech Executives and Entrepreneurs on LinkedIn and Threads.
Tone of Voice: Authentic, sharp, empathetic, vulnerable yet insightful.
Formatting: Short punchy sentences, generous line breaks, zero fluff.`,
    userPrompt: `Hãy chuyển đổi bài học/kinh nghiệm sau đây của tôi thành 3 bài viết viral cho [Threads / LinkedIn]:
- Câu chuyện/Kinh nghiệm: [Mô tả trải nghiệm, bài học học được hoặc thất bại đã vượt qua]
- Bài viết 1: Dạng Storytelling chân thật (Chia sẻ thất bại & bài học xương máu)
- Bài viết 2: Dạng Contrarian Viewpoint (Góc nhìn đi ngược số đông gây tranh luận văn minh)
- Bài viết 3: Dạng Actionable Framework (Tóm tắt 3 bước thực hành áp dụng ngay)`,
    usageGuide: 'Điền câu chuyện trải nghiệm cá nhân để AI tạo nội dung có hồn, không bị rập khuôn.',
    exampleOutput: `📱 BÀI THREADS VIRAL:
"Tôi từng mất 50 triệu vì nghĩ rằng chạy quảng cáo Ads là cách duy nhất để có đơn hàng...
Cho đến khi tôi phát hiện ra sức mạnh của việc xây phễu Zalo tự động.
Dưới đây là 3 bài học đắt giá tôi ước mình biết từ 2 năm trước:
1. Traffic là hàng vay mượn, Data mới là tài sản..."`,
    variables: [
      { name: 'experience', label: 'Trải nghiệm / Bài học của bạn', placeholder: 'vd: Thất bại khi tự lập nghiệp năm 23 tuổi...' },
    ],
  },
  {
    id: 'midjourney-v7-hyperrealistic-product-photo',
    title: 'Prompt Midjourney v7 Chụp Ảnh Sản Phẩm Studio 3D Chuẩn Bìa Tạp Chí',
    category: 'Content & Social',
    model: 'Midjourney v7',
    badgeColor: 'bg-rose-600',
    summary: 'Bộ Prompt nhiếp ảnh Studio 3D siêu thực tạo bối cảnh ánh sáng và chất liệu sản phẩm đẳng cấp như bìa tạp chí.',
    systemPrompt: `You are an Elite Commercial Photographer & Midjourney Prompt Engineer specializing in high-end luxury product photography.`,
    userPrompt: `Tạo Prompt Midjourney v7 tiếng Anh chi tiết cho sản phẩm: [Tên sản phẩm / Chai mỹ phẩm / Đồng hồ / Giày]
Yêu cầu phong cách:
- Bối cảnh: [Studio tối giản / Bãi biển nhiệt đới / Mặt đá Marble sang trọng]
- Ánh sáng: Softbox studio lighting, volumetric light rays, 8k resolution, Octane Render.
- Góc máy: Close-up macro lens, shallow depth of field (f/1.8).
- Thêm tham số: --v 7 --stylize 250 --ar 4:5 --q 2`,
    usageGuide: 'Copy mã Prompt tiếng Anh do AI tạo ra và dán trực tiếp vào Midjourney Discord bot.',
    exampleOutput: `📸 MIDJOURNEY PROMPT:
/imagine prompt: Ultra-realistic commercial product photography of a luxury minimalist glass cosmetic serum bottle resting on black marble stone, soft pastel studio lighting, caustics water reflections, macro 85mm lens, f/1.8 depth of field, Octane render 8k --ar 4:5 --v 7 --stylize 300`,
    variables: [
      { name: 'productName', label: 'Tên sản phẩm', placeholder: 'vd: Chai serum dưỡng da cao cấp' },
      { name: 'backgroundStyle', label: 'Bối cảnh mong muốn', placeholder: 'vd: Mặt đá Marble đen sang trọng' },
    ],
  },
  {
    id: 'ai-consulting-digital-transformation-audit',
    title: 'Tư Vấn & Lập Bản Đồ Đột Phá AI Automation Cho Doanh Nghiệp SMEs',
    category: 'Consulting & Code',
    model: 'Claude 3.5 Sonnet',
    badgeColor: 'bg-amber-600',
    summary: 'Phân tích quy trình hiện tại của doanh nghiệp và đề xuất danh mục ứng dụng AI/Automation tiết kiệm tối đa ngân sách.',
    systemPrompt: `You are a Principal Digital Transformation Consultant with expertise in AI Operations and Lean Process Management.`,
    userPrompt: `Hãy đóng vai Chuyên gia tư vấn chuyển đổi số AI cho doanh nghiệp của tôi:
- Ngành nghề kinh doanh: [Ngành nghề kinh doanh]
- Quy mô nhân sự: [Số lượng nhân sự]
- Quy trình hiện tại đang tốn nhiều thời gian nhất: [Mô tả quy trình thủ công đang bị nghẽn]

Hãy lập báo cáo đề xuất:
1. 3 vị trí quy trình cần áp dụng AI & Tự động hóa ngay lập tức.
2. Các công cụ phần mềm đề xuất (n8n, ChatGPT Team, Zalo OA, Make, Odoo).
3. Dự toán thời gian hoàn vốn (ROI) và % năng suất tăng thêm.`,
    usageGuide: 'Sử dụng kịch bản này khi bạn cần tư vấn lộ trình ứng dụng AI bài bản cho công ty hoặc khách hàng của bạn.',
    exampleOutput: `📊 BÁO CÁO ĐỀ XUẤT ỨNG DỤNG AI:
1. Tự động hóa phễu tư vấn Zalo OA (Tiết kiệm 2 nhân sự CSKH)
2. Tự động tổng hợp báo cáo tài chính tuần (n8n + Google Sheets API)
3. Dự kiến thời gian hoàn vốn đầu tư: 45 ngày.`,
    variables: [
      { name: 'industry', label: 'Ngành nghề kinh doanh', placeholder: 'vd: Chuỗi Spa & Thẩm mỹ viện' },
      { name: 'headcount', label: 'Quy mô nhân sự', placeholder: 'vd: 15 nhân viên' },
    ],
  },
];
