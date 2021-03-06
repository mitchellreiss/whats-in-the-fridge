const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  savedRecipes: {
    type: Array,
    default: []
  },
  savedIngredients: {
    type: Array,
    default: []
  }
});

UserSchema.statics.addRecipe = (args) => {
  const User = mongoose.model('users');

  return User.findById(args["userId"])
    .then(user => {
      delete args.userId;
      user.savedRecipes.push(args);
      user.save();
      return args;
    })
}

UserSchema.statics.removeRecipe = (args) => {
  const User = mongoose.model('users');
  
  return User.findById(args["userId"])
    .then(user => {
      let recipeKey = args.recipeURL;
      let recipeIdx;
      user.savedRecipes.forEach((recipe,i) => {
        if (recipeKey === recipe.recipeURL) {
          recipeIdx = i; 
        }
      })
      // delete user.savedRecipes[recipeIdx];
      user.savedRecipes.splice(recipeIdx, 1);
      user.save();
      return args;
    })
}

UserSchema.statics.addIngredient = (args) => {
  const User = mongoose.model('users');

  return User.findById(args["userId"])
    .then(user => {
      delete args.userId;
      user.savedIngredients.push(args);
      user.save();
      return args;
    })
}

UserSchema.statics.removeIngredient = (args) => {
  const User = mongoose.model('users');

  return User.findById(args["userId"])
    .then(user => {
      let ingredientKey = args.name;
      let ingredientIdx; 

      user.savedIngredients.forEach((ingredient, i) => {
        if (ingredientKey === ingredient.name) {
          ingredientIdx = i;
        }
      })
      
      user.savedIngredients.splice(ingredientIdx, 1);
      return user.save();
      // console.log(user);
      // return args;
      // delete user.savedRecipes.ingredientKey;
      // return user.save();
    })
}

module.exports = mongoose.model("users", UserSchema);
