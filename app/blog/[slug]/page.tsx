// app/blog/[slug]/page.tsx
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
import GiscusComments from "../../components/GiscusComments";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  // await the incoming promises before using them
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = pageParam || "1";

  const fullPath = path.join(process.cwd(), "content/blog", `${slug}.md`);
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mt-8">
          <Link
            href={`/blog?page=${currentPage}`}
            className="text-xl text-gray-500 underline px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between transition-transform duration-300 ease-in-out hover:scale-110"
          >
            ← Back to all posts
          </Link>
        </div>

        <article className="prose dark:prose-dark max-w-full overflow-x-auto break-words">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>

        <div className="mt-8">
          <Link
            href={`/blog?page=${currentPage}`}
            className="text-xl text-gray-500 underline px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between transition-transform duration-300 ease-in-out hover:scale-110"
          >
            ← Back to all posts
          </Link>
        </div>

        <GiscusComments />
      </div>
    </div>
  );
}
