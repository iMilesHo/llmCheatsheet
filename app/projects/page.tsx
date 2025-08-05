//app/projects/page.tsx
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import React from "react";
import PageHeader from "../components/PageHeader";

const postsDirectory = path.join(process.cwd(), "content/projects");

// 1. Extend your PostMeta to include `topicOrder`.
export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  topic: string;
  topicOrder: number; // numeric field for ordering topics
}

// 2. Read and parse front matter, including `topicOrder`.
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
      topic: data.topic || "Misc",
      // Fallback to a large number if `topicOrder` not provided
      topicOrder: typeof data.topicOrder === "number" ? data.topicOrder : 9999,
    };
  });

  // (Optional) If you still want each post globally sorted by date first:
  // Sort by date descending so that when we iterate by topic, posts remain in that order.
  posts.sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

// 3. Group all the posts by topic, then sort the *topics* by `topicOrder`.
function groupPostsByTopic(posts: PostMeta[]) {
  // Map<topic, { posts: PostMeta[], topicOrder: number }>
  const grouped = new Map<string, { posts: PostMeta[]; topicOrder: number }>();

  for (const post of posts) {
    const { topic, topicOrder } = post;

    // If this topic hasn’t been seen yet, store an object with an empty array + the topicOrder
    if (!grouped.has(topic)) {
      grouped.set(topic, { posts: [], topicOrder });
    }
    // Push the post into that topic’s array
    grouped.get(topic)!.posts.push(post);

    // If multiple posts in the same topic have different `topicOrder`,
    // you could decide how to handle that. Here we’ll just stick with
    // the first encountered one. Or you could do something like:
    // grouped.get(topic)!.topicOrder = Math.min(
    //   grouped.get(topic)!.topicOrder,
    //   topicOrder
    // );
  }

  // Convert the Map to an array of { topic, topicOrder, posts[] }
  const groupedArray = Array.from(grouped.entries()).map(
    ([topic, { posts, topicOrder }]) => ({
      topic,
      topicOrder,
      posts,
    })
  );

  // Sort topics by `topicOrder` ascending
  groupedArray.sort((a, b) => a.topicOrder - b.topicOrder);

  return groupedArray;
}

// 4. Main listing page with pagination
interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  // Get the 'page' query param
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;

  // Fetch all posts
  const posts = getAllPosts();

  // Pagination
  const postsPerPage = 27;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  // Group the *current page’s slice* by topic
  const groupedByTopic = groupPostsByTopic(currentPosts);

  return (
    <div className="min-h-screen">
      <PageHeader
        title="My DSA Solutions"
        subtitle="All my data structures and algorithms solutions"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render each topic block, sorted by `topicOrder` */}
        {groupedByTopic.map(({ topic, posts }) => (
          <div key={topic} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{topic}</h2>
            <ul className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="py-6 transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <h3 className="text-2xl font-bold mb-2">
                    <Link href={`/projects/${post.slug}?page=${currentPage}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">{post.date}</p>
                    <Link href={`/projects/${post.slug}?page=${currentPage}`}>
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
            <Link href={`/projects?page=${currentPage - 1}`}>
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
              <Link href={`/projects?page=${index + 1}`}>
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
            <Link href={`/projects?page=${currentPage + 1}`}>
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
