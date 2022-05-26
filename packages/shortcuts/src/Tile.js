const html = require('choo/html');


const Title = (props) => {
  const icon = props.icon || 'progress-question';
  return html`<span><i class="mdi mdi-${icon}"></i>${props.id}</span>`;
};


module.exports = (props) => html`
  <div class="col-md-2 Tile Tile-${props.id}">
    <div class="Tile-outer">
      <div class="Tile-inner">
        <a class="" href="${props.url}" target="_blank">
          ${Title(props)}
        </a>
      </div>
    </div>
  </div>
`;
