import { supabaseAdmin } from "./supabaseAdmin";

// 번호가 겹치는 경우, 그 번호 이후 제품들을 한 칸씩 뒤로 밀어서 자리를 만든다.
async function shiftUp(ids: number[]) {
    if (ids.length === 0) return;
    const { data: rows } = await supabaseAdmin
        .from("products")
        .select("id, display_order")
        .in("id", ids);

    await Promise.all(
        (rows ?? []).map((row) =>
            supabaseAdmin
                .from("products")
                .update({ display_order: (row.display_order ?? 0) + 1 })
                .eq("id", row.id)
        )
    );
}

// 번호가 당겨지는 경우, 그 사이 제품들을 한 칸씩 앞으로 당긴다.
async function shiftDown(ids: number[]) {
    if (ids.length === 0) return;
    const { data: rows } = await supabaseAdmin
        .from("products")
        .select("id, display_order")
        .in("id", ids);

    await Promise.all(
        (rows ?? []).map((row) =>
            supabaseAdmin
                .from("products")
                .update({ display_order: (row.display_order ?? 1) - 1 })
                .eq("id", row.id)
        )
    );
}

// 신규 등록 시 지정한 순서 번호에 다른 제품이 이미 있다면, 그 제품들을 한 칸씩 뒤로 밀어 자리를 만든다.
export async function makeRoomForNewOrder(newOrder: number) {
    const { data: toShift } = await supabaseAdmin
        .from("products")
        .select("id")
        .gte("display_order", newOrder);

    await shiftUp((toShift ?? []).map((row) => row.id));
}

// 기존 제품의 순서 번호를 다른 값으로 바꿀 때, 그 사이에 있던 제품들의 번호를 한 칸씩 당기거나 밀어준다.
export async function reorderForMove(productId: number, oldOrder: number | null, newOrder: number) {
    if (oldOrder === newOrder) return;

    if (oldOrder === null) {
        const { data: toShift } = await supabaseAdmin
            .from("products")
            .select("id")
            .gte("display_order", newOrder)
            .neq("id", productId);
        await shiftUp((toShift ?? []).map((row) => row.id));
        return;
    }

    if (newOrder > oldOrder) {
        // 뒤로 이동: 그 사이 제품들은 한 칸씩 앞으로 당겨진다.
        const { data: toShift } = await supabaseAdmin
            .from("products")
            .select("id")
            .gt("display_order", oldOrder)
            .lte("display_order", newOrder)
            .neq("id", productId);
        await shiftDown((toShift ?? []).map((row) => row.id));
    } else {
        // 앞으로 이동: 그 사이 제품들은 한 칸씩 뒤로 밀린다.
        const { data: toShift } = await supabaseAdmin
            .from("products")
            .select("id")
            .gte("display_order", newOrder)
            .lt("display_order", oldOrder)
            .neq("id", productId);
        await shiftUp((toShift ?? []).map((row) => row.id));
    }
}
