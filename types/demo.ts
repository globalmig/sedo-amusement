// Supabase "demo" 테이블 행 타입
export interface DemoProduct {
  id: number;
  name: string;
  category: string | null;
  spec: string | null;
  features: string | null;
  price: number | null;
  main_image_url: string | null;
  detail_images: string[] | null;
  created_at: string;
}
