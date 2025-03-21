// src/features/usersSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Goal {
    id: string;
    name: string;
    description: string;
    date: string;
    color: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    description: string;
    goals: Goal[];
}

export interface Data {
    data: {
        users: User[]
    }
}


export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_BASE_URL}/graphql`, // Your GraphQL API endpoint
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<Data, void>({
            query: () => ({
                url: '',
                method: 'POST',
                body: {
                    query: `
            {
              users {
                id
                username
                email
                description
              }
            }
          `,
                },
            }),
        }),
    }),
});

export const { useGetUsersQuery } = usersApi;
