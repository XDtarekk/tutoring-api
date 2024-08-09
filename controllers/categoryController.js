const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new Category({
      name,
      description,
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
