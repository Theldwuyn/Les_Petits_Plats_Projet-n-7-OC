import { createRecipesObjectArray } from "./Template/recipesTemplate.js";
import { displayFilter } from "./utils/dropdown-filter.js";

//Récupérer les données
//Créer les objets recipes
//Créer les éléments dom pour chaque recette
//ajouter les éléments dom au html

async function main() {
    const arrayOfRecipeObject = await createRecipesObjectArray();
    displayRecipes(arrayOfRecipeObject);
}

export async function displayRecipes(arrayOfRecipeObject) {

    const recipesWrapper = document.getElementById("recipes-wrapper");

    if (recipesWrapper.hasChildNodes) {
        recipesWrapper.innerHTML = '';
    }

    arrayOfRecipeObject.forEach((recipeObject) => {
        const recipeCard = recipeObject.getRecipesCard();
        recipesWrapper.appendChild(recipeCard);
    });

    const numberOfRecipes = numberOfRecipesDisplayed(recipesWrapper);
    displayNumberOfRecipes(numberOfRecipes);
    displayFilter(arrayOfRecipeObject);
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
