import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as useAppDispatch, useSelector as useAppSelector } from 'react-redux';  // react-redux hooks
import { persistStore, persistReducer } from 'redux-persist';  // redux-persist
import { rootPersistConfig, rootReducer } from './rootReducer';
import { apiSlice } from '../services/apiSlice';

// create store
const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer), 
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware), 
});


const persistor = persistStore(store);


const { dispatch } = store;

const useSelector = useAppSelector;
const useDispatch = () => useAppDispatch();

export { store, persistor, dispatch, useSelector, useDispatch };
