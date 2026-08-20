"use client";
import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSideMenu from "./AdminSideMenu";

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <>
            <AdminHeader onMenuClick={() => setMobileNavOpen((prev) => !prev)} />
            <div className="flex">
                <AdminSideMenu open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
                <div className="w-full min-h-screen overflow-auto">
                    <div className="w-full max-w-350 p-4 pc:p-20 mx-auto my-0">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
