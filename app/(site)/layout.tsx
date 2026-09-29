import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";
import Link from "next/link";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Link
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
            >
                본문 바로가기
            </Link>
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
            <ScrollToTopButton />
        </>
    );
}
