import { displayRecipes } from "../main.js";
import { createRecipesObjectArray } from "../Template/recipesTemplate.js";

const ingredientDropdown = document.getElementById("ingredient-filter");
const applianceDropdown = document.getElementById("appliance-filter");
const ustensilDropdown = document.getElementById("ustensils-filter");

/**
 * Function called by displayRecipes()
 * Update all dropdown menu with current recipes property
 * @param {Recipes[]} arrayOfRecipeObject 
 */
export function displayFilter(arrayOfRecipeObject) {

    let arrayOfIngredients = [];
    let arrayOfAppliance = [];
    let arrayOfUstensils = [];

    const arrayOfCurrentDisplayedRecipes = getCurrentlyDisplayedRecipes(arrayOfRecipeObject);

    arrayOfCurrentDisplayedRecipes.forEach((recipeObject) => {
        arrayOfIngredients.push(recipeObject.getIngredients());
        arrayOfAppliance.push(recipeObject.getAppliance());
        arrayOfUstensils.push(recipeObject.getUstensils());
    });

    const cleanArrayOfIngredients = removeDuplicateFromArray(arrayOfIngredients);
    const cleanArrayOfAppliance = removeDuplicateFromArray(arrayOfAppliance);
    const cleanArrayOfUstensils = removeDuplicateFromArray(arrayOfUstensils);

    appendLiElementToDropdownMenu(cleanArrayOfIngredients, ingredientDropdown);
    appendLiElementToDropdownMenu(cleanArrayOfAppliance, applianceDropdown);
    appendLiElementToDropdownMenu(cleanArrayOfUstensils, ustensilDropdown);
}

function removeDuplicateFromArray(array) {
    const cleanArray = [...new Set((array.flat(Infinity))
                                    .map((item) => item.toLowerCase())
                                )];
    return cleanArray;
}

function appendLiElementToDropdownMenu(array, parentElement) {
    if (parentElement.hasChildNodes()) {
        parentElement.innerHTML = '';
    }
    array.forEach((item) => {
        const liElement = document.createElement("li");
        liElement.classList.add("dropdown-item");
        liElement.textContent = item;
        liElement.addEventListener("click", eventHandlerAddTagOnLiElement);
        parentElement.appendChild(liElement);
    });
}

function getCurrentlyDisplayedRecipes(arrayOfRecipeObject) {
    const allRecipeCardsTitle = document.querySelectorAll(".card-title");
    const arrayOfCurrentDisplayedRecipes = [];

    allRecipeCardsTitle.forEach((title) => {
        arrayOfCurrentDisplayedRecipes.push(...arrayOfRecipeObject.filter(recipe => recipe.name === title.textContent));
    });

    return arrayOfCurrentDisplayedRecipes;
}

//event listener sur chaque li
    //récupérer valeur texte du li cliqué

    //créer l'élément DOM du tag

    //ajouter le tag au document

    //filtrer les recettes en fonction du/des tags
        //manipuler la liste des objets recette
        //appel de la fonction displayRecipes avec nouvelle liste d'objet

let arrayOfActiveTag = [];

function eventHandlerAddTagOnLiElement(e) {
    const tagText = e.target.textContent;
    createTagElement(tagText);
    arrayOfActiveTag.push(tagText);
    filterRecipeWithTag(arrayOfActiveTag);
    //console.log(arrayOfActiveTag);
}

function eventHandlerRemoveTag(e) {
    const tagWrapper = e.target.parentElement.parentElement;
    tagRow.removeChild(tagWrapper);
    const tagContent = e.target.previousSibling.textContent;
    const index = arrayOfActiveTag.indexOf(arrayOfActiveTag
                                    .find((element) => element === tagContent));
    arrayOfActiveTag.splice(index, 1);
    filterRecipeWithTag(arrayOfActiveTag);
    //console.log(arrayOfActiveTag);
}

const tagRow = document.getElementById("tag")

function createTagElement(tagText) {
    const tagWrapper = document.createElement("div");
    tagWrapper.classList.add("col-1");

    const tagElement = document.createElement("div");
    tagElement.classList.add("tagfilter", "bg-primary", "text-start", "rounded-2", "p-2");

    const tagContent = document.createElement("span");
    tagContent.classList.add("align-text-bottom", "m-0");
    tagContent.textContent = tagText;

    const tagIcon = document.createElement("span");
    tagIcon.classList.add("tagfilter__icon", "fa-solid", "fa-xmark");
    tagIcon.addEventListener("click", eventHandlerRemoveTag);

    tagElement.appendChild(tagContent);
    tagElement.appendChild(tagIcon);
    tagWrapper.appendChild(tagElement);
    tagRow.appendChild(tagWrapper);
}



const arrayOfRecipes = await createRecipesObjectArray();

//filtrer la liste des objets recipes en fonction des tags actifs
    //récupérer la liste des objets
    //comparer les propriétés des objets avec les tags
    //créer une nouvelle liste d'objet trié
    //appel de la fonction displayRecipes avec la nouvelle liste

function filterRecipeWithTag(arrayOfActiveTag) {
  
    if(arrayOfActiveTag.length > 0) {

        let arrayOfFilteredRecipe = [];
        let arrayToFilter = arrayOfRecipes;

        for (let i = 0; i < arrayOfActiveTag.length; i++){
            console.log(arrayToFilter);

            let arrayMapIngredient = arrayToFilter.map(item => item.ingredients);
            let arrayMapAppliance = arrayToFilter.map(item => item.appliance);
            let arrayMapUstensil = arrayToFilter.map(item => item.ustensils);

            //filtre ingrédient
            let indexSet = new Set();
            arrayMapIngredient.forEach(elem => {
                elem.forEach(item => {
                    if(arrayOfActiveTag[i] === item.ingredient.toLowerCase()) {
                        indexSet.add(arrayMapIngredient.indexOf(elem));
                    }
                });
            });

            //filtre appliance
            arrayMapAppliance.forEach(elem => {
                if(arrayOfActiveTag[i] === elem.toLowerCase()) {
                    var idx = arrayMapAppliance.indexOf(elem);
                    indexSet.add(idx);
                    while(idx != -1) {
                        indexSet.add(idx);
                        idx = arrayMapAppliance.indexOf(elem, idx + 1);
                    }
                }
            });

            //filtre ustensils
            arrayMapUstensil.forEach(elem => {
                elem.forEach(item => {
                    if(arrayOfActiveTag[i] === item.toLowerCase()) {
                        indexSet.add(arrayMapUstensil.indexOf(elem));
                    }
                });
            });

            arrayOfFilteredRecipe = arrayToFilter.filter((recipe, index) => indexSet.has(index));
            arrayToFilter = arrayOfFilteredRecipe;
        }
        displayRecipes(arrayOfFilteredRecipe);
    
    } else {
        displayRecipes(arrayOfRecipes);
    }
}
