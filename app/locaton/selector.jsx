import { useState } from "react";
import LocationPicker from "./LocationPicker";

export default function AddressForm() {
    const [address, setAddress] = useState("");
    const [location, setLocation] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Address:", address);
        console.log("Selected location:", location);
        // Save to backend for delivery person
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Enter Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border px-4 py-2 rounded w-full"
            />

            <LocationPicker onSelect={setLocation} />

            <button
                type="submit"
                className="bg-yellow-400 text-white px-4 py-2 rounded"
            >
                Save Address
            </button>
        </form>
    );
}
