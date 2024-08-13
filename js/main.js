import { getRecipesData } from "./API/api.js";
import { Recipes } from "./Template/recipesTemplate.js";

//Récupérer les données
//Créer les objets recipes
//Créer les éléments dom pour chaque recette
//ajouter les éléments dom au html

async function main() {
    const {recipes} = await getRecipesData();
    displayRecipes(recipes);
}

async function displayRecipes(recipes) {
    console.log(recipes.length);
    const recipesWrapper = document.getElementById("recipes-wrapper");
    recipes.forEach((recipe) => {
        const recipeObject = new Recipes(recipe);
        const recipeCard = recipeObject.getRecipesCard();
        recipesWrapper.appendChild(recipeCard);
    });

    const numberOfRecipes = numberOfRecipesDisplayed(recipesWrapper);
    displayNumberOfRecipes(numberOfRecipes);
}

function numberOfRecipesDisplayed(recipesWrapper) {
    const numberOfRecipes = recipesWrapper.childElementCount;
    return numberOfRecipes;
}

function displayNumberOfRecipes(numberOfRecipes) {
    const recipeNumberDom = document.getElementById("recipesNumber");
    recipeNumberDom.textContent = `${numberOfRecipes} recettes`;
}

main();
