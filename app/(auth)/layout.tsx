import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-[84vh] items-center justify-center px-4">
            {children}
        </div>
    );
}
