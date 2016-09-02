var Recipe = React.createClass({// eslint-disable-line no-undef
  render: function () {
    return (
      <div className='recipe'>
        <h2 className='recipeName' style={recipeHeading}>
          {this.props.name}
        </h2>
        <p className='recipeCategory'>
          {this.props.category}
        </p>
        <ul>
          {this.props.ingredients.map(function (ingredient, i) {
            return <li key={i}>{ingredient.quantity} {ingredient.unit}, {ingredient.name} </li>
          })}
        </ul>
          {this.props.method}
      </div>
    )
  }
})

var RecipeList = React.createClass({// eslint-disable-line no-undef
  render: function () {
    var recipes = _.orderBy(this.props.data, ['id'], ['desc'])// eslint-disable-line no-undef
    var recipeNodes = recipes.map(function (recipe) {
      return (
        <Recipe
		  image={recipe.image}
          name={recipe.name}
          key={recipe.id}
          category={recipe.category}
          ingredients={recipe.ingredients}
          method={recipe.method}
        />
      )
    })
    return (
      <div className='recipeList'>
        {recipeNodes}
      </div>
    )
  }
})
