// slices/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const userKey = createSlice({
  name: 'userKey',
  initialState: {
    data: {}
  },
  reducers: {
    setUserKeyData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setUserKeyData } = userKey.actions;
export default userKey.reducer;
