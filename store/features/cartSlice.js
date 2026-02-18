import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    totalAmount: 0,
    totalQuantity: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find((item) => item.id === newItem.id);

            state.totalQuantity += newItem.quantity || 1;

            if (!existingItem) {
                state.items.push({
                    ...newItem,
                    quantity: newItem.quantity || 1,
                    totalPrice: newItem.price * (newItem.quantity || 1),
                });
            } else {
                existingItem.quantity += newItem.quantity || 1;
                existingItem.totalPrice += newItem.price * (newItem.quantity || 1);
            }

            state.totalAmount = state.items.reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
            );
        },
        removeFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter((item) => item.id !== id);
            }

            state.totalAmount = state.items.reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
            );
        },
        updateQuantity(state, action) {
            const { id, quantity } = action.payload;
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem && quantity > 0) {
                const quantityDiff = quantity - existingItem.quantity;
                state.totalQuantity += quantityDiff;
                existingItem.quantity = quantity;
                existingItem.totalPrice = Number(existingItem.price) * quantity;
            }

            state.totalAmount = state.items.reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
            );
        },
        clearCart(state) {
            state.items = [];
            state.totalAmount = 0;
            state.totalQuantity = 0;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
