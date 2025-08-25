import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ProductsPage from '../pages/ProductsPage.jsx';
import { ProductsAPI, CategoriesAPI } from '../services/api.js';
import { CartProvider } from '../context/CartContext.jsx';

vi.mock('../services/api.js', () => ({
    CategoriesAPI: { list: vi.fn().mockResolvedValue({ items: [] }) },
    ProductsAPI: { list: vi.fn() },
    SyncAPI: { fakestore: vi.fn() },
}));

vi.mock('../context/CartContext.jsx', () => ({
    useCart: () => ({ add: vi.fn() }),
    CartProvider: ({ children }) => children,
}));

describe('ProductsPage', () => {
    beforeEach(() => vi.resetAllMocks());

    it('shows error when ProductsAPI.list throws', async () => {
        ProductsAPI.list.mockRejectedValue(new Error('Boom'));

        render(
            <CartProvider>
                <ProductsPage />
            </CartProvider>
        );

        // Wait for the error message
        const err = await screen.findByText(/Boom|Failed/i);
        expect(err).toBeInTheDocument();
    });
});
