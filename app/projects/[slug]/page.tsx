// app/projects/[slug]/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import Link from "next/link";

import PageHeader from "../../components/PageHeader";
import GiscusComments from "../../components/GiscusComments"; // <-- Import here!

// Import CSS for math and PrismJS syntax highlighting
import "katex/dist/katex.min.css";
import "../../prism-code-theme.css";

interface PostPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function PostPage({
  params,
  searchParams,
}: PostPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = pageParam || "1";

  const fullPath = path.join(process.cwd(), "content/projects", `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(content);

  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen">
      <PageHeader title={data.title} subtitle={data.excerpt} />
      <div
        className="max-w-4xl mx-auto px-6 py-8"
        style={{ maxWidth: "4xl", paddingLeft: "24px", paddingRight: "24px" }}
      >
        <article className="prose dark:prose-dark" style={{ maxWidth: "100%" }}>
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
        <div className="mt-8">
          <Link
            href={`/projects?page=${currentPage}`}
            className="text-xl text-gray-500 underline px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between transition-transform duration-300 ease-in-out hover:scale-110"
          >
            ← Back to all posts
          </Link>
        </div>

        {/* Add Giscus comments below the post content */}
        <GiscusComments />
      </div>
    </div>
  );
}
