import {createSlice} from "@reduxjs/toolkit";
import {IT,EN} from "../../utility/Costanti";



const languageSlice = createSlice({
    name:"language",
    initialState:IT,
    reducers:{
        setLanguage:(state,action) =>{
            return state = action.payload
        }
    }
})
export const { setLanguage } = languageSlice.actions;

/*
OPPURE const languageReducer = languageSlice.reducer
* export default languageReducer quindi sullo store importo solo il reducer
* */
export default languageSlice.reducer;
