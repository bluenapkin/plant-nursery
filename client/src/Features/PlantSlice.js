import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  posts: [],
  isLoading: false,
  isError: false,
};

export const fetchPosts = createAsyncThunk("plants/fetchPosts", async () => {
  try {
    const response = await axios.get(`${ENV.SERVER_URL}/posts`);
    return response.data.posts;
  } catch (error) {
    console.log(error);
    return [];
  }
});

export const createPost = createAsyncThunk("plants/createPost", async (postData) => {
  try {
    const response = await axios.post(`${ENV.SERVER_URL}/posts`, postData);
    return response.data.post;
  } catch (error) {
    console.log(error);
  }
});

export const toggleLike = createAsyncThunk("plants/toggleLike", async ({ postId, email }) => {
  try {
    const response = await axios.put(`${ENV.SERVER_URL}/posts/${postId}/like`, { email });
    return response.data.post;
  } catch (error) {
    console.log(error);
  }
});

export const deletePost = createAsyncThunk("plants/deletePost", async ({ postId, email }) => {
  try {
    await axios.delete(`${ENV.SERVER_URL}/posts/${postId}`, {
      data: { email },
    });
    return postId;
  } catch (error) {
    console.log(error);
  }
});

export const plantSlice = createSlice({
  name: "plants",
  initialState,
  reducers: {
    addPostLocally: (state, action) => {
      state.posts.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending,   (state) => { state.isLoading = true; })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.isLoading = false; state.posts = action.payload; })
      .addCase(fetchPosts.rejected,  (state) => { state.isLoading = false; state.isError = true; })
      .addCase(createPost.fulfilled, (state, action) => { if (action.payload) state.posts.unshift(action.payload); })
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.posts.findIndex((p) => p._id === action.payload._id);
          if (index !== -1) state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (action.payload) {
          state.posts = state.posts.filter((p) => p._id !== action.payload);
        }
      });
  },
});

export const { addPostLocally } = plantSlice.actions;
export default plantSlice.reducer;