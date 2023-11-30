document.addEventListener('DOMContentLoaded', function () {
    const recipeForm = document.getElementById('addRecipeForm');
    const recipeList = document.getElementById('recipe-list');

    recipeForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const recipeName = document.getElementById('recipeName').value;
        const ingredients = document.getElementById('ingredients').value;
        const instructions = document.getElementById('instructions').value;

        if (recipeName && ingredients && instructions) {
            addRecipe(recipeName, ingredients, instructions);
            recipeForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });

    function addRecipe(name, ingredients, instructions) {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        const title = document.createElement('h3');
        title.textContent = name;

        const ingredientList = document.createElement('p');
        ingredientList.textContent = `Ingredients: ${ingredients}`;

        const instructionText = document.createElement('p');
        instructionText.textContent = `Instructions: ${instructions}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Recipe';
        deleteButton.addEventListener('click', function () {
            recipeList.removeChild(recipeCard);
        });

        recipeCard.appendChild(title);
        recipeCard.appendChild(ingredientList);
        recipeCard.appendChild(instructionText);
        recipeCard.appendChild(deleteButton);

        recipeList.appendChild(recipeCard);
    }
});
