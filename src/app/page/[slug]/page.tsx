"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/services/baseUrl";

type PageType = {
  title: string;
  description: string;
};

export default function CmsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState<PageType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${BASE_URL}/page/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPage(data);
      } catch {
        setPage(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) return <p className="p-5">Loading...</p>;
  if (!page) return <p className="p-5">Page not found</p>;

  return (
    <main className="container py-5">
      <h1 className="mb-4">{page.title}</h1>

      {/* HTML from CMS */}
      <div
        dangerouslySetInnerHTML={{ __html: page.description }}
      />
    </main>
  );
}
