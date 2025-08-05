// app/blog/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import React from "react";

const postsDirectory = path.join(process.cwd(), "content/blog");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
}

function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);
    return {
      slug,
      title: data.title || slug,
      date: data.date || "",
      excerpt: data.excerpt || "",
    };
  });

  // Sort by date descending
  posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  return posts;
}

// Helper function to group a list of posts by their year (descending by year, then descending by date)
function groupPostsByYear(posts: PostMeta[]) {
  const grouped = new Map<number, PostMeta[]>();

  for (const post of posts) {
    // Extract the year from post.date
    const year = new Date(post.date).getFullYear();
    if (!grouped.has(year)) {
      grouped.set(year, []);
    }
    grouped.get(year)?.push(post);
  }

  // Sort the posts within each year in descending order (by date).
  for (const [year, yearPosts] of grouped.entries()) {
    yearPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
  }

  // Convert Map to array sorted by descending year
  return Array.from(grouped.entries())
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Get the 'page' query param
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;

  // Fetch all posts
  const posts = getAllPosts();

  const postsPerPage = 27;

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  // Group the *current page's slice of posts* by year
  const groupedByYear = groupPostsByYear(currentPosts);

  return (
    <div className="min-h-screen">
      <PageHeader title="Cheatsheet" subtitle="All my posts" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render posts grouped by year */}
        {groupedByYear.map(({ year, posts }) => (
          <div key={year} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{year}</h2>
            <ul className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="py-6 transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <h3 className="text-2xl font-bold mb-2">
                    <Link href={`/blog/${post.slug}?page=${currentPage}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{post.date}</p>
                    <Link href={`/blog/${post.slug}?page=${currentPage}`}>
                      <span className="text-black dark:text-white hover:underline cursor-pointer">
                        See Details →
                      </span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Pagination */}
        <div className="mt-8 flex justify-center items-center gap-2 sm:gap-4">
          {currentPage > 1 && (
            <Link href={`/blog?page=${currentPage - 1}`}>
              <span className="text-xl px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between transition-transform duration-300 ease-in-out hover:scale-110">
                ← Previous
              </span>
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, index) => (
            <div
              key={index}
              className="transition-transform duration-300 ease-in-out hover:scale-150"
            >
              <Link href={`/blog?page=${index + 1}`}>
                <span
                  className={`cursor-pointer ${
                    currentPage === index + 1
                      ? "text-xl text-black dark:text-white"
                      : "text-base text-gray-500"
                  } px-2 sm:px-4`}
                >
                  {index + 1}
                </span>
              </Link>
            </div>
          ))}
          {currentPage < totalPages && (
            <Link href={`/blog?page=${currentPage + 1}`}>
              <span className="text-xl px-2 sm:px-4 py-1 sm:py-2 flex items-center justify-between transition-transform duration-300 ease-in-out hover:scale-110">
                Next →
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
