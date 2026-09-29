import type { MetadataRoute } from "next";
import { SITE_URL } from "@/datas/site";
import { USER_CATEGORY } from "@/datas/categories";
import { getProducts } from "@/lib/products";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
        ...(USER_CATEGORY.company.categories ?? []).map((c) => ({
            url: `${SITE_URL}/company/${c.url}`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        })),
        ...(USER_CATEGORY.products.categories ?? []).map((c) => ({
            url: `${SITE_URL}/products/${c.url}`,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        })),
        { url: `${SITE_URL}/consulting`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${SITE_URL}/as`, changeFrequency: "monthly", priority: 0.8 },
        { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
        { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    ];

    const products = await getProducts();
    const productPages: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${SITE_URL}/products/all/${product.id}`,
        lastModified: product.created_at,
        changeFrequency: "monthly",
        priority: 0.7,
        images: product.main_image_url ? [product.main_image_url] : undefined,
    }));

    return [...staticPages, ...productPages];
}
