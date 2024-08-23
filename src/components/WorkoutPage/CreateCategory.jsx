import React, { useState } from 'react';
import axios from 'axios';
import image from './Equipment Sign.png'; // Replace with your designated image path
const baseURL = 'http://localhost:8080/' || 'https://habits-development.netlify.app/';

const CreateCategory = ({ onCategoryCreated }) => {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            alert('Please enter a category name.');
            return;
        }

        try {
            const response = await axios.post(`${baseURL}api/workout/createCategory`, {
                name: categoryName.trim(),
                description: description.trim(),
                imageUrl: image,  // Automatically use the designated image URL
            });
            alert('Category created successfully');
            onCategoryCreated(); // Refresh the category list in the parent component
            setCategoryName('');
            setDescription('');
        } catch (error) {
            alert('Error creating category: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div>
            <h3>Create New Workout Category</h3>
            <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
            />
            

            

            <button onClick={handleCreateCategory}>Create Category</button>
        </div>
    );
};

export default CreateCategory;
/*
<input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
*/