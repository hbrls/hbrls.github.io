const choo = require('choo');
const html = require('choo/html');
const Tile = require('./Tile.js');


const Category = (props, emit) => html`
  <li class="${props.active ? 'active' : ''}">
    <a onclick="${() => emit('CHANGE_CATEGORY', props.id)}">${props.id}</a>
  </li>
`;


module.exports = (state, emit) => html`
  <div class="container js-app">
    <div className="row">
      <div className="col-md-2 Menu">
        <ul className="nav nav-pills nav-stacked">
          <li className="disabled"><a>CATEGORIES</a></li>
          ${state.categories.map(c => Category({ id: c, active: state.active === c }, emit))}
        </ul>
      </div>
      <div className="col-md-10">
        <div className="row TileGroup">
          ${state.tiles.map(t => Tile(t))}
        </div>
      </div>
    </div>
  </div>
`;
