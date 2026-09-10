export const SEO_KEYWORDS = [
  'review đậu food',
  'đánh giá đậu food',
  'công ty tnhh đậu food',
  'tranh chấp tiền công đậu food',
  'đậu food 296 võ thành trang',
  'trải nghiệm làm việc đậu food',
  'bảo vệ người lao động part-time',
];

export function SeoKeywordsBar() {
  return (
    <div
      id="seo-keywords-container"
      className="w-full bg-[#202227] rounded-2xl p-4 sm:p-5 border border-neutral-700/60 shadow-lg shadow-black/15 transition-shadow duration-200"
    >
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <span className="text-white font-bold text-sm tracking-wide mr-1 shrink-0">
          Từ khóa SEO:
        </span>
        {SEO_KEYWORDS.map((keyword) => (
          <span
            key={keyword}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-normal text-neutral-300 bg-[#2b2d35] border border-neutral-600/60 hover:border-neutral-400 hover:text-white transition-colors duration-150 cursor-default"
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}
