"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  deletePost,
  clearCurrentPost,
} from "@/store/slices/postsSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function PostDetailPage({ params }) {
  const { id } = React.use(params);
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentPost, loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await dispatch(deletePost(id)).unwrap();
        router.push("/");
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const isOwner = user && currentPost && user.id === currentPost.author?._id;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!currentPost) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">Post not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-3">
            {currentPost.title}
          </h1>

          <div className="flex items-center justify-between text-gray-600 mb-6 pb-6 border-b">
            <div className="flex items-center justify-between text-sm text-gray-500 border-b pb-4 mb-6">
              <span>{currentPost.author?.name || "Unknown Author"}</span>
              <span>
                {new Date(currentPost.createdAt).toLocaleDateString()}
              </span>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Link
                  href={`/posts/${currentPost._id}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: currentPost.content }}
          />
        </div>
      </div>
    </>
  );
}
