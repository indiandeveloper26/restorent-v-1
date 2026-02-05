"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("light");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userdataaa, setuserdata] = useState('fasdfsadf')



    useEffect(() => {

        const fetchProducts = async (restaurantId) => {
            try {
                let user = localStorage.getItem('user')

                console.log('userdata', user)

                const json = JSON.parse(user)
                setuserdata(json?.userdata)
                console.log('usersdta', json.userdata)
            } catch (err) {
                console.log('error')
            } finally {
                console.log('find')
            }
        };
        fetchProducts()

    }, [])


    // 🔥 API CALL YAHAN HOGA
    const fetchProducts = async (restaurantId) => {
        try {
            setLoading(true);
            setError(null);

            const res = await axios.get(
                '/backend/menu/menudata'
            );
            console.log('data', res)
            setProducts(res.data?.data || []);
        } catch (err) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                products,
                fetchProducts,
                loading,
                userdataaa,
                error,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
