import { configureStore } from '@reduxjs/toolkit'

const initialState = {
    movies: [
      { title: 'The Godfather', inBasket: false, liked: false },
      { title: 'The Shawshank Redemption', inBasket: false, liked: false },
      { title: 'The Dark Knight', inBasket: false, liked: false },
    ],
    basket: [],
    likedMovies: []
  }

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_MOVIE':
            return {
                ...state,
                movies: [...state.movies, action.payload]
            }
            case 'ADD_TO_BASKET':
                return {
                  ...state,
                  // it finds the match of the movie and switches it if it is a match
                  movies: state.movies.map(movie => movie.title === action.payload ? { ...movie, inBasket: !movie.inBasket } : movie),
                  // if it's already there don't add it otherwise add it
                  basket: state.basket.includes(action.payload) ? state.basket.filter(movie => movie !== action.payload) : [...state.basket, action.payload]
                }
              case 'LIKE_MOVIE':
                return {
                  ...state,
                  movies: state.movies.map(movie => movie.title === action.payload ? { ...movie, liked: !movie.liked } : movie),
                  likedMovies: state.likedMovies.includes(action.payload) ? state.likedMovies.filter(movie => movie !== action.payload) : [...state.likedMovies, action.payload]
                }
        default:
            return state
    }
}

const store = configureStore({ reducer })

export default store