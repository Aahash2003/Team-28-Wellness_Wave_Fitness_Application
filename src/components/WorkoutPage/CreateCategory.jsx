import React, { useState } from 'react';
import axios from 'axios';
import image from './Equipment Sign.png';

const email = localStorage.getItem('email');

const baseURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/'
    : 'https://mustang-central-eb5dd97b4796.herokuapp.com/';

const CreateCategory = ({ onCategoryCreated, categories, handleDeleteCategory, onCategorySelect }) => {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            setError('Please enter a category name.');
            return;
        }

        if (!email) {
            setError('User email is missing. Please log in again.');
            return;
        }

        try {
            await axios.post(`${baseURL}api/workout/createCategory`, {
                name: categoryName.trim(),
                description: description.trim(),
                imageUrl: image,
                email,
            });
            onCategoryCreated();  // Refresh categories after creation
            setCategoryName('');
            setDescription('');
        } catch (error) {
            setError('Error creating category: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-5 bg-white shadow-md rounded-lg">
            {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded">
                    <strong>Error:</strong> {error}
                </div>
            )}
            <h3 className="text-lg font-bold mb-4">Create New Workout Category</h3>
            <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-3 p-2 border border-gray-300 rounded"
            />
            <button
                onClick={handleCreateCategory}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
                Create Category
            </button>

            <h3 className="text-lg font-bold mt-5">Categories</h3>
            {categories.length === 0 ? (
                <p>No categories available.</p>
            ) : (
                categories.map((category) => (
                    <div
                        key={category._id}
                        className="bg-white p-4 border border-gray-300 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                        onClick={() => onCategorySelect(category._id)}  // Category click handler
                    >
                        <img src={category.imageUrl} alt={category.name} className="w-12 h-12 rounded-full mb-3" />
                        <h4 className="font-semibold">{category.name}</h4>
                        <p>{category.description}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default CreateCategory;
