// Variables
import { arrayOfRecipeObject } from "../globals.js";

// Functions
import { displayRecipes } from "../main.js";

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
    //
//

const tagRow = document.getElementById("tag")

function createTagElement(tagText) {
    const tagWrapper = document.createElement("div");
    tagWrapper.classList.add("col-1");

    const tagElement = document.createElement("div");
    tagElement.classList.add("tagfilter", "bg-primary", "text-start", "rounded-2", "p-2");

    const tagContent = document.createElement("p");
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

let arrayOfActiveTag = [];

function eventHandlerAddTagOnLiElement(e) {
    const tagText = e.target.textContent;
    createTagElement(tagText);
    arrayOfActiveTag.push(tagText);

    const arrayFilteredWithSeachBar = filterRecipeWithSearchBar();
    const arrayFilteredWithTag = filterRecipeWithTag(arrayOfActiveTag);
    const arrayToDisplay = getIntersectionOfArray(arrayFilteredWithSeachBar, arrayFilteredWithTag);

    displayRecipes(arrayToDisplay, searchBar.value);
}

function eventHandlerRemoveTag(e) {
    const tagWrapper = e.target.parentElement.parentElement;
    tagRow.removeChild(tagWrapper);
    const tagContent = e.target.previousSibling.textContent;

    const index = arrayOfActiveTag.indexOf(arrayOfActiveTag
                                    .find((element) => element === tagContent));
    arrayOfActiveTag.splice(index, 1);

    const arrayFilteredWithSeachBar = filterRecipeWithSearchBar();
    const arrayFilteredWithTag = filterRecipeWithTag(arrayOfActiveTag);
    const arrayToDisplay = getIntersectionOfArray(arrayFilteredWithSeachBar, arrayFilteredWithTag);

    displayRecipes(arrayToDisplay, searchBar.value);
}

function getIntersectionOfArray(array1, array2) {
    if (array1.length > array2.length) {
        return array1.filter(a => array2.some(b => b.name === a.name));
    } else {
        return array2.filter(a => array1.some(b => a.name === b.name));
    }
}






//filtrer la liste des objets recipes en fonction des tags actifs
    //récupérer la liste des objets
    //comparer les propriétés des objets avec les tags
    //créer une nouvelle liste d'objet trié
    //appel de la fonction displayRecipes avec la nouvelle liste
/**
 * Return the filtered recipe object array depending on active tags
 * @param {String[]} arrayOfActiveTag 
 * @returns {Recipe[]}
 */
function filterRecipeWithTag(arrayOfActiveTag) {
  
    if(arrayOfActiveTag.length > 0) {

        let arrayOfFilteredRecipe = [];
        let arrayToFilter = arrayOfRecipeObject;
        let indexSet = new Set();

        for (let i = 0; i < arrayOfActiveTag.length; i++) {

            for (let k = 0; k < arrayToFilter.length; k++) {

                for (let m = 0; m < arrayToFilter[k].ingredients.length; m++) {
                    if(arrayToFilter[k].ingredients[m].ingredient
                        .toLowerCase() === arrayOfActiveTag[i]) {
                            indexSet.add(k);
                            break;
                        }
                }

                if(arrayToFilter[k].appliance.toLowerCase() === arrayOfActiveTag[i]) {
                    indexSet.add(k);
                }

                for (let n = 0; n < arrayToFilter[k].ustensils.length; n++) {
                    if(arrayToFilter[k].ustensils[n].toLowerCase() === arrayOfActiveTag[i]) {
                        indexSet.add(k);
                        break;
                    }
                }
            }
            arrayOfFilteredRecipe = filterArrayWithSet(arrayToFilter, indexSet);
            arrayToFilter = arrayOfFilteredRecipe;
        }
        return arrayOfFilteredRecipe;
    
    } else {
        return arrayOfRecipeObject;
    }
}

/************** Search bar **************/

const searchBar = document.querySelector("input[type=text]");

searchBar.addEventListener("keyup", (e) => {
    const arrayFilteredWithSeachBar = filterRecipeWithSearchBar();
    const arrayFilteredWithTag = filterRecipeWithTag(arrayOfActiveTag);
    const arrayToDisplay = getIntersectionOfArray(arrayFilteredWithSeachBar, arrayFilteredWithTag);
    displayRecipes(arrayToDisplay, e.target.value);
});
/**
 * Return a filtered array of Recipe object depending on the keyword
 * typed by user in the form, IF the keyword has at least 3 characters
 * @returns {Recipe[]}
 */
function filterRecipeWithSearchBar() {

    let userKeyWord = searchBar.value.toLowerCase();

    let arrayOfFilteredRecipe = [];
    let indexSet = new Set();

    if (userKeyWord.length > 2) {
        
        arrayOfRecipeObject.forEach(recipe => {

            if(recipe.name.toLowerCase().includes(userKeyWord)) {
                indexSet.add(arrayOfRecipeObject.indexOf(recipe));
            }

            recipe.ingredients.forEach(ingredient => {
                if(ingredient.ingredient.toLowerCase().includes(userKeyWord)) {
                    indexSet.add(arrayOfRecipeObject.indexOf(recipe));
                }
            });

            if(recipe.description.toLowerCase().includes(userKeyWord)) {
                indexSet.add(arrayOfRecipeObject.indexOf(recipe));
            }
        });

        arrayOfFilteredRecipe = arrayOfRecipeObject.filter((recipe, index) => indexSet.has(index));
        return arrayOfFilteredRecipe;

    } else {
        return arrayOfRecipeObject;
    }
}

function filterArrayWithSet(array, set) {
    let filterArray = [];

    for (const index of set) {
        filterArray.push(array[index]);
    }

    return filterArray;
}
