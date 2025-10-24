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
    getProject: builder.query<Project, string>({
      query: (id) => ({
        url: `projects/${id}?_expand=client&_embed=tasks`,
        method: "GET",
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
    updateProject: builder.mutation<Project, Omit<Project, "developer">>({
      query: ({ id, ...rest }) => ({
        url: `projects/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Project"],
    }),
    deleteProject: builder.mutation<Project, string>({
      query: (id) => ({
        url: `projects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsApi;
