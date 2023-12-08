// slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const mapSlice = createSlice({
  name: 'map',
  initialState: {
    sourceRedux: "",
    destinationRedux: "",
    chatHistory:["hello ji","han ji sir bolo"]
  },
  reducers: {
    setSourceRedux: (state, action) => {
      state.sourceRedux = action.payload;
    },
    setDestinationRedux: (state: any, action: any) => {
      state.destinationRedux = action.payload;
    },
    setchatHistory: (state: any, action: any) => {
      console.log("history getting saved",action.payload);
      
      state.chatHistory = action.payload;
    },
  },
});

export const { setDestinationRedux, setSourceRedux, setchatHistory } = mapSlice.actions;
export default mapSlice.reducer;
