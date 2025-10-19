"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { getMe } from "@/store/slices/authSlice";

export default function ProtectedRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (!user) {
      dispatch(getMe());
    }
  }, [token, user, router, dispatch]);

  if (!token || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return children;
}
