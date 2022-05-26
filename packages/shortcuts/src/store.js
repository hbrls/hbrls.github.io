const $client = require('./service').default;


async function init() {
  const { data } = await $client.get('/shortcuts/api/categories');
  return data;
}


async function load(category) {
  const { data } = await $client.get(`/shortcuts/api/categories/${category}/collections`);
  return data;
}


module.exports = (state, emitter) => {
  state.categories = [];
  state.active = null;
  state.tiles = { fav: [], watch: [], short: [] };

  emitter.on('NAVIGATE', ({ params }) => {
    // console.log('on.NAVAGATE', state, params);
    const { category } = params;
    load(category).then((data) => {
      // console.log('load', data);
      state.active = category;
      state.tiles = data;
      emitter.emit('render');
    });
  })

  emitter.on('DOMContentLoaded', () => {
    // console.log('on.DOMContentLoaded', state);
    init().then((categories) => {
      // console.log(categories);
      state.categories = categories;
      const defaultCategory = categories[0].id;
      state.active = defaultCategory;
      load(defaultCategory).then((data) => {
        state.tiles = data;
        emitter.emit('render');
      });
    });
  });
};
