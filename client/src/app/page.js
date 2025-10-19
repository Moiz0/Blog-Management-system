"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "@/store/slices/postsSlice";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function HomePage() {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchPosts({ page: 1 }));
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchPosts({ page: 1, search }));
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <>
      <Navbar />
      <section className="bg-blue-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">
            Welcome to Blog System
          </h1>
          <p className="text-base md:text-lg mb-6 opacity-90">
            Read, write, and explore ideas shared by the community.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 pr-28 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-700 text-lg font-medium mb-2">
              No posts found
            </p>
            <p className="text-gray-500">Try searching or create a new post.</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Latest Articles
              </h2>
              <div className="h-1 w-16 bg-blue-500 rounded"></div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/posts/${post._id}`}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                        {post.title}
                      </h3>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Content:
                      </label>
                      <p className="  text-sm line-clamp-3">
                        {stripHtml(post.excerpt || post.content)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-3 mt-3">
                      <div>
                        <label className="font-medium text-gray-500 mr-1">
                          Author:
                        </label>
                        <span className="text-gray-700">
                          {post.author?.name || "Unknown"}
                        </span>
                      </div>
                      <div>
                        <label className="font-medium text-gray-500 mr-1">
                          Created At:
                        </label>
                        <span className="text-gray-700">
                          {new Date(post.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
