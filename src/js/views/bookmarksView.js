import icons from 'url:../../img/icons.svg';
import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No Bookmarks yet. Find a nice recipe and bookmark it !';
  _message = '';

  addhandlerrender(handler) {
    window.addEventListener('load', handler);
  }
  _generatemarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarksView();
