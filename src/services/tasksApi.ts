import { apiSlice } from "./apiSlice";

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (filter?: { status?: string; developer?: number }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, any> = {};
        if (filter?.status) params.status = filter.status;
        if (filter?.developer) params.developer = filter.developer;
        return { url: "tasks", params };
      },
      providesTags: ["Task"],
    }),

    getTask: builder.query({
      query: (id) => `tasks/${id}`,
      providesTags: ["Task"],
    }),

    addTask: builder.mutation({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: {
          ...task,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: ["Task"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...update }) => ({
        url: `tasks/${id}`,
        method: "PATCH",
        body: update,
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
} = tasksApi;
