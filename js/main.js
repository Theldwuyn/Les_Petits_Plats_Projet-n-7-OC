// Variables
import { arrayOfRecipeObject } from "./globals.js";

// Functions
import { displayFilter } from "./utils/dropdown-filter.js";

export function displayRecipes(arrayOfRecipeObject, keyWordFromSearchBar) {

    const recipesWrapper = document.getElementById("recipes-wrapper");

    //When the function is called multiple times (e.g. by filters function), 
    //empty the page of all recipes before displaying to avoid duplicate
    if (recipesWrapper.hasChildNodes) {
        recipesWrapper.innerHTML = '';
    }

    if (arrayOfRecipeObject.length > 0) {

        arrayOfRecipeObject.forEach((recipeObject) => {
            const recipeCard = recipeObject.getRecipesCard();
            recipesWrapper.appendChild(recipeCard);
        });

        const numberOfRecipes = numberOfRecipesDisplayed(recipesWrapper);
        displayNumberOfRecipes(numberOfRecipes);
        displayFilter(arrayOfRecipeObject);

    } else {
        const errorMessage = document.createElement("p");
        errorMessage.innerText = `Aucune recette ne contient "${keyWordFromSearchBar}", vous pouvez chercher "tartes au pommes", "poisson" etc.`;
        recipesWrapper.appendChild(errorMessage);
    }
}

function numberOfRecipesDisplayed(recipesWrapper) {
    const numberOfRecipes = recipesWrapper.childElementCount;
    return numberOfRecipes;
}

function displayNumberOfRecipes(numberOfRecipes) {
    const recipeNumberDom = document.getElementById("recipesNumber");
    recipeNumberDom.textContent = `${numberOfRecipes} recettes`;
}

displayRecipes(arrayOfRecipeObject);
