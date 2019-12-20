const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull
} = graphql;
require("../models");
const mongoose = require("mongoose");
const UserType = require("./types/user_type");
const RecipeType = require("./types/recipe_type");
const IngredientType = require("./types/ingredient_type")
const Ingredient = mongoose.model("ingredients")
const Recipe = mongoose.model("recipes");
const User = mongoose.model("users");
const AuthService = require("../services/auth.js");

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.register(args);
      }
    },
    logout: {
      type: UserType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args) {
        return AuthService.logout(args);
      }
    },
    login: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    },
    saveRecipe: {
      type: RecipeType,
      args: {
        name: { type: GraphQLString },
        recipeURL: { type: GraphQLString },
        imageURL: { type: GraphQLString },
        calories: { type: GraphQLFloat },
        servings: { type: GraphQLInt },
        ingredients: { type: new GraphQLList(GraphQLString) },
        carbsTotal: { type: GraphQLFloat },
        carbsDaily: { type: GraphQLFloat },
        fatsTotal: { type: GraphQLFloat },
        fatsDaily: { type: GraphQLFloat },
        proteinTotal: { type: GraphQLFloat },
        proteinDaily: { type: GraphQLFloat },
        userId: { type: GraphQLID }
      },
      resolve(_, args) {
        return new Recipe(args).save()
          .then(recipe => {
            User.addRecipe(recipe.userId, recipe._id);
            return recipe;
          })
        }
    },
    removeRecipe: {
      type: RecipeType,
      args: {_id: { type: GraphQLID }},
      resolve(_, { _id }) {
        return Recipe.remove({ _id });
      }
    },
    saveIngredient: {
      type: IngredientType,
      args: {
        name: { type: GraphQLString },
        quantity: { type: GraphQLFloat },
        measureLabel: { type: GraphQLString },
        calories: { type: GraphQLFloat },
        carbsTotal: { type: GraphQLFloat },
        fatsTotal: { type: GraphQLFloat },  
        proteinTotal: { type: GraphQLFloat },
        recipeId: { type: GraphQLID },
        userId: { type: GraphQLID }
      },
      resolve(_, args) {
        return new Ingredient(args).save()
          .then(ingredient => {
            User.addIngredient(ingredient.userId, ingredient._id);
            return ingredient;
          })
        }
    },
    removeIngredient: {
      type: IngredientType,
      args: {_id: { type: GraphQLID }},
      resolve(_, { _id }) {
        return Ingredient.remove({ _id });
      }
    },
  }
});

module.exports = mutation;
