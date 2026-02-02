import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔥 Fetch products by restaurant ID
export const fetchProducts = createAsyncThunk(
    "products/fetchProducts",
    async (restaurantId, thunkAPI) => {
        try {
            console.log("API calling... restaurantId:", restaurantId);

            const res = await axios.get(
                '/backend/menu/menudata'
            );

            console.log("API response:", res.data);

            // 👇 only return product array
            return Array.isArray(res.data.data) ? res.data.data : [];
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || err.message
            );
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch products";
            });
    },
});

export default productsSlice.reducer;
