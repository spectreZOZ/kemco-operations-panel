import { apiSlice } from "./apiSlice";

export const clientsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => "clients",
      providesTags: ["Client"],
    }),
    getClient: builder.query<Client, string>({
      query: (id) => `clients/${id}`,
      providesTags: ["Client"],
    }),
    addClient: builder.mutation({
      query: (newClient) => ({
        url: "clients",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Client"],
    }),
    updateClient: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `clients/${id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Client"],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
