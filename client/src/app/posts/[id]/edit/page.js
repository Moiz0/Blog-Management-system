"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  updatePost,
  clearCurrentPost,
} from "@/store/slices/postsSlice";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RichTextEditor from "@/components/RichTextEditor";

function EditPostContent({ params }) {
  const { id } = React.use(params);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { currentPost, loading, error } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchPostById(id));
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPost) {
      if (user && currentPost.author?._id !== user.id) {
        router.push(`/posts/${id}`);
        return;
      }
      setFormData({
        title: currentPost.title,
        content: currentPost.content,
      });
    }
  }, [currentPost, user, router, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updatePost({ id: params.id, postData: formData })
      ).unwrap();
      router.push(`/posts/${params.id}`);
    } catch (error) {
      console.error("Update post failed:", error);
    }
  };

  if (!currentPost) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Post</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Content
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Post"}
              </button>
              <button
                type="button"
                onClick={() => router.push(`/posts/${params.id}`)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default function EditPostPage({ params }) {
  return (
    <ProtectedRoute>
      <EditPostContent params={params} />
    </ProtectedRoute>
  );
}
