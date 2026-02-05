"use client";
import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from "@react-google-maps/api";
import { MapPin, Navigation, Save, Search } from "lucide-react";
import { toast } from "react-toastify";

// Libraries array ko component se bahar rakhte hain
const libraries = ["places"];

// Default location (e.g., Delhi)
const defaultCenter = { lat: 28.6139, lng: 77.2090 };

export default function page() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyAhTWqFdTY3gku-5jvRH2wY9HHS36a38aM", // <--- Apni API Key yahan dalein
        libraries,
    });

    const [map, setMap] = useState(null);
    const [address, setAddress] = useState("");
    const [position, setPosition] = useState(defaultCenter);
    const autocompleteRef = useRef(null);

    // 1. Marker ko drag karne par coordinates update karna
    const onMarkerDragEnd = (e) => {
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        setPosition({ lat: newLat, lng: newLng });
        reverseGeocode(newLat, newLng);
    };

    // 2. Lat/Lng se address nikalna (Reverse Geocoding)
    const reverseGeocode = async (lat, lng) => {
        const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=YOUR_GOOGLE_MAPS_API_KEY`
        );
        const data = await res.json();
        if (data.results[0]) {
            setAddress(data.results[0].formatted_address);
        }
    };

    // 3. Search bar se place select karna
    const onPlaceChanged = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const newPos = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            setPosition(newPos);
            setAddress(place.formatted_address);
            map.panTo(newPos);
        }
    };

    // 4. User ki current GPS location lena
    const detectCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const currentPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setPosition(currentPos);
                map.panTo(currentPos);
                reverseGeocode(currentPos.lat, currentPos.lng);
            });
        }
    };

    // 5. Backend mein save karne ka function
    const saveLocation = async () => {
        try {
            const res = await fetch("/api/save-location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    address,
                    latitude: position.lat,
                    longitude: position.lng,
                }),
            });
            if (res.ok) toast.success("Location Saved Successfully!");
        } catch (err) {
            toast.error("Failed to save location");
        }
    };

    if (!isLoaded) return <div className="p-10 text-center uppercase font-bold">Loading Maps...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
            <div className="max-w-4xl w-full space-y-6">

                <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                    <MapPin className="text-yellow-500" /> Select Delivery Spot
                </h1>

                <div className="relative group">
                    <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={onPlaceChanged}>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search your area/colony..."
                                className="w-full bg-gray-800 border-2 border-gray-700 p-4 pl-12 rounded-2xl focus:border-yellow-500 outline-none transition-all"
                            />
                        </div>
                    </Autocomplete>
                </div>

                <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden border-4 border-gray-800 shadow-2xl relative">
                    <GoogleMap
                        mapContainerStyle={{ width: "100%", height: "100%" }}
                        center={position}
                        zoom={15}
                        onLoad={(map) => setMap(map)}
                        options={{ disableDefaultUI: true, zoomControl: true }}
                    >
                        <Marker
                            position={position}
                            draggable={true}
                            onDragEnd={onMarkerDragEnd}
                            animation={window.google.maps.Animation.DROP}
                        />
                    </GoogleMap>

                    <button
                        onClick={detectCurrentLocation}
                        className="absolute bottom-6 right-6 bg-white text-black p-4 rounded-full shadow-xl hover:bg-yellow-500 transition-all"
                    >
                        <Navigation size={24} />
                    </button>
                </div>

                <div className="bg-gray-800 p-6 rounded-3xl space-y-4 border border-gray-700">
                    <div>
                        <label className="text-[10px] font-black uppercase text-yellow-500 tracking-widest">Exact Coordinates</label>
                        <p className="font-mono text-sm opacity-70">LAT: {position.lat.toFixed(6)} | LNG: {position.longitude ? position.longitude.toFixed(6) : position.lng.toFixed(6)}</p>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-yellow-500 tracking-widest">Selected Address</label>
                        <p className="font-medium">{address || "Please select a location on map..."}</p>
                    </div>
                </div>

                <button
                    onClick={saveLocation}
                    className="w-full py-5 bg-yellow-500 hover:bg-yellow-600 text-white font-black rounded-2xl shadow-xl shadow-yellow-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                    <Save size={20} /> Save My Location
                </button>
            </div>
        </div>
    );
}