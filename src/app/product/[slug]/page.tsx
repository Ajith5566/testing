/* eslint-disable @next/next/no-img-element */
// app/product/[slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/services/baseUrl";

type ProductType = {
  productName: string;
  shortDescription: string;
  description: string;
  price: string;
  quantity: string;
  images?: string[];
  isActive?: boolean;
  category?: { name: string };
};

type MetaType = {
  slug: string;
  meta_title?: string;
  meta_description?: string;
};

type ApiResponse = {
  product?: ProductType;
  meta?: MetaType;
  redirect?: boolean;
  newSlug?: string;
};

const STOREFRONT_BASE =
  process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "https://yourstore.com";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductType | null>(null);
  const [meta, setMeta] = useState<MetaType | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      // reset loading — matters when redirect changes the slug and refetches
      setLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/products/slug/${slug}`);

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data: ApiResponse = await res.json();

        // old slug — redirect to the current URL
        if (data.redirect && data.newSlug) {
          router.replace(`/product/${data.newSlug}`);
          return; // keep spinner on; slug change re-runs this effect
        }

        setProduct(data.product ?? null);
        setMeta(data.meta ?? null);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setProduct(null);
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, router]);

  // always copy the CURRENT slug, even if visitor arrived via an old link
  const publicUrl = `${STOREFRONT_BASE}/product/${meta?.slug ?? slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for browsers that block the clipboard API
      const input = document.createElement("input");
      input.value = publicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="container py-5">
        <div className="d-flex align-items-center gap-3 text-muted">
          <div
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-5">
        <div className="alert alert-warning" role="alert">
          Product not found.
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div
        style={{
          background: "#fff",
          border: "0.5px solid #e8e8e5",
          borderRadius: "12px",
          overflow: "hidden",
          maxWidth: "760px",
        }}
      >
        {/* Images */}
        {product.images && product.images.length > 0 && (
          <div style={{ display: "flex", gap: "2px", background: "#f6f6f4" }}>
            {product.images.slice(0, 3).map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${product.productName} image ${i + 1}`}
                style={{
                  flex: 1,
                  height: "220px",
                  objectFit: "cover",
                  display: "block",
                  minWidth: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Header row: name + price */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 500,
                margin: 0,
                color: "#1a1a18",
              }}
            >
              {product.productName}
            </h1>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 500,
                margin: 0,
                color: "#1a1a18",
                whiteSpace: "nowrap",
              }}
            >
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "0.5px solid #e8e8e5",
              margin: "0 0 12px",
            }}
          />

          {/* Detail rows */}
          {[
            { label: "Category", value: product.category?.name ?? "—" },
            { label: "In stock", value: `${product.quantity} units` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
              }}
            >
              <span style={{ fontSize: "13px", color: "#8a8a84" }}>
                {label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#1a1a18",
                }}
              >
                {value}
              </span>
            </div>
          ))}

          {/* Short description */}
          <p
            style={{
              fontSize: "14px",
              color: "#4a4a45",
              lineHeight: 1.6,
              marginTop: "14px",
              marginBottom: "14px",
            }}
          >
            {product.shortDescription}
          </p>

          {/* Full description — HTML from admin editor */}
          <div
            style={{ fontSize: "14px", lineHeight: 1.7, color: "#4a4a45" }}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Footer — copy link */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "0.5px solid #e8e8e5",
            background: "#f6f6f4",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: "#8a8a84",
              fontFamily: "monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
              minWidth: 0,
            }}
          >
            {publicUrl}
          </span>

          <button
            onClick={handleCopy}
            aria-label="Copy product link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "0.5px solid #d5d5d0",
              background: copied ? "#eaf3de" : "#fff",
              color: copied ? "#3b6d11" : "#1a1a18",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background 0.15s ease, color 0.15s ease",
            }}
          >
            {copied ? (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2v1" />
                </svg>
                Copy link
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}