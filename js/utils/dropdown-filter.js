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

        /* For loop to iterate through all active tags */
        for (let i = 0; i < arrayOfActiveTag.length; i++){

            let arrayMapIngredient = arrayToFilter.map(item => item.ingredients);
            let arrayMapAppliance = arrayToFilter.map(item => item.appliance);
            let arrayMapUstensil = arrayToFilter.map(item => item.ustensils);

            /* Usage of a set to avoid duplicate value */
            let indexSet = new Set();

            //filtre ingrédient
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
                    
                    /* While loop to find all repetition of "elem" in the array
                    because indexOf return the first index at which a given 
                    element can be found in the array or -1 if it is not present */
                    while(idx != -1) {
                        indexSet.add(idx);

                        /* indexOf(searchElement, fromIndex) */
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

    const mapName = arrayOfRecipeObject.map(elem => elem.name);
    const mapIngredient = arrayOfRecipeObject.map(elem => elem.ingredients);
    const mapDescription = arrayOfRecipeObject.map(elem => elem.description);

    if (userKeyWord.length > 2) {
        
        for (let i = 0; i < arrayOfRecipeObject.length; i++) {

            for (let j = 0; j < mapName.length; j++) {
                if(mapName[j].toLowerCase().includes(userKeyWord)) {
                    indexSet.add(j);
                }
            }

            for (let k = 0; k < mapIngredient.length; k++) {
                for(let m = 0; m < mapIngredient[k].length; m++) {
                    if(mapIngredient[k][m].ingredient.toLowerCase().includes(userKeyWord)) {
                        indexSet.add(k);
                    }
                }
            }

            for (let m = 0; m < mapDescription.length; m++) {
                if(mapDescription[m].toLowerCase().includes(userKeyWord)) {
                    indexSet.add(m);
                }
            }
        }
        arrayOfFilteredRecipe = arrayOfRecipeObject.filter((recipe, index) => indexSet.has(index));
        return arrayOfFilteredRecipe;

    } else {
        return arrayOfRecipeObject;
    }
}
