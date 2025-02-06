const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, isPublic, cookingTime, servings, category } = req.body;
    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      userId: req.user.id,
      isPublic: isPublic || false,
      cookingTime,
      servings,
      category
    });

    res.status(201).json({
      success: true,
      recipe
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: { userId: req.user.id }
    });

    res.json({
      success: true,
      recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllPublicRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: { isPublic: true },
      include: [{
        model: require('../models/User'),
        attributes: ['username']
      }]
    });

    res.json({
      success: true,
      recipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ingredients, instructions, isPublic, cookingTime, servings, category } = req.body;
    
    const recipe = await Recipe.findOne({
      where: { id, userId: req.user.id }
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    await recipe.update({ 
      title, 
      ingredients, 
      instructions, 
      isPublic, 
      cookingTime, 
      servings, 
      category 
    });

    res.json({
      success: true,
      recipe
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOne({
      where: { id, userId: req.user.id }
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    await recipe.destroy();

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.shareRecipe = async (req, res) => {
  try {
    const { recipeId, sharedWithUserId } = req.body;
    const sharedByUserId = req.user.id;

    // Check if recipe exists and belongs to the user
    const recipe = await Recipe.findOne({
      where: { id: recipeId, userId: sharedByUserId }
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found or you don\'t have permission to share it'
      });
    }

    // Create shared recipe record
    await db.query(
      'INSERT INTO SharedRecipes (recipeId, sharedByUserId, sharedWithUserId) VALUES (?, ?, ?)',
      [recipeId, sharedByUserId, sharedWithUserId]
    );

    res.status(200).json({
      success: true,
      message: 'Recipe shared successfully'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Recipe is already shared with this user'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSharedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get recipes shared with the user
    const sharedRecipes = await db.query(
      `SELECT r.*, u.username as sharedByUsername 
       FROM Recipes r 
       JOIN SharedRecipes sr ON r.id = sr.recipeId 
       JOIN Users u ON sr.sharedByUserId = u.id 
       WHERE sr.sharedWithUserId = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      recipes: sharedRecipes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
