import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import postSlice from './postSlice';
import storage from 'redux-persist/lib/storage';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore
} from 'redux-persist';

// ✅ Define Persist Config
const persistConfig = {
    key: 'root',
    version: 1,
    storage
};

// ✅ Combine Reducers
const rootReducer = combineReducers({
    auth: authSlice,
    posts: postSlice
});

// ✅ Apply Persist Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure Store with Correct Middleware
export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        })
});

// ✅ Persistor for Redux Persist
export const persistor = persistStore(store);

// ✅ Export RootState & AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
