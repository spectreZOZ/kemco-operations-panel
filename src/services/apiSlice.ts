import { BASE_HEADERS, SERVER_URL } from "../lib/api";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "jsonServerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SERVER_URL || "http://localhost:5000/",
    prepareHeaders: BASE_HEADERS,
  }),
  tagTypes: ["Client", "Project", "Task", "Developer", "User"],
  endpoints: () => ({}), // extended in separate files
});
