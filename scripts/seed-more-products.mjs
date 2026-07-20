// 페이지네이션 테스트용 추가 시드 (카테고리별 6~10개가 되도록 보충, 가격은 비워둠)
// 실행: node --env-file=.env scripts/seed-more-products.mjs
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUCKET = "demo-images";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables. node --env-file=.env 로 실행해주세요.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// 기존 5개 + 아래 목록 = 크레인 8 / 슈팅 10 / 리듬 6 / 레이싱 9 / 캐주얼 7 / 스포츠 10 / 비디오 6
const PRODUCTS = [
    { category: "crane", name: "트리플 클로 마스터", spec: "1000 x 950 x 2100mm, 220V, 220kg", features: "클로 3개 동시 작동으로 대형 경품도 안정적으로 집게 가능" },
    { category: "crane", name: "프라이즈 박스 크레인", spec: "900 x 900 x 2000mm, 220V, 170kg", features: "투명 경품박스로 진열 효과 극대화" },
    { category: "crane", name: "코너 크레인 미니", spec: "650 x 650 x 1800mm, 220V, 100kg", features: "매장 코너 자투리 공간 활용에 최적화된 소형 사이즈" },

    { category: "shooting", name: "스페이스 커맨더", spec: "1150 x 1000 x 2050mm, 220V, 195kg", features: "우주선 콕핏 디자인, 몰입감 있는 진동 시트" },
    { category: "shooting", name: "던전 슈터 아케이드", spec: "1050 x 950 x 2000mm, 220V, 180kg", features: "판타지 던전 테마, 콤보 점수 시스템" },
    { category: "shooting", name: "좀비 아포칼립스 DX", spec: "1250 x 1050 x 2150mm, 220V, 230kg", features: "4인 협동 플레이, 대형 서라운드 스피커" },
    { category: "shooting", name: "스나이퍼 엘리트 아케이드", spec: "1000 x 900 x 1950mm, 220V, 175kg", features: "정밀 조준 센서, 슬로우모션 이펙트 연출" },
    { category: "shooting", name: "캡틴 배틀 슈팅", spec: "1100 x 950 x 2000mm, 220V, 185kg", features: "티켓 배출형, 난이도 단계별 선택 가능" },

    { category: "rhythm", name: "리듬 아레나 프로", spec: "1050 x 1000 x 2200mm, 220V, 210kg", features: "대회 표준 규격 터치 패드, 랭킹 시스템 지원" },

    { category: "racing", name: "나이트로 챔피언", spec: "1550 x 900 x 1850mm, 220V, 260kg", features: "부스터 니트로 기능, 실감형 핸들 진동" },
    { category: "racing", name: "서킷 마스터 DX", spec: "1600 x 950 x 1900mm, 220V, 290kg", features: "실제 서킷 코스 다수 수록, 랭킹 저장 기능" },
    { category: "racing", name: "익스트림 드리프트", spec: "1500 x 900 x 1800mm, 220V, 250kg", features: "드리프트 전용 튜닝 모드, 스코어 경쟁 시스템" },
    { category: "racing", name: "레이싱 그랑프리 듀얼", spec: "2200 x 1000 x 1900mm, 220V, 410kg", features: "2인용 나란히 배치, 실시간 순위 표시" },

    { category: "casual", name: "두더지 챔피언 DX", spec: "1050 x 1050 x 1350mm, 220V, 160kg", features: "8구멍 확장형, 난이도별 속도 조절" },
    { category: "casual", name: "사격왕 캐주얼", spec: "1000 x 900 x 1900mm, 220V, 150kg", features: "적외선 타겟 사격, 온가족 이용 가능" },

    { category: "sports", name: "아이스하키 아케이드", spec: "2400 x 1200 x 850mm, 220V, 260kg", features: "에어쿠션 테이블, LED 스코어보드" },
    { category: "sports", name: "다트 챔피언", spec: "700 x 700 x 1900mm, 220V, 90kg", features: "전자 다트보드, 자동 점수 계산" },
    { category: "sports", name: "배팅 챌린지 프로", spec: "1200 x 2200 x 2300mm, 220V, 240kg", features: "타구 속도 측정, 다양한 난이도 모드" },
    { category: "sports", name: "농구 슈터 DX", spec: "1200 x 3600 x 3000mm, 220V, 410kg", features: "듀얼 골대, 타임어택 모드 지원" },
    { category: "sports", name: "태권 파워 테스터", spec: "700 x 700 x 2300mm, 220V, 195kg", features: "타격 파워 측정 및 랭킹 경쟁" },

    { category: "video", name: "아케이드 캐비닛 리마스터", spec: "700 x 800 x 1800mm, 220V, 115kg", features: "레트로 클래식 게임 다수 내장, 리마스터 그래픽" },
];

async function uploadSampleImage() {
    const filePath = path.join(__dirname, "..", "public", "images", "sample.jpg");
    const fileBuffer = await readFile(filePath);
    const storagePath = `main/${Date.now()}_sample.jpg`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, { contentType: "image/jpeg", upsert: false });

    if (error) throw new Error(`샘플 이미지 업로드 실패: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
}

async function main() {
    console.log("샘플 대표이미지 업로드 중...");
    const mainImageUrl = await uploadSampleImage();
    console.log("업로드 완료:", mainImageUrl);

    const rows = PRODUCTS.map((p) => ({
        name: p.name,
        category: p.category,
        spec: p.spec,
        features: p.features,
        price: null,
        main_image_url: mainImageUrl,
        detail_images: [],
    }));

    const { data, error } = await supabase.from("demo").insert(rows).select();

    if (error) throw new Error(`상품 등록 실패: ${error.message}`);

    console.log(`${data.length}개 상품이 추가 등록되었습니다.`);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
