import { useTranslation } from "react-i18next";
import BlogCard from "./BlogCard";

export default function BlogGrid({ blogs }) {
  const { t } = useTranslation();

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-[#71717A] text-lg font-medium mb-2">{t("blog.noPostsTitle")}</p>
        <p className="text-[#52525B] text-sm">{t("blog.noPostsBody")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.slug} blog={blog} />
      ))}
    </div>
  );
}
