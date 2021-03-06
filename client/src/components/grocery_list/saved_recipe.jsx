import React from "react";
import { Mutation } from "react-apollo";
import mutations from "../../graphql/mutations";
import queries from "../../graphql/queries";

const { REMOVE_RECIPE } = mutations;
const { GET_CURRENT_USER_RECIPES } = queries;


const SavedRecipe = ({ recipe, currentUserId }) => {
  let calories = Math.round(recipe.calories);
  return <li className="saved-recipe-li">

      <div className="left-side">
        <div className="recipe-name">{recipe.name}</div>
        <div className="recipe-info">{calories} Calories</div>
        <div className="recipe-info">{recipe.servings} Servings</div>
        <div className="buttons-parallel">
          <a href={recipe.recipeURL} className="reset-margin-padding" target="_blank" rel="noopener noreferrer">
            <button id="icon-btn"><i className="fas fa-external-link-alt"></i></button>
          </a>
        <div className="recipe-url-button">
        <Mutation mutation={REMOVE_RECIPE}
        refetchQueries={() => {
          return [{
             query: GET_CURRENT_USER_RECIPES,
             variables: { id: currentUserId }
          }];
        }}>
          {(removeRecipe) => (
            <button id="icon-btn"
              onClick={() => {
                removeRecipe({
                  variables: {
                    recipeURL: recipe.recipeURL,
                    userId: currentUserId
                  }
                }).catch((err => {
                  console.log(err);
                }))
              }}
            >
              <i className="fas fa-trash"></i>
        </button>
          )}
        </Mutation>
        </div>
        </div>
      </div>  
      <div className="strong-side">
        <div className="recipe-image">
          <img src={recipe.imageURL} alt="" />
        </div>
      </div>
  </li>

};

export default SavedRecipe;