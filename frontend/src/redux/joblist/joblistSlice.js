import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { selectUser } from '../user/userSlice';

// Define an async thunk for fetching jobs
export const fetchJobs = createAsyncThunk("jobsLists/fetchJobs", async (_, { getState }) => {
  try {
    // Get the user from the user slice using the selector
    const currentUser = selectUser(getState());

    // If the user is available, construct the API URL accordingly
    if (currentUser) {
      const userId = currentUser._id;
      console.log("User ID:", userId);
      const apiUrl = `/api/auth/view/${userId}`;

      // Fetch data from the API endpoint
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Check if the API call was successful
      if (data.success === false) {
        throw new Error("Failed to fetch jobs");
      }

      // Return the fetched jobs
      return data;
    } else {
      console.log("User not available");
      return []; // Return an empty array if the user is not available
    }
  } catch (error) {
    throw error;
  }
});



const jobsListSlice = createSlice({
  name: "jobsLists",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {
   
   /* addJob: (state, action) => {
      state.jobs.push(action.payload);
    },*/
    updateJob: (state, action) => {
      const jobIndex = state.jobs.findIndex(
        (job) => job._id === action.payload._id
      );
      state.jobs[jobIndex] = action.payload;
    },
    deleteJob: (state, action) => {
      const deletedJobId = action.payload;
      state.jobs = state.jobs.filter((job) => job._id !== deletedJobId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.error = action.error;
        state.loading = false;
      });
  },
});

export const {
  updateJob,
  deleteJob,
} = jobsListSlice.actions;
export default jobsListSlice.reducer;
