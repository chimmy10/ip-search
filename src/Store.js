import { configureStore } from "@reduxjs/toolkit";
import ipReducer from "./Slice";

export const store = configureStore({
	reducer: {
		Ip: ipReducer,
	},
});
