import { FaqCategoryKey } from "@/datas/faq";

export interface FaqItem {
  id: number;
  category: FaqCategoryKey;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
}
