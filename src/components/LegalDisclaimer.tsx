import { Info } from 'lucide-react';

export function LegalDisclaimer() {
  return (
    <aside
      id="legal-disclaimer-card"
      aria-label="Lưu ý pháp lý và miễn trừ trách nhiệm"
      className="w-full bg-[#261d14] rounded-2xl p-4 sm:p-5 md:p-6 border border-amber-600/40 shadow-lg shadow-black/15 transition-shadow duration-200"
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="shrink-0 mt-0.5 text-amber-500">
          <Info className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 stroke-[2.2]" />
        </div>
        <div className="flex-1 space-y-1.5">
          <h3 className="text-amber-400 font-bold text-xs sm:text-sm tracking-wide uppercase">
            LƯU Ý PHÁP LÝ &amp; MIỄN TRỪ TRÁCH NHIỆM:
          </h3>
          <p className="text-neutral-200/95 text-xs sm:text-sm leading-relaxed">
            Trang này ghi nhận phản ánh và tài liệu do người đăng cung cấp về một tranh chấp tiền công cá nhân.
            Nội dung không thay thế kết luận của cơ quan nhà nước có thẩm quyền. Doanh nghiệp có quyền gửi phản hồi,
            tài liệu đối chứng hoặc yêu cầu đính chính; phản hồi phù hợp sẽ được cập nhật.
          </p>
        </div>
      </div>
    </aside>
  );
}
