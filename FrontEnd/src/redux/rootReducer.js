import { combineReducers } from "redux"; 
import storage from "redux-persist/lib/storage";
import appReducer from './slices/app';
import { apiSlice } from "../services/apiSlice";


// Root persist configuration
const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: ['app'],   
    blacklist: ['apiSlice'],  
};

// Combine reducers
const rootReducer = combineReducers({
    app: appReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,  
});

export { rootPersistConfig, rootReducer };
