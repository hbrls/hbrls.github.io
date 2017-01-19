module.exports = (state, bus) => {
  state.categories = [];
  state.active = null;
  state.tiles = [];

  bus.on('CHANGE_CATEGORY', (active) => {
    state.active = active;
    state.tiles = state._data[state.active];
    bus.emit('render');
  });

  bus.on('DOMContentLoaded', (...args) => {
    fetch('/static/js/public.json').then(resp => resp.json()).then((data) => {
      state.categories = Object.keys(data);
      state.active = state.categories[0];
      state.tiles = data[state.active];
      state._data = data;
      bus.emit('render');
    });
  });
};
