import Application from '@head/edge';
import $http from '@head/http';
import yaml from 'js-yaml';


const { router, client } = new Application();


// router.verb('router-name', 'path-match', middleware1, ..., middlewareN, controller.action);
router.verb('GET', '/shortcuts/api/categories', async (ctx, next) => {
  // console.log(ctx, next);
  const { data: yamlformat } = await $http.get(`/api/shortcuts-categories.yaml`);
  const data = yaml.load(yamlformat);
  ctx.body = { code: 0, message: 'ok', data };
  next();
});


router.verb('GET', '/shortcuts/api/categories/:id/collections', async (ctx, next) => {
  // console.log(ctx, next);
  const { id } = ctx.params;

  const { data: yamlformat } = await $http.get(`/api/shortcuts-categories-${id}.yaml`);
  const data = yaml.load(yamlformat);

  if (!data.fav) {
    const pretty = { fav: [], watch: [], short: [] };
    data.forEach((c) => {
      if (c.label === 'fav') {
        pretty.fav.push(c);
      } else if (c.label === 'watch') {
        pretty.watch.push(c);
      } else if (c.label === 'short') {
        pretty.short.push(c);
      }
    });
    ctx.body = { code: 0, message: 'ok', data: pretty };
  } else {
    ctx.body = { code: 0, message: 'ok', data };
  }

  next();
});


export default client;
