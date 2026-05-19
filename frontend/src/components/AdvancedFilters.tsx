'use client';

import { useState } from 'react';

export interface FilterState {
    priceRange: [number, number];
    categories: string[];
    rating: number;
    location: string;
    dateRange: [string, string];
    inStock: boolean;
    freeShipping: boolean;
    sortBy: string;
}

interface AdvancedFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    categories?: string[];
    maxPrice?: number;
}

export default function AdvancedFilters({
    onFilterChange,
    categories = [],
    maxPrice = 10000,
}: AdvancedFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, maxPrice],
        categories: [],
        rating: 0,
        location: '',
        dateRange: ['', ''],
        inStock: false,
        freeShipping: false,
        sortBy: 'relevance',
    });

    const [showFilters, setShowFilters] = useState(false);

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleCategory = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter((c) => c !== category)
            : [...filters.categories, category];
        updateFilter('categories', newCategories);
    };

    const clearFilters = () => {
        const defaultFilters: FilterState = {
            priceRange: [0, maxPrice],
            categories: [],
            rating: 0,
            location: '',
            dateRange: ['', ''],
            inStock: false,
            freeShipping: false,
            sortBy: 'relevance',
        };
        setFilters(defaultFilters);
        onFilterChange(defaultFilters);
    };

    const activeFilterCount = [
        filters.categories.length > 0,
        filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice,
        filters.rating > 0,
        filters.location !== '',
        filters.dateRange[0] !== '' || filters.dateRange[1] !== '',
        filters.inStock,
        filters.freeShipping,
    ].filter(Boolean).length;

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Filters</h3>
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    {activeFilterCount > 0 && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-600 hover:text-gray-800"
                        >
                            Clear All
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="lg:hidden text-blue-600"
                    >
                        {showFilters ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            {/* Filter Body */}
            <div className={`${showFilters ? 'block' : 'hidden'} lg:block p-4 space-y-6`}>
                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            value={filters.priceRange[0]}
                            onChange={(e) =>
                                updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])
                            }
                            className="flex-1"
                        />
                        <input
                            type="range"
                            min={0}
                            max={maxPrice}
                            value={filters.priceRange[1]}
                            onChange={(e) =>
                                updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])
                            }
                            className="flex-1"
                        />
                    </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {categories.map((category) => (
                                <label key={category} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.categories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                    </label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => updateFilter('rating', star)}
                                className={`text-2xl ${star <= filters.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => updateFilter('location', e.target.value)}
                        placeholder="Enter city or zip code"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Date Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="date"
                            value={filters.dateRange[0]}
                            onChange={(e) => updateFilter('dateRange', [e.target.value, filters.dateRange[1]])}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="date"
                            value={filters.dateRange[1]}
                            onChange={(e) => updateFilter('dateRange', [filters.dateRange[0], e.target.value])}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Quick Filters */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => updateFilter('inStock', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.freeShipping}
                            onChange={(e) => updateFilter('freeShipping', e.target.checked)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Free Shipping</span>
                    </label>
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => updateFilter('sortBy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="relevance">Most Relevant</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
