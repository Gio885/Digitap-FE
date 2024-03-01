import { configureStore } from "@reduxjs/toolkit";
import languageSlice from "./slice/languageSlice";
/*LANGUAGE SLICE SENZA GRAFFE ALTRIMENTI NON LEGGE IL REDUCERU*/

//persistor redux
export const store = configureStore({
    reducer: {
        language: languageSlice
    },
});