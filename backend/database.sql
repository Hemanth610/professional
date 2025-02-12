-- Create the database
CREATE DATABASE IF NOT EXISTS recipe_db;

-- Use the database
USE recipe_db;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Recipes table
CREATE TABLE IF NOT EXISTS Recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    userId INT NOT NULL,
    isPublic BOOLEAN DEFAULT FALSE,
    cookingTime VARCHAR(50),
    servings INT,
    category VARCHAR(100),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create SharedRecipes table
CREATE TABLE IF NOT EXISTS SharedRecipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipeId INT NOT NULL,
    sharedByUserId INT NOT NULL,
    sharedWithUserId INT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipeId) REFERENCES Recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (sharedByUserId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (sharedWithUserId) REFERENCES Users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_share (recipeId, sharedByUserId, sharedWithUserId)
);
