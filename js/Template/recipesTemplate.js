export class Recipes {
    constructor(data) {
        this.id = data.id;
        this.image = data.image;
        this.name = data.name;
        this.ingredients = data.ingredients;
        this.time = data.time;
        this.description = data.description;
        this.appliance = data.appliance;
        this.ustensils = data.ustensils;
    }

    getRecipesCard() {
        const recipeCol = document.createElement("div");
        recipeCol.classList.add("col-4");

        const recipeCard = document.createElement("div");
        recipeCard.classList.add("card");

        const recipeImg = document.createElement("img");
        recipeImg.setAttribute("src", `assets/recipes/${this.image}`);
        recipeImg.classList.add("card-img-top");
        recipeImg.classList.add("object-fit-cover")
        recipeCard.appendChild(recipeImg);

        const recipeCardBody = document.createElement("div");
        recipeCardBody.classList.add("card-body");
        const bodyContent = `
            <h3 class="card-title mb-5 fs-5">${this.name}</h3>
            <h4 class="card-subtitle mb-3 fs-6 fw-bold">Recette</h4>
            <p class="card-text">${this.description}</p>
            <h4 class="card-subtitle mt-4 mb-3 fs-6 fw-bold">Ingrédients</h4>
            `;
        recipeCardBody.innerHTML = bodyContent;
        
        const ingredientList = this.getIngredientListDom();
        recipeCardBody.appendChild(ingredientList);

        recipeCard.appendChild(recipeCardBody);
        recipeCol.appendChild(recipeCard);

        return recipeCol;
    }

    getIngredientListDom() {
        const ingredientList = document.createElement("div");
        ingredientList.classList.add("row");

        this.ingredients.forEach(ingredient => {
            const ingredientWrapper = document.createElement("div");
            ingredientWrapper.classList.add("col-6");

            const ingredientName = document.createElement("h5");
            ingredientName.classList.add("fs-6");

            ingredientName.textContent = ingredient.ingredient;
            ingredientWrapper.appendChild(ingredientName);

            if(ingredient.quantity) {
                const ingredientQuantity = document.createElement("p");

                if(ingredient.unit) {
                    ingredientQuantity.textContent = `${ingredient.quantity} ${ingredient.unit}`;
                } else {
                    ingredientQuantity.textContent = `${ingredient.quantity}`;
                }

                ingredientWrapper.appendChild(ingredientQuantity);
            }
           
            ingredientList.appendChild(ingredientWrapper);
        });

        return ingredientList;
    }
}