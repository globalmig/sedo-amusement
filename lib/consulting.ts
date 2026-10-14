import { supabaseAdmin } from "./supabaseAdmin";
import { ConsultingArea, ConsultingStep } from "@/types/consulting";

// 공개 사이트(/consulting)에서 사용하는 조회 헬퍼
export async function getConsultingAreas(): Promise<ConsultingArea[]> {
    const { data, error } = await supabaseAdmin
        .from("consulting_areas")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("컨설팅 분야 조회 실패:", error.message);
        return [];
    }

    return data ?? [];
}

export async function getConsultingSteps(): Promise<ConsultingStep[]> {
    const { data, error } = await supabaseAdmin
        .from("consulting_steps")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("컨설팅 절차 조회 실패:", error.message);
        return [];
    }

    return data ?? [];
}
