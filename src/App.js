import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector, useDispatch } from "react-redux";
import { setIpAddress, setIpInfo, setPosition, setShow, toggle } from "./Slice";

// Fix missing marker issue by defining a custom icon
const customIcon = L.icon({
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
	shadowSize: [41, 41],
});

function MapUpdater({ position }) {
	const map = useMap(); // Access the map instance

	// Ensure the map is updated when position changes and move the zoom control
	useEffect(() => {
		if (position) {
			map.setView(position, map.getZoom()); // Update the map view to new position
		}

		// Move the zoom control to a different position (e.g., bottomleft)
		map.zoomControl.setPosition("bottomleft"); // You can change this position as needed
	}, [position, map]); // Dependency on position and map to update when they change

	return null;
}

function App() {
	const dispatch = useDispatch();
	const position = useSelector((state) => state.Ip.position);
	const show = useSelector((state) => state.Ip.show);
	const ipAddress = useSelector((state) => state.Ip.ipAddress);
	const ipInfo = useSelector((state) => state.Ip.ipInfo);

	function isValidIp(ip) {
		const ipRegex =
			/^((25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
		return ipRegex.test(ip);
	}

	async function handleSubmit() {
		if (!isValidIp(ipAddress)) {
			alert("Invalid IP address format");
			return;
		}
		if (!ipAddress.trim()) {
			alert("IP address cannot be empty");
			return;
		}
		try {
			const res = await fetch(
				`https://api.freeiplookupapi.com/v1/info?apikey=fil_live_HbSJItArUqyr7NKs88IwmorgodSlpOlUtVZxv4tP&ip=${ipAddress}`
			);
			if (!res.ok) throw new Error("Failed to fetch IP data");
			const data = await res.json();
			console.log(data);
			const {
				latitude,
				longitude,
				region_name: regionName,
				country_name: countryName,
				time_zone: timeZone,
				postal_code: postalCode,
				city,
				ip,
			} = data;

			dispatch(setPosition([latitude, longitude]));
			dispatch(
				setIpInfo({
					ip,
					location: `${regionName}, ${countryName}`,
					timezone: timeZone,
					postalcode: postalCode,
					city: city,
				})
			);

			dispatch(setShow());
		} catch (err) {
			console.error("Error fetching IP data:", err.message);
		}
	}

	function handleClick() {
		dispatch(toggle());
	}

	return (
		<div className="relative flex flex-col h-screen">
			{/* Background Image */}
			<img
				src="/images/pattern-bg-desktop.png"
				alt="Responsive"
				className="w-full h-80"
			/>

			{/* Info Card */}
			<div className="absolute inset-x-0 z-10 flex flex-col items-center justify-center px-6 py-4 text-center text-white pointer-events-none top-4">
				<p className="mb-8 text-3xl font-semibold pointer-events-auto lg:text-4xl">
					IP Address Tracker
				</p>

				<div className="relative w-full sm:w-[500px] mb-7 pointer-events-auto">
					<input
						type="text"
						placeholder="Search for any IP address or domain"
						className="w-full px-6 py-4 pr-16 text-black border border-gray-300 shadow-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
						value={ipAddress}
						onChange={(e) => dispatch(setIpAddress(e.target.value))}
					/>
					<button
						onClick={handleSubmit}
						className="absolute right-0 sm:absolute top-0 bottom-0 my-auto w-10 h-[58px] text-white bg-black rounded-r-2xl p-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-gray-700"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-6 h-6 transition-transform duration-300 ease-in-out hover:rotate-90 hover:fill-gray-100"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="m8.25 4.5 7.5 7.5-7.5 7.5"
							/>
						</svg>
					</button>
				</div>

				{!show && (
					<div className="mt-5 pointer-events-auto xl:hidden">
						<button
							onClick={handleClick}
							class="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							Show details
						</button>
					</div>
				)}

				<div
					className={`relative text-center border lg:mt-8 bg-slate-100 py-7 px-20 rounded-2xl shadow-lg w-full sm:w-[500px] xl:w-full xl:flex xl:items-center xl:justify-between pointer-events-auto  ${
						show ? "" : "hidden xl:block" // Hide card when show is false, but ensure it’s visible on md+ screens
					}`}
				>
					<button
						onClick={handleClick}
						className="absolute text-gray-500 top-2 right-2 hover:text-gray-800 focus:outline-none xl:hidden"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					<div className="flex flex-col items-center xl:items-start">
						<p className="font-bold text-gray-500 tracking-[2px] text-xs">
							IP ADDRESS
						</p>
						<p className="text-2xl mt-1.5 font-bold text-gray-800 break-words">
							{ipInfo.ip}
						</p>
					</div>
					<div className="hidden w-px h-20 bg-gray-400 xl:block"></div>

					<div className="flex flex-col items-center mt-6 xl:items-start xl:mt-0">
						<p className="font-bold text-gray-500 tracking-[2px] text-xs">
							LOCATION
						</p>
						<p className="text-2xl mt-1.5 font-bold text-gray-800 break-words">
							{ipInfo.location}
						</p>
					</div>
					<div className="hidden w-px h-20 bg-gray-400 xl:block"></div>

					<div className="flex flex-col items-center mt-6 xl:items-start xl:mt-0">
						<p className="font-bold text-gray-500 tracking-[2px] text-xs">
							POSTAL CODE
						</p>
						<p className="text-2xl mt-1.5 font-bold text-gray-800 break-words">
							{ipInfo.postalcode || "Data not found"}
						</p>
					</div>
					<div className="hidden w-px h-20 bg-gray-400 xl:block"></div>

					<div className="flex flex-col items-center mt-6 xl:items-start xl:mt-0">
						<p className="font-bold text-gray-500 tracking-[2px] text-xs">
							ISP
						</p>
						<p className="text-2xl mt-1.5 font-bold text-gray-800 break-words">
							SpaceX Starlink
						</p>
					</div>
				</div>
			</div>

			{/* Map Container */}
			<div className="relative z-0 flex-grow w-full">
				<MapContainer
					center={position}
					zoom={7}
					style={{ height: "100%", width: "100%" }}
				>
					<MapUpdater position={position} />
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>
					<Marker position={position} icon={customIcon}>
						<Popup>{ipInfo.location}</Popup>
					</Marker>
				</MapContainer>
			</div>
		</div>
	);
}

export default App;
