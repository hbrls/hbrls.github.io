module.exports = {
  state: {
    active: '',
  },

  reducers: {
    toggle: (state, payload) => ({
      active: state.active ? '' : 'active',
    }),
  },
};
