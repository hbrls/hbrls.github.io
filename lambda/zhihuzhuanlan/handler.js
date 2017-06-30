'use strict';

const axios = require('axios');
const nunjucks = require('nunjucks');


const TPL = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>知乎专栏-{{ title }}</title>
  <subtitle>{{ subtitle }}</subtitle>
  <link rel="self" href="{{ zhuanlan }}"/>
  <id>{{ zhuanlan }}</id>
  <updated>{{ updated }}</updated>
  <author>
    <name>{{ author }}</name>
    <profile>{{ profile }}</profile>
  </author>
 <category term="zhihuzhuanlan"/>
 {% for p in posts %}
 <entry>
  <title>{{ p.title }}</title>
  <link rel="alternate" href="{{ p.url }}"/>
  <id>{{ p.url }}</id>
  <updated>{{ p.updated }}</updated>
  <content>{{ p.content }}</content>
  <category term="zhihuzhuanlan"/>
  <category term="atom"/>
 </entry>
 {% endfor %}
</feed>`;

// const TPL = `
//   Hello Nunjucks!
// `;


module.exports.feeds = (event, context, callback) => {
  const { pathParameters } = event;
  const { id } = pathParameters;

  const TAGS = /<[^>]*>/g;

  const zhuanlan = `https://zhuanlan.zhihu.com/rendering-fantasy/${id}`;
  const updated = (new Date()).toISOString();

  axios.all([
    axios.get(`https://zhuanlan.zhihu.com/api/columns/${id}`),
    axios.get(`https://zhuanlan.zhihu.com/api/columns/${id}/posts?limit=10`),
  ]).then(axios.spread(function ({ data: info }, { data }) {
      const { name, intro, creator } = info;
      const { name: author, profileUrl: profile } = creator;
      const posts = data.map(({ url, title, content, publishedTime }) => {
        return {
          url: `https://zhuanlan.zhihu.com${url}`,
          title: title,
          content: content.replace(TAGS, '').substring(0, 140),
          updated: publishedTime,
        };
      });

      const response = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
        },
        body: nunjucks.renderString(TPL, {
          author: author,
          profile: profile,
          zhuanlan: zhuanlan,
          title: name,
          subtitle: intro,
          updated: updated,
          posts: posts,
        }),
      };

      callback(null, response);
    }))
    .catch(function (error) {
      console.log('CATCH');
      console.log(error);
      const response = {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error,
          input: event,
        }),
      };

      callback(null, response);
    });
};
