import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryBanner from "@/components/common/CategoryBanner";
import ProductGalley from "@/components/board/ProductGalley";
import { USER_CATEGORY } from "@/datas/categories";
import { getProducts } from "@/lib/products";

interface ProductListPageProps {
  params: Promise<{ categories: string }>;
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  crane: "높은 가동률과 매장 수익을 책임지는 필수 인형뽑기·경품기입니다.",
  shooting: "뛰어난 몰입감과 화려한 연출의 1인·다인용 사격을 즐길 수 있습니다.",
  rhythm: "매니아층 형성과 높은 재방문율을 끌어내는 체감형 리듬 장비입니다.",
  racing: "실감 나는 체감 효과와 다이나믹한 스피드를 선사합니다.",
  casual: "남녀노소 누구나 쉽고 재미있게 즐기는 가벼운 미니게임을 즐길 수 있습니다.",
  sports: "농구·축구·펀치 등 매장의 활력을 더하는 체력형 스포츠 장비입니다.",
  video: "정통 아케이드 오락실의 재미를 그대로 담은 비디오 캐비닛입니다.",
  attraction: "어린이와 가족 단위 고객의 시선을 사로잡는 대형 탑승형 기기입니다.",
  facility: "고품질 음향 시스템과 인테리어를 갖춘 부스형을 제공합니다.",
  exchange: "원활한 매장 운영을 위한 교환 기기입니다."
};

export async function generateMetadata({ params }: ProductListPageProps): Promise<Metadata> {
  const { categories } = await params;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);

  if (!category) return {};

  return {
    title: category.name,
    description: `세도어뮤즈먼트가 정품으로 공급하는 ${category.name} 라인업을 확인하세요.`,
  };
}

export default async function ProductListPage({ params }: ProductListPageProps) {
  const { categories } = await params;
  const category = USER_CATEGORY.products.categories?.find((c) => c.url === categories);

  if (!category) notFound();

  const products = await getProducts(categories);

  return (
    <>
      <CategoryBanner
        title={category.name}
        description={
          CATEGORY_DESCRIPTIONS[category.url] ||
          "세도어뮤즈먼트가 정품으로 공급하는 검증된 기종만 소개합니다."
        }
        tabs={USER_CATEGORY.products.categories}
        basePath="/products"
        activeUrl={categories}
      />
      <article>
        <div className="mx-auto max-w-300 px-[5%] py-12 pc:px-0 pc:py-16">
          <ProductGalley products={products} />
        </div>
      </article>
    </>
  );
}
