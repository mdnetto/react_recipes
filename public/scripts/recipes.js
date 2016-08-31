var RecipeIngredients = React.createClass({
  initialiseIngredientOnEnter: function(e) {
		if (e.keyCode == 13) {
			e.preventDefault() //prevent it from doign it's own thing
		    this.props.initialiseIngredient();
		}
  },
  render: function () {
	var that = this;
    return (
      <div className='recipeIngredients'>
        <h1>Ingredients</h1>
			{this.props.ingredients.map(function(ingredient, i) {
			    return(
					<p key={i}>
						<input autoFocus
						type='text'
						value={ingredient.name}
					    onChange={function(e) {that.props.handleIngredientNameEdit(e.target.value, i)}}
					    onKeyDown={that.initialiseIngredientOnEnter}
						/>
					</p>
			   )})
		    }
      </div>
    )
  }
})	

var RecipeBox = React.createClass({ // eslint-disable-line no-undef
  loadRecipesFromServer: function () {
    $.ajax({ // eslint-disable-line no-undef
      url: this.props.recipes_url,
      dataType: 'json',
      cache: false,
      success: function (recipes) {
        this.setState({recipes: recipes})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.recipes_url, status, err.toString())
      }.bind(this)
    })
  },
  handleRecipeSubmit: function (recipe) {
    $.ajax({// eslint-disable-line no-undef
      url: this.props.recipes_url,
      dataType: 'json',
      type: 'POST',
      data: recipe,
      success: function (recipes) {
        this.setState({recipes: recipes})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.recipes_url, status, err.toString())
      }.bind(this)
    })
  },
  getInitialState: function () {
    return {recipes: []}
  },
  componentDidMount: function () {
    this.loadRecipesFromServer()
    setInterval(this.loadRecipesFromServer, this.props.pollInterval)
  },
  render: function () {
    return (
      <div className='recipeBox'>
        <h1>Recipes</h1>
        <RecipeForm onRecipeSubmit={this.handleRecipeSubmit} categories_url='api/categories' units_url='api/units' />
        <RecipeList data={this.state.recipes} />
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

var RecipeForm = React.createClass({// eslint-disable-line no-undef
  loadUnitsFromServer: function () {
    $.ajax({// eslint-disable-line no-undef
      url: this.props.units_url,
      dataType: 'json',
      cache: false,
      success: function (units) {
        this.setState({units: units})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.units_url, status, err.toString())
      }.bind(this)
    })
  },
  loadCategoriesFromServer: function () {
    $.ajax({// eslint-disable-line no-undef

      url: this.props.categories_url,
      dataType: 'json',
      cache: false,
      success: function (categories) {
        this.setState({categories: categories})
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.categories_url, status, err.toString())
      }.bind(this)
    })
  },
  getInitialState: function () {
    return {name: '', category: '', ingredients: [{name: '', unit: '', quantity: ''}]} 
  },
  componentWillMount: function () {
    this.loadUnitsFromServer()
    this.loadCategoriesFromServer()
  },
  handleTextChange: function (e) {
    this.setState({[e.target.name]: e.target.value})
  },
  initialiseIngredient: function() {
		var ingredients = this.state.ingredients;
		ingredients.push({name: '', quantity: '', unit: ''});
		this.setState({ingredients:  ingredients});
  },
  handleIngredientNameEdit: function(name, i) {
	  var ingredients = this.state.ingredients;
	  ingredients[i].name = name;
	  this.setState({ingredients:  ingredients});
  },
  handleSubmit: function (e) {
    e.preventDefault()
    var name = this.state.name.trim()
    var category = this.state.category.trim()
    var ingredients = this.state.ingredients
    if (!name || !category || !ingredients) {
      return
    }
	  
    this.props.onRecipeSubmit({name: name, category: category, ingredients: ingredients}) 
    this.setState(this.getInitialState()) 
  },
  renderCategories: function () {
    if (this.state.categories) {
      return this.state.categories.map(function (category, i) {
        return <option key={i} value={category}>{category}</option>
      })
    }
  },
  render: function () {
    return (
      <form className='recipeForm' onSubmit={this.handleSubmit}>
        <input
          name='name'
          type='text'
          placeholder='Recipe name'
          value={this.state.name}
          onChange={this.handleTextChange}/>
        <select
          name='category'
          placeholder='Select a category'
          value={this.state.category}
          onChange={this.handleTextChange}>
		  <option>Select a category</option>
          {this.renderCategories()}
        </select>
		<RecipeIngredients ingredients={this.state.ingredients} initialiseIngredient={this.initialiseIngredient} handleIngredientNameEdit={this.handleIngredientNameEdit} />
		<br></br>
		<br></br>
        <input type='submit' value='Post' />
      </form>
    )
  }
})

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

var recipeHeading = {
	color: '#657b83'
};

ReactDOM.render(// eslint-disable-line no-undef
  <RecipeBox recipes_url='api/recipes' pollInterval={2000} />,
  document.getElementById('content')
)
