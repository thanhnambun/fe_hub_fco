import { GlassCard } from "@/components/base/glass-card";

const features = [
  {
    title: "Phân tích cầu thủ",
    description: "Theo dõi form, chỉ số ẩn, và xu hướng giá của từng thẻ cầu thủ theo thời gian thực.",
  },
  {
    title: "Xây dựng đội hình",
    description: "Xây đội hình tối ưu chemistry, cấp lương, và tactical role theo từng meta rank.",
  },
  {
    title: "Đánh giá",
    description: "Tổng hợp review chất lượng cao từ cộng đồng, đánh giá trên từng vị trí và gameplay.",
  },
  {
    title: "Thị trường",
    description: "Bộ lọc account và card giao dịch thông minh, cảnh báo biến động giá BP và cơ hội.",
  },
];

export function FeatureGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature) => (
        <GlassCard key={feature.title} className="p-5">
          <h3 className="fco-heading text-xl font-semibold text-white">{feature.title}</h3>
          <p className="mt-3 text-sm leading-6 text-white/75">{feature.description}</p>
        </GlassCard>
      ))}
    </section>
  );
}
