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

/**
 * Remove duplicate from an array of string
 * @param {Array<String>} array 
 * @returns 
 */
function removeDuplicateFromArray(array) {
    /* Usage of flat method to remove any encapsulate array
    i.e. ingredients property of recipe object are arrays, so if I don't flat
    them, i'll have [[array1], [array2], etc...] */
    const cleanArray = [...new Set((array.flat(Infinity))
                                    .map((item) => item.toLowerCase())
                                )];
    return cleanArray;
}

/**
 * 
 * @param {Array} array 
 * @param {Node} parentElement 
 */
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

/**
 * Filter the recipes object by comparing the name property with cards' title
 * @param {Array<Recipes>} array 
 * @returns {Array<Recipes>} 
 */
function getCurrentlyDisplayedRecipes(arrayOfRecipeObject) {
    const allRecipeCardsTitle = document.querySelectorAll(".card-title");
    const arrayOfCurrentDisplayedRecipes = [];

    allRecipeCardsTitle.forEach((title) => {
        arrayOfCurrentDisplayedRecipes.push(...arrayOfRecipeObject.filter(recipe => recipe.name === title.textContent));
    });

    return arrayOfCurrentDisplayedRecipes;
}

const tagRow = document.getElementById("tag")

/**
 * Append a "tag" element to the id="tag" div
 * Called by the event listener on li element in each dropdown menu
 * @param {string} tagText 
 */
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

/**
 * Callback function of event listener on li element inside each dropdown menu
 * Apply all filter (search bar and tags) to be sure to cumulate filters
 * Call displayRecipes after filters are applied
 * @param {Node} e event
 */
function eventHandlerAddTagOnLiElement(e) {
    const tagText = e.target.textContent;
    createTagElement(tagText);
    arrayOfActiveTag.push(tagText);

    const arrayFilteredWithSeachBar = filterRecipeWithSearchBar();
    const arrayFilteredWithTag = filterRecipeWithTag(arrayOfActiveTag);
    const arrayToDisplay = getIntersectionOfArray(arrayFilteredWithSeachBar, arrayFilteredWithTag);

    displayRecipes(arrayToDisplay, searchBar.value);
}


/**
 * Callback function of event listener on close icon of each tag element
 * Remove the tag from the id="tag" div
 * Apply all filter (search bar and tags) to be sure to cumulate filters
 * Call displayRecipes after filters are applied
 * @param {Node} e 
 */
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

/**
 * 
 * @param {Array} array1 
 * @param {Array} array2 
 * @returns 
 */
function getIntersectionOfArray(array1, array2) {
    return array1.filter(a => array2.some(b => b.name === a.name));
}
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
        
        for (let i = 0; i < arrayOfRecipeObject.length; i++) {

            if(arrayOfRecipeObject[i].name.toLowerCase().includes(userKeyWord)) {
                indexSet.add(i);
            }

            for (let k = 0; k < arrayOfRecipeObject[i].ingredients.length; k++) {
                if(arrayOfRecipeObject[i].ingredients[k].ingredient.toLowerCase().includes(userKeyWord)) {
                    indexSet.add(i);
                    break;
                }
            }

            if(arrayOfRecipeObject[i].description.toLowerCase().includes(userKeyWord)) {
                indexSet.add(i);
            }
        }
        arrayOfFilteredRecipe = filterArrayWithSet(arrayOfRecipeObject, indexSet);
        return arrayOfFilteredRecipe;

    } else {
        return arrayOfRecipeObject;
    }
}

/**
 * 
 * @param {Array} array 
 * @param {Set<number>} set 
 * @returns 
 */
function filterArrayWithSet(array, set) {
    let filterArray = [];

    for (const index of set) {
        filterArray.push(array[index]);
    }

    return filterArray;
}
