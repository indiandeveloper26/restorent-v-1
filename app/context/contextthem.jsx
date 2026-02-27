"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [loging, setloging] = useState(false)
    const [userdataaa, setuserdata] = useState(null);
    const [cart, setcart] = useState(); // Cart ko array rakhein
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. Initial Load: User from LocalStorage
    useEffect(() => {
        const loadUser = () => {
            try {
                const storedUser = localStorage.getItem('user');
                console.log(storedUser)
                if (storedUser) {
                    const json = JSON.parse(storedUser);
                    console.log('userdta', storedUser)
                    setloging(true)
                    // Check structure: json.userdata ya direct json
                    setuserdata(json?.userdata || json);
                }
            } catch (err) {
                console.error("Error loading user:", err);
            } finally {
                setIsInitialized(true);
            }
        };
        loadUser();
    }, []);


    const loginuser = useCallback((data) => {

        console.log('userda', data)
        try {
            // LocalStorage se delete karein


            // State ko reset karein
            setuserdata(null);
            setloging(false);
            setcart([]); // Cart bhi khaali kar dein

            // Optional: Page refresh ya redirect
            window.location.href = "/pizza";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }, []);



    useEffect(() => {

        const loadUser = async () => {
            try {
                const storedUser = localStorage.getItem('user');

                if (storedUser) {
                    const json = JSON.parse(storedUser);
                    console.log('userdtaid', json._id)
                    let data = (await axios.get(`/backend/api/cart/get/${json?._id}`)).data
                    console.log('usercart data', data.cart.length);
                    setcart(data.cart.length)


                }
            } catch (err) {
                console.error("Error loading user:", err);
            }
        };
        loadUser();

    }, [])





    const logout = useCallback(() => {
        try {
            // LocalStorage se delete karein
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // State ko reset karein
            setuserdata(null);
            setloging(false);
            setcart([]); // Cart bhi khaali kar dein

            // Optional: Page refresh ya redirect
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }, []);

    // 2. Fetch Products API
    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get('/backend/menu/menudata');
            console.log('resdta', res)
            setProducts(res.data?.data || []);
        } catch (err) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    }, []);



    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                logout,
                products,
                loging, setloging,
                fetchProducts,
                loading,
                cart,

                loginuser,
                userdataaa,
                setuserdata,
                isInitialized,
                error,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};