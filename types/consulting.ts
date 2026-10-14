export interface ConsultingArea {
  id: number;
  title: string;
  subtitle: string;
  points: string[];
  sort_order: number;
  created_at: string;
}

export interface ConsultingStep {
  id: number;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
}
