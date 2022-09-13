const choo = require('choo');
const view = require('./view.js');
// const links = require('./links.js');
const model = require('./model')

const app = choo();
app.model(model);

app.router([
  ['/', view],
  // ['/links', links],
]);

// app.use({
//   onStateChange: model.onStateChange
// });

const tree = app.start();
document.body.appendChild(tree);
