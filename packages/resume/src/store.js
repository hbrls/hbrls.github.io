const $client = require('./service').default;


async function load(lang) {
  const { data } = await $client.get(`/resume/api/${lang}`);
  return data;
}


module.exports = (state, emitter) => {
  state.data = {};

  // emitter.on('NAVIGATE', ({ params }) => {
  //   // console.log('on.NAVAGATE', state, params);
  //   const { category } = params;
  //   load(category).then((data) => {
  //     // console.log('load', data);
  //     state.active = category;
  //     state.tiles = data;
  //     emitter.emit('render');
  //   });
  // })

  emitter.on('DOMContentLoaded', () => {
    // console.log('on.DOMContentLoaded', state);
    const defaultLang = 'zh';
    load(defaultLang).then((data) => {
      state.data = data;
      emitter.emit('render');
    });
  });
};
