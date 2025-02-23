import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserReducerInitialState } from "../../types/reducer-types"
import { User } from "../../types/types";

const initialState: UserReducerInitialState = {
    user: null,
    loading: true
}

export const userReducer = createSlice({
    name: "userReducer",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.loading = false;
            state.user = action.payload
        },
        logOut: (state, action) => {
            state.loading = false;
            state.user = null;
        }
    }
})

export const { login, logOut } = userReducer.actions
