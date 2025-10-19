"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "@/store/slices/postsSlice";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import RichTextEditor from "@/components/RichTextEditor";

function CreatePostContent() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.posts);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createPost(formData)).unwrap();
      router.push("/");
    } catch (error) {
      console.error("Create post failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Create New Post
          </h1>

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
                placeholder="Enter post title"
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
                {loading ? "Creating Post..." : "Create Post"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
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

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <CreatePostContent />
    </ProtectedRoute>
  );
}
