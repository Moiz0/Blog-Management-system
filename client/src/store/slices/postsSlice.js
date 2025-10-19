import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (search = "", { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/posts?search=${search}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.posts || data; // handle both array or {posts: [...]}
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data.post;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = Array.isArray(action.payload)
          ? action.payload
          : action.payload.posts;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;
        state.currentPost = action.payload;
      })

      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrentPost, clearError } = postsSlice.actions;
export default postsSlice.reducer;
