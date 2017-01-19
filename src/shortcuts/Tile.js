const html = require('choo/html');


const Title = (t) => {
  if (t.nologo) {
    return html`<span>${t.id}</span>`;
  } else {
    const logo = `/static/img/logo-${t.id}.png`;
    return html`<img src="${logo}" />`;
  }
};


module.exports = (t) => html`
  <div class="col-md-2 Tile Tile-${t.id}">
    <div class="Tile-outer">
      <div class="Tile-inner">
        <a class="" href="${t.url}" target="_blank">
          ${Title(t)}
        </a>
      </div>
    </div>
  </div>
`;
