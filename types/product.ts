export type ProductType = "all" | "new" | "hit" | "recommend";

export interface Product {
  id: number;
  name: string;
  category: string | null;
  // 표시용 카테고리 이름. categories 테이블과 조인해 lib/products.ts에서 붙여준다 (DB 원본 컬럼 아님)
  category_name?: string | null;
  product_type: ProductType | null;
  rating_number: string | null;
  spec: string | null;
  features: string | null;
  price: number | null;
  main_image_url: string | null;
  detail_images: string[] | null;
  youtube_url: string | null;
  // display_order: 카테고리 안에서의 순서, type_order: 분류(신제품/히트/추천) 안에서의 순서
  display_order: number | null;
  type_order: number | null;
  created_at: string;
}
