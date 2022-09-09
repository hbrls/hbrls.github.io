import Application from '@head/edge';
import $http from '@head/http';
import yaml from 'js-yaml';


const { router, client } = new Application();


// router.verb('router-name', 'path-match', middleware1, ..., middlewareN, controller.action);
router.verb('GET', '/resume/api/:lang', async (ctx, next) => {
  // console.log(ctx, next);
  const { lang } = ctx.params;
  const { data: yamlformat } = await $http.get(`/api/resume-${lang}.yaml`);
  const data = yaml.load(yamlformat);
  ctx.body = { code: 0, message: 'ok', data };
  next();
});


export default client;
