import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	position: [6.45, 3.4],
	show: false,
	ipInfo: {
		ip: "102.89.46.56",
		location: "Lagos, Nigeria",
		timezone: "Africa/Lagos",
		city: "Lagos",
		postalcode: 100001,
	},
	ipAddress: "",
};

const ipSlice = createSlice({
	name: "Ip",
	initialState,
	reducers: {
		setPosition(state, action) {
			state.position = action.payload;
		},
		setIpInfo(state, action) {
			state.ipInfo = action.payload;
		},
		setShow(state) {
			state.show = false;
		},
		setIpAddress(state, action) {
			state.ipAddress = action.payload;
		},
		toggle(state) {
			state.show = !state.show;
		},
	},
});

export const { setPosition, setIpInfo, setShow, setIpAddress, toggle } =
	ipSlice.actions;

export default ipSlice.reducer;
