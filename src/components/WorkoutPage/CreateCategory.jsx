import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateCategory = ({ onCategoryCreated }) => {
    const [categoryName, setCategoryName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateCategory = async () => {
        if (!categoryName.trim()) {
            alert('Please enter a category name.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/workout/createCategory', {
                name: categoryName.trim(),
                description: description.trim(),
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
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateCategory}>Create Category</button>
        </div>
    );
};

export default CreateCategory;
