const choo = require('choo');
const html = require('choo/html');
const Tile = require('./Tile.js');


const Category = (props, emit) => html`
<li class="${props.active ? 'active' : ''}">
  <a onclick="${() => emit('NAVIGATE', { params: { category: props.id } })}">${props.name}</a>
</li>
`;


const TileGroup = (props, emit) =>  html`
<div class="row">
  <div class="col-md-2 TileTitle">${props.title}</div>
</div>
<div class="row TileGroup">
  ${props.dataSource.map(t => Tile(t))}
</div>
`;


module.exports = (state, emit) => {
  // console.log(state);
  return html`
  <div class="App container">
    <div class="row">
      <div class="col-md-2 Menu">
        <ul class="nav nav-pills nav-stacked">
          <li class="disabled"><a>CATEGORIES</a></li>
          ${state.categories.map(c => Category({ ...c, active: state.active === c.id }, emit))}
        </ul>
      </div>
      <div class="col-md-10">
        ${TileGroup({ title: 'Fav', dataSource: state.tiles.fav }, emit)}
        ${TileGroup({ title: 'Watch', dataSource: state.tiles.watch }, emit)}
        ${TileGroup({ title: 'Short', dataSource: state.tiles.short }, emit)}
      </div>
    </div>
  </div>
 `;
}
