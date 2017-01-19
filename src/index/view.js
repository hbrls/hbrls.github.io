const choo = require('choo');
const html = require('choo/html');


module.exports = (state, prev, send) => html`
  <div class="container">
    <h1>一念生</h1>
    <h1>一念死</h1>
    <h1>一念善</h1>
    <h1>一念恶</h1>

    <menu>
      <ul class="${state.active}">
        <li><a href="https://hbrls.gitbooks.io/bj/content/" target="_blank">不贱</a></li>
        <li><a href="https://hbrls.gitbooks.io/t2/content/" target="_blank">特二</a></li>
        <li><a href="https://hbrls.gitbooks.io/xx/content/" target="_blank">小鲜</a></li>
      </ul>
    </menu>

    <button class="${state.active}" onclick=${() => send('toggle')}></button>
  </div>
`;
