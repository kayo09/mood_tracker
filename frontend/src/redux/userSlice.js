import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  access_token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
    },
    clearUser: (state) => {
      state.user = null;
      state.access_token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
