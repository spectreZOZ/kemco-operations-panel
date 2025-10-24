import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      queryFn: async (credentials, _api, _extra, baseQuery) => {
        const { email, password } = credentials;

        const result = await baseQuery("users");
        if (result.error) return { error: result.error };

        const users = result.data as Array<{
          id: number;
          username: string;
          email?: string;
          password: string;
        }>;

        const user = users.find(
          (u) =>
            (u.email === email || u.username === email) &&
            u.password === password
        );

        if (!user) {
          return {
            error: { status: 401, data: { message: "Invalid credentials" } },
          };
        }

        const token = `mock-token-${user.id}-${Date.now()}`;

        if (typeof window !== "undefined") {
          localStorage.setItem(
            "authUser",
            JSON.stringify({ ...user, password: undefined, token })
          );
          document.cookie = `authToken=${token}; path=/;`;
        }

        return { data: { ...user, token } };
      },
    }),
    registerUser: builder.mutation({
      queryFn: async (credentials, _api, _extra, baseQuery) => {
        const { email, username, role } = credentials;

        // 1️⃣ Read existing users
        const result = await baseQuery("users");
        if (result.error) return { error: result.error };

        const users = result.data as Array<{
          id: number;
          username: string;
          email?: string;
          password: string;
        }>;

        // 2️⃣ Check for duplicates
        const existing = users.find(
          (u) => u.username === username || u.email === email
        );
        if (existing) {
          return {
            error: { status: 409, data: { message: "User already exists" } },
          };
        }

        // 3️⃣ Create new user object
        const newUser = {
          id: users.length + 1,
          ...credentials,
        };

        // 4️⃣ Save to json‑server (POST /users)
        const postResult = await baseQuery({
          url: "users",
          method: "POST",
          body: newUser,
        });

        if (postResult.error) return { error: postResult.error };

        // 💥 if developer role, also add to /developers
        if (role === "developer") {
          await baseQuery({
            url: "developers",
            method: "POST",
            body: {
              id: newUser.id,
              name: newUser.name,
              email: newUser.email,
              skills: newUser.skills ?? [],
              phone: newUser.phone ?? "",
              company: newUser.company ?? "",
              userId: newUser.id, // backlink to user
            },
          });
        }

        // 5️⃣ Persist locally for convenience
        if (typeof window !== "undefined") {
          localStorage.setItem("authUser", JSON.stringify(newUser));
        }

        return { data: newUser };
      },
    }),

    getUser: builder.query({
      query: (id) => ({
        url: `users`,
        method: "GET",
        params: { id },
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserQuery,
} = authApi;
