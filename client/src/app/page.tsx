

"use client";


import api from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";


type UserProfile = {
  name: string;
  email: string;
  avatar?: string;
};

async function fetchUserProfile(): Promise<UserProfile> {
  const res = await api.get("/api/auth/me");
  return res.data.user;
}


export default function HomePage() {
  const { data: user, isLoading, isError, refetch } = useQuery<UserProfile>({
    queryKey: ["me"],
    queryFn: fetchUserProfile,
    retry: false,
  });
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await api.post("/api/auth/logout");
      window.location.reload();
    } catch (e) {
      // Optionally show error
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="bg-white rounded-xl shadow p-6 flex items-center max-w-lg w-full">
        {isLoading ? (
          <p>Loading profile…</p>
        ) : isError ? (
          <p className="text-red-500">Not logged in</p>
        ) : user ? (
          <>
            <Image
              src={user?.avatar || "/icons/google.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover mr-6"
              width={64}
              height={64}
            />
            <div className="flex flex-col justify-center">
              <span className="font-semibold text-lg text-taupe-900">{user.name}</span>
            
              <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-500 w-fit">{user.email}</span>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="mt-3 px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded shadow disabled:opacity-60 w-fit text-sm"
              >
                {logoutLoading ? "Logging out…" : "Logout"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
