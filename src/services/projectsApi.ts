import { apiSlice } from "./apiSlice";

export const projectsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], string>({
      query: (status?: string) => ({
        url: "projects?_expand=client&_embed=tasks",
        method: "GET",
        params: { status },
      }),
      providesTags: ["Project"],
    }),
    addProject: builder.mutation({
      query: (newProject) => ({
        url: "projects",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const { useGetProjectsQuery, useAddProjectMutation } = projectsApi;
