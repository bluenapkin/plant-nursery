import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/registerUser`, {
        name:     userData.name,
        email:    userData.email,
        password: userData.password,
      });
      return response.data.user;
    } catch (error) {
      console.log(error);
    }
  }
);

export const login = createAsyncThunk("users/login", async (userData) => {
  try {
    const response = await axios.post(`${ENV.SERVER_URL}/login`, {
      email:    userData.email,
      password: userData.password,
    });
    return response.data.user;
  } catch (error) {
    const errorMessage = "Invalid credentials. Please try again.";
    alert(errorMessage);
    throw new Error(errorMessage);
  }
});

export const logout = createAsyncThunk("/users/logout", async () => {
  try {
    await axios.post(`${ENV.SERVER_URL}/logout`);
  } catch (error) {}
});

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData) => {
    try {
      const response = await axios.put(
        `${ENV.SERVER_URL}/updateUserProfile/${userData.email}/`,
        userData.formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data.user;
    } catch (error) {
      console.log(error);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => { state.user = action.payload; },
    deleteUser: (state) => { state.user = {}; },
    updateUser: (state, action) => {
      if (state.user) {
        if (action.payload.name)       state.user.name       = action.payload.name;
        if (action.payload.profilePic) state.user.profilePic = action.payload.profilePic;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending,   (state) => { state.isLoading = true; })
      .addCase(registerUser.fulfilled, (state) => { state.isLoading = false; })
      .addCase(registerUser.rejected,  (state) => { state.isLoading = false; })

      .addCase(login.pending,   (state) => { state.isLoading = true; })
      .addCase(login.fulfilled, (state, action) => {
        state.user      = action.payload;
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError   = true;
      })

      .addCase(logout.pending,   (state) => { state.isLoading = true; })
      .addCase(logout.fulfilled, (state) => {
        state.user      = {};
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isError   = true;
      })

      .addCase(updateUserProfile.pending,   (state) => { state.isLoading = true; })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user      = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected,  (state) => {
        state.isLoading = false;
        state.isError   = true;
      });
  },
});

export const { addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;