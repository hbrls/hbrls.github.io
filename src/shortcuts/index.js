const choo = require('choo');
const store = require('./store.js');
const view = require('./view.js');

const app = choo({ history: false, hash: true });

app.use(store);

app.route('*', view);

app.mount('.js-app');
