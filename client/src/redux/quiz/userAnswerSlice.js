import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const submitUserAnswers = createAsyncThunk(
  "userAnswers/submitUserAnswers",
  async ({ userId, quizId, answers }) => {
    const res = await fetch("/api/user-answers/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, quizId, answers }),
    });
    const data = await res.json();
    return data;
  }
);

export const fetchUserScore = createAsyncThunk(
  "userAnswers/fetchUserScore",
  async ({ userId, quizId }) => {
    const response = await fetch(`/api/user-answers/score/${userId}/${quizId}`);
    const data = await response.json();
    console.log(data.score);
    return data;
  }
);

const userAnswersSlice = createSlice({
  name: "userAnswers",
  initialState: {
    answers: {},
    score: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setUserAnswer: (state, action) => {
      const { questionId, option } = action.payload;
      state.answers[questionId] = option;
    },
    resetUserAnswers: (state) => {
      state.answers = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitUserAnswers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitUserAnswers.fulfilled, (state) => {
        state.status = "succeeded";
        state.answers = {};
      })
      .addCase(submitUserAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserScore.fulfilled, (state, action) => {
        state.score = action.payload.score;
      });
  },
});

export const { setUserAnswer, resetUserAnswers } = userAnswersSlice.actions;
export default userAnswersSlice.reducer;
