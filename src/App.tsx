/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Download, FileText, Scale } from 'lucide-react';
import { EVIDENCE_LIST } from './data/evidenceData';
import { EvidenceBlockSection } from './components/EvidenceBlockSection';
import { CommentsSection } from './components/CommentsSection';
import { LegalDisclaimer } from './components/LegalDisclaimer';
import { SeoKeywordsBar } from './components/SeoKeywordsBar';
import { BackToTopButton } from './components/BackToTopButton';
import { ImageZoomModal } from './components/ImageZoomModal';

export default function App() {
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const handleOpenZoom = (src: string, alt: string) => {
    setZoomImage({ src, alt });
  };

  const handleCloseZoom = () => {
    setZoomImage(null);
  };

  return (
    <main
      id="evidence-landing-page"
      className="min-h-screen bg-neutral-100/70 text-neutral-900 font-sans antialiased py-6 sm:py-10 px-3 sm:px-6 md:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Banner thông báo quy định pháp luật mới về chậm trả lương */}
        <aside
          id="legal-decree-banner"
          aria-label="Quy định xử phạt chậm trả lương"
          className="mb-8 sm:mb-10 rounded-2xl bg-amber-50 border border-amber-200/90 p-4 sm:p-5 shadow-xs transition-all"
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 p-2 rounded-xl bg-amber-500/15 text-amber-800 shrink-0">
              <Scale className="w-5 h-5 text-amber-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-200/70 text-amber-900">
                  Cập nhật pháp lý
                </span>
                <span className="text-xs text-amber-700/80 font-medium">Thời sự VTV</span>
              </div>
              <p className="text-neutral-900 font-semibold text-sm sm:text-base leading-snug">
                Từ ngày 10/9/2026, theo{' '}
                <span className="text-amber-900 underline font-bold decoration-amber-400 underline-offset-2">
                  Nghị định 283/2026/NĐ-CP
                </span>
                , doanh nghiệp chậm trả lương hoặc trả lương không đúng hạn cho người lao động có thể bị phạt tiền tối đa lên đến{' '}
                <span className="text-red-600 font-bold">100 triệu đồng</span>.
              </p>
            </div>
          </div>
        </aside>

        {/* Phần tiêu đề và nút tải file diễn biến chi tiết */}
        <header className="flex flex-col items-center mb-10 sm:mb-14">
          <div className="mb-3.5 flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-neutral-200/90 shadow-xs p-2.5">
            <img src="/favicon.svg" alt="Biểu tượng pháp lý" className="w-full h-full object-contain" />
          </div>
          
          <h1
            id="main-title"
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-tight text-neutral-950 uppercase mb-4 sm:mb-6"
          >
            DANH SÁCH CHỨNG CỨ KÈM THEO | ĐẬU FOOD REVIEW
          </h1>

        <h2
        id="main-title"
        className="text-xl sm:text-2xl md:text-2xl font-extrabold text-center tracking-tight text-neutral-950 mb-4 sm:mb-6"
      >
        Đậu Food viện cớ nhân viên part-time nghỉ ngang để không thanh toán tiền công
      </h2>

          {/* Nút tải và xem file diễn biến chi tiết */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              id="download-detailed-report-btn"
              href="/Don_de_nghi_hoa_giai_tranh_chap_lao_dong.pdf"
              download="Don_de_nghi_hoa_giai_tranh_chap_lao_dong.pdf"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium text-sm sm:text-base shadow-sm hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 border border-neutral-800 cursor-pointer"
            >
              <Download className="w-5 h-5 text-neutral-300" />
              <span>Tải file diễn biến chi tiết (PDF)</span>
            </a>

            <a
              id="view-detailed-report-btn"
              href="/Don_de_nghi_hoa_giai_tranh_chap_lao_dong.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-neutral-800 font-medium text-sm sm:text-base shadow-sm hover:bg-neutral-50 active:scale-[0.98] transition-all duration-200 border border-neutral-300 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-neutral-600" />
              <span>Xem trực tiếp file PDF</span>
            </a>
          </div>
        </header>

        {/* Danh sách 5 khối chứng cứ lần lượt theo đúng thứ tự */}
        <div className="space-y-10 sm:space-y-14">
          {EVIDENCE_LIST.map((block) => (
            <EvidenceBlockSection
              key={block.id}
              block={block}
              onOpenZoom={handleOpenZoom}
            />
          ))}
        </div>

        {/* Khu vực bình luận và đánh giá lưu trữ Cloud */}
        <CommentsSection />

        {/* Khu vực Lưu ý pháp lý & Miễn trừ trách nhiệm cùng Từ khóa SEO */}
        <div className="mt-12 sm:mt-14 space-y-5">
          <LegalDisclaimer />
          <SeoKeywordsBar />
        </div>

        {/* Nút tải ở cuối trang để người dùng sau khi xem xong có thể tải ngay */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-neutral-200/80 flex flex-col items-center text-center">
          <p className="text-neutral-600 text-sm mb-4">
            Hồ sơ pháp lý: Đơn đề nghị hòa giải tranh chấp lao động và toàn bộ diễn biến chi tiết
          </p>
          <a
            id="footer-download-detailed-report-btn"
            href="/Don_de_nghi_hoa_giai_tranh_chap_lao_dong.pdf"
            download="Don_de_nghi_hoa_giai_tranh_chap_lao_dong.pdf"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-neutral-900 text-white font-medium text-sm sm:text-base shadow-sm hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 border border-neutral-800 cursor-pointer"
          >
            <Download className="w-5 h-5 text-neutral-300" />
            <span>Tải file diễn biến chi tiết (PDF)</span>
          </a>
        </div>
      </div>

      {/* Nút quay lại đầu trang */}
      <BackToTopButton />

      {/* Lightbox xem ảnh kích thước đầy đủ khi nhấp chuột */}
      <ImageZoomModal
        src={zoomImage?.src ?? null}
        alt={zoomImage?.alt ?? ''}
        onClose={handleCloseZoom}
      />
    </main>
  );
}
