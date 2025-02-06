const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createRecipe,
  getUserRecipes,
  getAllPublicRecipes,
  updateRecipe,
  deleteRecipe,
  shareRecipe,
  getSharedRecipes
} = require('../controllers/recipeController');

// Public routes
router.get('/public', getAllPublicRecipes);

// Protected routes
router.use(authenticate);
router.post('/', createRecipe);
router.get('/', getUserRecipes);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

// New sharing routes
router.post('/share', shareRecipe);
router.get('/shared', getSharedRecipes);

module.exports = router;
