"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CallbackPage() {
    const router = useRouter();
    const handled = useRef(false); // Prevent double-processing in StrictMode

    useEffect(() => {
        if (handled.current) return;
        handled.current = true;

        // The backend has already set both refresh_token and access_token HttpOnly cookies.
        // We can safely redirect the user to the dashboard.
        router.replace("/");
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 text-sm">Signing you in…</p>
        </div>
    );
}
