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

    // --- assign developer to additional project ---
    assignDeveloperToProject: builder.mutation({
      async queryFn({ id, projectId }, _api, _extra, baseQuery) {
        // get current developer
        const existing = await baseQuery(`developers/${id}`);
        if (existing.error) return { error: existing.error };
        // @ts-expect-error: Unkhown
        const current = existing?.data?.projectIds ?? [];
        if (current.includes(projectId)) return { data: existing.data }; // already assigned

        const updated = {
          projectIds: [...current, projectId],
        };
        const res = await baseQuery({
          url: `developers/${id}`,
          method: "PATCH",
          body: updated,
        });
        return res;
      },
      invalidatesTags: ["Developer"],
    }),

    // --- unassign developer from specific project ---
    unassignDeveloperFromProject: builder.mutation({
      async queryFn({ id, projectId }, _api, _extra, baseQuery) {
        const existing = await baseQuery(`developers/${id}`);
        if (existing.error) return { error: existing.error };

        // @ts-expect-error: Unkhown
        const filtered = (existing?.data?.projectIds ?? []).filter(
          (pid: string) => pid !== projectId
        );

        const res = await baseQuery({
          url: `developers/${id}`,
          method: "PATCH",
          body: { projectIds: filtered },
        });
        return res;
      },
      invalidatesTags: ["Developer"],
    }),
  }),
});

export const {
  useGetDevelopersQuery,
  useUpdateDeveloperMutation,
  useAssignDeveloperToProjectMutation,
  useUnassignDeveloperFromProjectMutation,
} = developersApi;
