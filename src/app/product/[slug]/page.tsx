/* eslint-disable @next/next/no-img-element */

import { redirect, notFound } from "next/navigation";
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

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const STOREFRONT_BASE =
  process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3000";

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const res = await fetch(`${BASE_URL}/products/slug/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }

  const data: ApiResponse = await res.json();

  if (data.redirect && data.newSlug) {
    redirect(`/product/${data.newSlug}`);
  }

  if (!data.product) {
    notFound();
  }

  const product = data.product;
  const meta = data.meta;

  const publicUrl = `${STOREFRONT_BASE}/product/${meta?.slug ?? slug}`;

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
        {product.images && product.images.length > 0 && (
          <div style={{ display: "flex", gap: "2px" }}>
            {product.images.slice(0, 3).map((img, index) => (
              <img
                key={index}
                src={img}
                alt={product.productName}
                style={{
                  flex: 1,
                  height: "220px",
                  objectFit: "cover",
                }}
              />
            ))}
          </div>
        )}

        <div style={{ padding: "20px" }}>
          <h1>{product.productName}</h1>

          <h4>₹{Number(product.price).toLocaleString("en-IN")}</h4>

          <p>{product.shortDescription}</p>

          <div
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />

          <hr />

          <p>
            <strong>Category:</strong>{" "}
            {product.category?.name ?? "-"}
          </p>

          <p>
            <strong>Stock:</strong> {product.quantity}
          </p>

          <p>
            <strong>URL:</strong> {publicUrl}
          </p>
        </div>
      </div>
    </main>
  );
}