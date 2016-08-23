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
    var recipes = _.orderBy(this.props.data, ['id'], ['desc']);
    var recipeNodes = recipes.map(function (recipe) {
      return (
        <Recipe
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
    return {name: '', category: '', ingredients: ''}
  },
  componentWillMount: function () {
    this.loadUnitsFromServer()
    this.loadCategoriesFromServer()
  },
  handleTextChange: function (e) {
    this.setState({[e.target.name]: e.target.value})
  },
  handleSubmit: function (e) {
    e.preventDefault()
    var name = this.state.name.trim()
    //var ingredients = this.state.ingredients.trim()
    var category = this.state.category.trim()
    if (!name || !category) {
      return
    }
    this.props.onRecipeSubmit({name: name, category: category})
    this.setState({name: '', category: ''})
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
          onChange={this.handleTextChange}
        />
        <select
          name='category'
          placeholder='Select a category'
          value={this.state.category}
          onChange={this.handleTextChange}
        >
          {
          this.renderCategories()
          }
        </select>
        <input
          name='ingredients'
          type='text'
          placeholder='Ingredients'
          value={this.state.ingredients}
          onChange={this.handleTextChange}
        />
        <input type='submit' value='Post' />
      </form>
    )
  }
})

var Recipe = React.createClass({// eslint-disable-line no-undef
  render: function () {
    return (
      <div className='recipe'>
        <h2 className='recipeName'>
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

ReactDOM.render(// eslint-disable-line no-undef
  <RecipeBox recipes_url='api/recipes' pollInterval={2000} />,
  document.getElementById('content')
)
