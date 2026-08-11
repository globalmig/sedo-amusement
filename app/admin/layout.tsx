import type { Metadata } from "next";
import AdminSideMenu from "@/components/common/AdminSideMenu";
import AdminHeader from "@/components/common/AdminHeader";

export const metadata: Metadata = {
    title: "관리자 페이지",
    robots: { index: false, follow: false },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AdminHeader />
            <div className="flex">
                <AdminSideMenu />
                <div className="w-full min-h-screen overflow-auto">
                    <div className="w-full max-w-350 p-20 mx-auto my-0">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
