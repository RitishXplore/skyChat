import { apiSlice } from "../../../services/apiSlice";


export const registerform = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetUsers: builder.query({
      query: () => ({
        url: `/v1/auth/getquery`,
        method: "GET",
      }),
    }),

    RegisterUser: builder.mutation({
      query: (user) => ({
        url: `/v1/auth/signup`,
        method: 'POST',
        body: user,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    LoginUser : builder.mutation({
      query : (user)=>({
        url : `v1/auth/login`,
        method : 'POST',
        body : user,
        headers : {
          'Content-Type' : 'application/json'
        }
      })
    })
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useRegisterUserMutation , useLoginUserMutation } = registerform;
