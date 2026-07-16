import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import FloatingCallButton from "@/components/common/FloatingCallButton";

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
            <FloatingCallButton />
        </>
    );
}
