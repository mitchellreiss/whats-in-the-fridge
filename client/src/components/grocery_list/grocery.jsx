import React, { Component } from 'react'
import { Query, ApolloConsumer } from "react-apollo";
import GroceryList from './grocery_list'
import SavedRecipesList from './saved_recipes';
import queries from '../../graphql/queries';
const { CURRENT_USER, GET_CURRENT_USER_INGREDIENTS, GET_INGREDIENT } = queries;

class Grocery extends Component{
  constructor(props) {
    super(props);
    this.state = {
      savedIngredients: [],
      currentUserId: null,
      loading: true
    }
  }
  render(){
    return (
    <ApolloConsumer>
      {(client) => {
        if (!this.state.currentUserId) {
          client.query({query: CURRENT_USER})
            .then(data => {
              this.setState({currentUserId: data.data.currentUser, loading: false})
            }
          )
        }
        if (this.state.loading) return console.log("Loading...")
        return (
          <div className="grocery-container">
            <GroceryList currentUserId={this.state.currentUserId}/>
            <SavedRecipesList currentUserId={this.state.currentUserId}/>
          </div>
        )
      }
    }
    </ApolloConsumer>
  )}
}

export default Grocery;