import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/Button';

describe('Button Component', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        fireEvent.click(screen.getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Click me</Button>);
        expect(screen.getByText('Click me')).toBeDisabled();
    });

    it('applies variant styles correctly', () => {
        const { rerender } = render(<Button variant="primary">Primary</Button>);
        expect(screen.getByText('Primary')).toHaveClass('bg-blue-600');

        rerender(<Button variant="secondary">Secondary</Button>);
        expect(screen.getByText('Secondary')).toHaveClass('bg-gray-600');
    });

    it('applies size styles correctly', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        expect(screen.getByText('Small')).toHaveClass('px-3', 'py-1');

        rerender(<Button size="lg">Large</Button>);
        expect(screen.getByText('Large')).toHaveClass('px-6', 'py-3');
    });

    it('shows loading state', () => {
        render(<Button loading>Loading</Button>);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
});
