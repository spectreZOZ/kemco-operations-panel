import { apiSlice } from "./apiSlice";

export const developersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevelopers: builder.query({
      query: () => "developers",
      providesTags: ["Developer"],
    }),
    updateDeveloper: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `developers/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Developer"],
    }),
  }),
});

export const { useGetDevelopersQuery, useUpdateDeveloperMutation } =
  developersApi;
