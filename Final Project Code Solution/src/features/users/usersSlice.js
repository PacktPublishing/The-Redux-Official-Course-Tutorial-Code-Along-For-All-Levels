import {createSlice, createAsyncThunk, createEntityAdapter, createSelector} from '@reduxjs/toolkit'
import { apiSlice } from '../../api/apiSlice'

const usersAdapter = createEntityAdapter()


export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users'
        })
    })
})

export const {useGetUsersQuery} = extendedApiSlice

export const selectUsersResult = apiSlice.endpoints.getUsers.select()

const emptyUsers = []

export const selectAllUsers = createSelector(
    selectUsersResult,
    usersResult => usersResult?.data ?? emptyUsers
)

export const selectUserById = createSelector(
    selectAllUsers,
    (state, userId) => userId,
    (users, userId) => users.find(user => user.id === userId)
)

