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
				  )
				})}
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
		<RecipeIngredients 
			ingredients={this.state.ingredients} 
			initialiseIngredient={this.initialiseIngredient} 
			handleIngredientNameEdit={this.handleIngredientNameEdit}
		/>
		<br></br>
		<br></br>
        <input type='submit' value='Post' />
      </form>
    )
  }
})
