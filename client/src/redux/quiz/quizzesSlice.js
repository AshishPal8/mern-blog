import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchActiveQuizzes = createAsyncThunk(
  "quizzes/fetchActiveQuizzes",
  async () => {
    const res = await fetch("/api/quizzes/active-quizzes");
    const data = await res.json();
    return data.quizzes;
  }
);

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveQuizzes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveQuizzes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchActiveQuizzes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default quizzesSlice.reducer;
