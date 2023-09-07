import {createSlice, nanoid, createAsyncThunk, createSelector, 
    createEntityAdapter} from '@reduxjs/toolkit'

import {client} from '../../api/client'

const postsAdapter = createEntityAdapter({
    sortComparer: (a,b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle',
    error: null
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async initialPost => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state,action) {
            const {postId, reaction} = action.payload
            const existingPost = state.entities[postId]
            if(existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
        },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                            date: new Date().toISOString(),
                            title,
                            content,
                            user: userId,
                            reactions: {
                                thumbsUp: 0,
                                raisingHands: 0,
                                heart: 0,
                                rocket: 0,
                                eyes: 0
                            }
                    }
                }
            }
        },
        postUpdated(state, action) {
            const {id, title, content} = action.payload
            const existingPost = state.entities[id]
            if(existingPost) {
                existingPost.title = title
                existingPost.content = content
            }
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchPosts.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = 'succeeded'
            postsAdapter.upsertMany(state, action.payload)
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
        })
        .addCase(addNewPost.fulfilled, postsAdapter.addOne)
    }
})

console.log('Initial state:', initialState); // Add this line

export const {postAdded, postUpdated, reactionAdded} = postsSlice.actions

export const {
    selectAll: selectAllPosts,
    selectById: selectPostsById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)

export default postsSlice.reducer;

