import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  /**
   * Render the received object to the DOM
   * @param {object | object[]} data the data to be rendered e.g Recipe
   * @param {boolean} [render=true] If false , create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is retured if render is false
   * @this {Object} View instance
   * @author Ruhul
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generatemarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generatemarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));
    newElement.forEach((newEl, i) => {
      const curEl = curElement[i];
      //Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        //console.log('🔥', newEl.firstChild.nodeValue);
        curEl.textContent = newEl.textContent;
      }
      //Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderspinner() {
    const markup = `
        <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}!</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}!</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
