// app/page.tsx
import Link from "next/link";
import React from "react";
import PageHeader from "./components/PageHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PageHeader title="Hi there!" subtitle=""></PageHeader>
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Cheatsheet and Questions</h2>
        <Link href="/blog" className="text-blue-500 hover:underline">
          Cheatsheet and Questions for LLM
        </Link>
      </section>

      {/* Rest of your About page content goes here */}
    </div>
  );
}
