import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center mt-10">
            <h2 className="text-2xl font-semibold">Login</h2>
            <Link
                href="http://localhost:8000/api/auth/google"
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded bg-white cursor-pointer mt-5 text-base hover:bg-gray-50 transition"
            >
                <Image src="/icons/google.png" alt="Google Icon" width={20} height={20} />
                <span className="text-gray-800">Sign in with Google</span>
            </Link>
        </div>
    );
}
