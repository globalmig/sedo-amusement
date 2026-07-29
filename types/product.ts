export interface Product {
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
