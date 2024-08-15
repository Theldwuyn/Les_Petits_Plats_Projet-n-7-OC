export async function getRecipesData() {
    const recipes = await fetch("./database/recipes.json")
                            .then(recipes => recipes.json());
    //console.log(recipes);
    return recipes;
}