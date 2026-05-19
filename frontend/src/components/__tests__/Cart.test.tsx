import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useCartStore } from '@/store/cart.store';
import Cart from '@/components/Cart';

jest.mock('@/store/cart.store');

describe('Cart Component', () => {
    const mockCartState = {
        items: [
            {
                id: '1',
                productId: 'prod-1',
                name: 'Test Product',
                price: 29.99,
                quantity: 2,
                image: '/test.jpg',
            },
        ],
        total: 59.98,
        itemCount: 2,
        addItem: jest.fn(),
        removeItem: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn(),
        calculateTotal: jest.fn(),
    };

    beforeEach(() => {
        (useCartStore as unknown as jest.Mock).mockReturnValue(mockCartState);
    });

    it('renders cart items', () => {
        render(<Cart />);
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('displays total price', () => {
        render(<Cart />);
        expect(screen.getByText('$59.98')).toBeInTheDocument();
    });

    it('updates quantity when changed', () => {
        render(<Cart />);
        const increaseBtn = screen.getByLabelText('Increase quantity');

        fireEvent.click(increaseBtn);
        expect(mockCartState.updateQuantity).toHaveBeenCalledWith('1', 3);
    });

    it('removes item when remove button clicked', () => {
        render(<Cart />);
        const removeBtn = screen.getByLabelText('Remove item');

        fireEvent.click(removeBtn);
        expect(mockCartState.removeItem).toHaveBeenCalledWith('1');
    });

    it('shows empty cart message when no items', () => {
        (useCartStore as unknown as jest.Mock).mockReturnValue({
            ...mockCartState,
            items: [],
            itemCount: 0,
            total: 0,
        });

        render(<Cart />);
        expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
});
