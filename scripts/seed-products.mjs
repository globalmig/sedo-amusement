// 카테고리별 데모 상품 5개씩(총 35개) 시드 스크립트
// 실행: node --env-file=.env scripts/seed-products.mjs
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

const PRODUCTS = [
    // 크레인/경품 게임기
    { category: "crane", name: "빅클로 프리미엄 크레인 게임기", spec: "900 x 900 x 2050mm, 220V, 180kg", features: "대형 인형/피규어 경품에 최적화된 강력 그립 클로 탑재", price: 4200000 },
    { category: "crane", name: "미니 테디베어 크레인", spec: "700 x 700 x 1850mm, 220V, 120kg", features: "키즈카페용 소형 사이즈, 낮은 난이도 설정 가능", price: 2800000 },
    { category: "crane", name: "더블 프라이즈 크레인 게임기", spec: "1200 x 900 x 2100mm, 220V, 230kg", features: "2인 동시 플레이 가능한 듀얼 클로 시스템", price: 5600000 },
    { category: "crane", name: "스카이 크레인 XL", spec: "1000 x 1000 x 2200mm, 220V, 210kg", features: "대용량 경품칸, LED 무드조명 내장", price: 4900000 },
    { category: "crane", name: "코인 푸셔 크레인 콤보", spec: "1100 x 950 x 2050mm, 220V, 250kg", features: "크레인과 코인푸셔가 결합된 복합형 기기", price: 6100000 },

    // 슈팅게임
    { category: "shooting", name: "갤럭시 스나이퍼", spec: "1100 x 1000 x 2000mm, 220V, 190kg", features: "우주 테마 슈팅, 4인 동시 플레이 지원", price: 5300000 },
    { category: "shooting", name: "좀비 스트라이크 듀얼", spec: "1200 x 1000 x 2100mm, 220V, 210kg", features: "듀얼 건 컨트롤러, 진동 피드백 지원", price: 5800000 },
    { category: "shooting", name: "웨스턴 건파이터", spec: "1000 x 900 x 1950mm, 220V, 170kg", features: "레트로 서부극 테마, 티켓 배출 기능 탑재", price: 4700000 },
    { category: "shooting", name: "에일리언 인베이전 DX", spec: "1300 x 1100 x 2150mm, 220V, 240kg", features: "55인치 대형 스크린, 서라운드 사운드", price: 6900000 },
    { category: "shooting", name: "타겟 마스터 아케이드", spec: "950 x 850 x 1900mm, 220V, 150kg", features: "난이도 조절 가능, 소형 매장 최적화", price: 3900000 },

    // 리듬게임
    { category: "rhythm", name: "비트 스매셔 프로", spec: "1000 x 1000 x 2200mm, 220V, 200kg", features: "터치 감응 패드, 다양한 최신곡 업데이트 지원", price: 6200000 },
    { category: "rhythm", name: "댄스 프리미엄 4", spec: "1500 x 1500 x 2300mm, 220V, 320kg", features: "듀얼 댄스 플랫폼, 스텝 인식 센서 탑재", price: 8900000 },
    { category: "rhythm", name: "드럼 매니아 아케이드", spec: "1100 x 900 x 2000mm, 220V, 180kg", features: "실제 드럼 타격감 재현, 헤드폰 잭 지원", price: 5400000 },
    { category: "rhythm", name: "펌프 잇 업 리마스터", spec: "1400 x 1400 x 2250mm, 220V, 300kg", features: "5버튼 스텝존, 대회 표준 규격", price: 8300000 },
    { category: "rhythm", name: "리듬 스타 터치", spec: "900 x 850 x 1900mm, 220V, 140kg", features: "터치스크린 기반 캐주얼 리듬게임, 회전율 우수", price: 3600000 },

    // 레이싱게임
    { category: "racing", name: "스피드 러시 GT", spec: "1600 x 900 x 1800mm, 220V, 280kg", features: "포스피드백 스티어링 휠, 서라운드 스피커", price: 7500000 },
    { category: "racing", name: "드리프트 마스터 DX", spec: "1550 x 950 x 1850mm, 220V, 270kg", features: "모션 시뮬레이션 시트, 실감형 진동 시스템", price: 8100000 },
    { category: "racing", name: "카트 챔피언십 듀얼", spec: "2200 x 1000 x 1900mm, 220V, 400kg", features: "2인용 나란히 배치, 대전 모드 지원", price: 10200000 },
    { category: "racing", name: "모터바이크 그랑프리", spec: "900 x 1400 x 1700mm, 220V, 220kg", features: "실제 오토바이 형태 라이딩 콕핏", price: 6800000 },
    { category: "racing", name: "터보 레이서 디럭스", spec: "1500 x 900 x 1800mm, 220V, 260kg", features: "42인치 커브드 모니터, 랭킹 시스템 지원", price: 7200000 },

    // 캐주얼게임
    { category: "casual", name: "두더지 잡기 디럭스", spec: "1000 x 1000 x 1300mm, 220V, 150kg", features: "6구멍 랜덤 팝업, 티켓 배출 기능", price: 3200000 },
    { category: "casual", name: "에어하키 챔피언", spec: "2100 x 1000 x 850mm, 220V, 180kg", features: "저마찰 테이블, LED 스코어보드 내장", price: 3800000 },
    { category: "casual", name: "볼링 매니아", spec: "4200 x 900 x 700mm, 220V, 350kg", features: "미니 볼링 레인, 자동 핀 리셋", price: 5900000 },
    { category: "casual", name: "포토부스 캐주얼", spec: "1000 x 1000 x 2000mm, 220V, 160kg", features: "즉석 인화 프린터 내장, 다양한 프레임 제공", price: 4500000 },
    { category: "casual", name: "클로우 펀치 게임", spec: "900 x 900 x 2400mm, 220V, 190kg", features: "펀치력 측정, 랭킹 경쟁 기능", price: 3400000 },

    // 스포츠게임
    { category: "sports", name: "아케이드 농구 챌린지", spec: "1200 x 3600 x 3000mm, 220V, 400kg", features: "듀얼 골대, 실시간 슛 카운터", price: 6600000 },
    { category: "sports", name: "스크린 골프 프로", spec: "3000 x 5000 x 2800mm, 220V, 500kg", features: "고정밀 스윙 센서, 실제 코스 시뮬레이션", price: 15000000 },
    { category: "sports", name: "테이블 사커 듀얼", spec: "1400 x 750 x 900mm, 220V, 90kg", features: "코인 투입식, 4인 동시 플레이 가능", price: 2100000 },
    { category: "sports", name: "펀치 킹 스트렝스 테스터", spec: "700 x 700 x 2400mm, 220V, 200kg", features: "펀치력 측정 및 티켓 배출", price: 3300000 },
    { category: "sports", name: "야구 피칭 챌린지", spec: "1000 x 2000 x 2200mm, 220V, 230kg", features: "구속 측정 센서, 다양한 난이도 모드", price: 4800000 },

    // 비디오게임
    { category: "video", name: "레트로 아케이드 캐비닛", spec: "700 x 800 x 1800mm, 220V, 110kg", features: "고전 게임 다수 내장, 조이스틱 컨트롤러", price: 2900000 },
    { category: "video", name: "격투게임 스테이션 DX", spec: "1000 x 900 x 1900mm, 220V, 170kg", features: "2인 대전 전용, 아케이드 스틱 커스터마이징 지원", price: 4600000 },
    { category: "video", name: "판타지 어드벤처 콘솔", spec: "900 x 850 x 1850mm, 220V, 150kg", features: "스토리 기반 어드벤처, 세이브 카드 지원", price: 4100000 },
    { category: "video", name: "퍼즐 마스터 아케이드", spec: "800 x 800 x 1800mm, 220V, 130kg", features: "다양한 퍼즐 모드, 초보자 친화적 UI", price: 3300000 },
    { category: "video", name: "슈퍼 콤보 파이터", spec: "1050 x 900 x 1900mm, 220V, 175kg", features: "온라인 랭킹 연동, 리플레이 저장 기능", price: 4800000 },
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
        price: p.price,
        main_image_url: mainImageUrl,
        detail_images: [],
    }));

    const { data, error } = await supabase.from("demo").insert(rows).select();

    if (error) throw new Error(`상품 등록 실패: ${error.message}`);

    console.log(`${data.length}개 상품이 등록되었습니다.`);
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});
