import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// general api endpoint, notes and user endpoint will extends this apiSlice.
export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Note", "User"],
  endpoints: (builder) => ({}),
});
