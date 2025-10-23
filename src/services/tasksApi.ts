import { apiSlice } from "./apiSlice";

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (filter?: { status?: string; developerId?: number }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: Record<string, any> = {};
        if (filter?.status) params.status = filter.status;
        if (filter?.developerId) params.developerId = filter.developerId;
        return { url: "tasks", params };
      },
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

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation } =
  tasksApi;
