import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//used as a wrapper to simplify request
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    //set a authorization token in headers if there is
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
// general api endpoint, notes and user endpoint will extends this apiSlice.
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
