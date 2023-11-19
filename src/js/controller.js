import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import pageinationView from './views/pageinationView.js';
import AddrecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import View from './views/View.js';

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
console.log('Forkify');

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    //spinner
    recipeView.renderspinner();

    //0. update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    //1.Upadting bookmark's view
    bookmarksView.update(model.state.bookmarks);

    //2.Load recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //3.Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderspinner();

    //1.Get serach query
    const query = searchView.getQuery();
    if (!query) return;

    //2.load serach results
    await model.loadSearchResult(query);

    //3. Render results
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4 render the initial pagination buttons
    pageinationView.render(model.state.search);
  } catch (err) {
    console.log(err);
    //recipeView.renderError();
  }
};
const controlPagination = function (gotoPage) {
  //1. Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  //2. render new pagination buttons
  pageinationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1. Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. Update recipeView
  recipeView.update(model.state.recipe);

  //3.Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const contronAddRecipe = async function (newRecipe) {
  try {
    //showing loading spinner
    AddrecipeView.renderspinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render the new recipe
    recipeView.render(model.state.recipe);

    //Display Success message
    AddrecipeView.renderMessage();

    //Render the bookmark view
    bookmarksView.addhandlerrender(model.state.bookmarks);

    //Change ID in the URl
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close upload recipe form window
    setTimeout(function () {
      AddrecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😭😭', err);
    AddrecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the Application.New Featue of applicatio.');
};
const init = function () {
  bookmarksView.addhandlerrender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  pageinationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  AddrecipeView.addhandlerUpload(contronAddRecipe);
  newFeature();
};
init();
