"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
    variant?: "outline" | "ghost";
    size?: "sm" | "default" | "lg";
    className?: string;
}

export function LogoutButton({ variant = "outline", size = "sm", className }: LogoutButtonProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <Button
            onClick={handleLogout}
            variant={variant}
            size={size}
            className={className}
        >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
    );
}

export function LogoutButtonIcon({ className }: { className?: string }) {
    const router = useRouter();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className={className}
        >
            <LogOut className="h-4 w-4" />
        </Button>
    );
}

