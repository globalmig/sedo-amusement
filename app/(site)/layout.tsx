import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Header />
            {children}
            <Footer />
            <ScrollToTopButton />
            {/* <FloatingCallButton /> */}
        </>
    );
}
