---
layout: post
category : app
tags : [alice, arale, seajs, spm]
title: "五分钟上手 Alice Sea.js spm2 Arale"
---
{% include JB/setup %}

> 背景资料：

> 看这篇文章之前你应该从意识形态上理解这篇[《前端模块化开发的价值》](https://github.com/seajs/seajs/issues/547)；当然，看了标题你还愿意看下去的话，估计相关概念你都有了。

> 工作中主要负责 `js`，业余做做全端，关键词是 `Bootstrap`, `jQuery`, `Backbone`, `RequireJS`。于是就想到国内有没有类似的呢，找着找着就找到了 `Alice`, `Arale`, `spm2`, `Sea.js`。当然还有其它很多靠谱的项目，我就不一一列举它们的名字了。那么为什么决定深究这个系列呢？因为这几样东西放在一起根本不是`解决方案`，而是`生态`。国内外看看，好像没有其他人在做`生态`吧，那么就决定是你了！

> 本文重点在于如何在（已有）项目中 5 分钟上手，不在于如何开发 `Alice`, `Arale` 模块，不专门介绍 `build` 相关内容。

*更新：基本决定暂时放弃了，一方面是生态还没起来能搜到的资料太少太差，另一方面觉得类似Browserify的同步加载更符合现实需求。*

<!--more-->

<a href="#in-5-minutes">跳到结论</a>

##[Alice](http://aliceui.org/)

1. Alice 是什么：[官方介绍](http://aliceui.org/) [官方入门](http://aliceui.org/docs/start.html)

        一个类似 [Twitter Bootstrap](http://getbootstrap.com/) 的css框架

2. 第一步：我想要一个 `bootstrap` 的替代品

        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Alice 的简单例子</title>
          <link media="all" href="{{ DOWNLOAD_TO_YOUR_LOCAL_PATH }}/one.css" rel="stylesheet">
        </head>
        <body>
          {{ YOUR_CONTENT }}
        </body>
        </html>

        # 此刻你的文件夹应该类似这样
        application/
          static/
            css/
              one.css
            img/
            js/
          templates/
            layout.html

2. 第二步：我想要一个 `bootstrap.js` 的替代品，相应的应该是 `Arale` 的 `js`？但问题是直接下载下来用几乎是不可能的。比如你想用 `Tab` 这个包，它会依赖 `Switchable`，而 `Swithable` 又依赖 `Widget`；再考虑到依赖多个以及循环依赖，想手工完成这个管理太困难了。同时 `Alice` 并不提供类似 [bootstrap customize](http://getbootstrap.com/customize/) 的在线定制和下载，那么你必然需要一个包管理工具，即 `spm2`。

5. **TL;DR，如果只需要使用 `css`，那么就下载 `one.css` 放到你自己的项目里；如果希望像使用 `bootstrap` 那样通过“下载”使用 `Alice` 的 `css` 和 `Arale` 的 `js` 是不可能的，不要浪费时间研究，继续往下看。**

##[Sea.js](http://seajs.org/docs/)

1. Sea.js 是什么：[官方介绍](http://seajs.org/docs/#intro) [官方五分钟上手](http://seajs.org/docs/#quick-start)

        类似于 [RequireJS](http://requirejs.org/)

2. 好激动！Sea.js是可以直接下载使用的，不依赖其他3个

        <script id="seajsnode" src="/static/js/seajs/2.1.1/sea.min.js"></script>
        <script>
          seajs.use("main");
        </script>
        * 从 2.x? 开始，默认的 base 是 sea.min.js 的 ../../ 即 此例中的 js/，可以使用 seajs.data.base 查看
        * id="seajsnode" 这个不知道在 2.x 还有没有必要，没有找到说明
        * 从 2.x? 开始，取消了 data-config 和 data-main，需要显式使用 seajs.use 指定入口

        # 文件夹结构
        application/
          static/
            js/
              seajs/
                2.1.1/
                  sea.min.js
              main.js
              biz.js

        # main.js
        define(function(require) {
          var Biz = require('./biz'); // 使用相对路径，而不是name
          var b = new Biz();
          b.hello();
        });

4. 假如你需要用到 `Arale`，你不可能去手工下载这些文件并且按文件夹层次放好的对吧，那么就必须用到 `spm2` 包管理。

        # app.js
        seajs.use(['arale/validator/0.8.9/validator'], function(Validator) {
          // biz logic
        });

        [ERROR] GET http://domain/static/js/arale/validator/0.8.9/validator.js 404 (NOT FOUND)

5. **TL;DR，如果你需要的是 `RequireJS` 的替代品，你可以直接下载使用 `Sea.js`，但这不属于本文讨论的范围。如果你想使用 `Arale`，那么必须用 `Sea.js` 来启动，并且 `Sea.js` 和 `Arale` 都应该是从 `spm2` 安装的，而不是手动下载的。**

##[spm2](http://docs.spmjs.org/doc/index)

1. spm2 是什么：[官方介绍](https://spmjs.org/) [官方安装命令行工具](http://docs.spmjs.org/doc/index)

        一个类似 npm 的包管理工具，专注前端包管理，也就是 css, js，其实就是 Alice, Arale
        spm2 专注于包管理，而不是构建

2. 本文不讨论扩展开发 `Arale` 和 `Alice`，所以不需要使用 `spm init`。如果想用 `Arale` 的某个模块，直接到相应的地方安装包就好了。

        $ cd application/static
        $ spm install seajs/seajs --save
        $ spm install arale/switchable --save    # Tabs 在 Switchable 里面，spm search tabs 是搜不到的

        # 此刻的文件夹应该类似这样
        application/
          static/
            css/
            img/
            js/
              main.js
              biz.js
            sea-modules/                         # 吐槽：为什么不是下划线
              arale/
                base/
                  1.1.1/
                    base.js
                    ...
                ...
                switchable/
                  1.0.1/
                    ...
                    tabs.js
                    ...
                ...
              jquery/
                ...
              seajs/
                ...
            package.json
          templates/
            layout.html

        # 此刻 package.json 应该类似这样
        {
          "spm": {
            "alias": {
              "jquery": "jquery/jquery/1.10.1/jquery",
              "sea": "seajs/seajs/2.1.1/sea",
              ...
              "switchable": "arale/switchable/1.0.1/switchable",
              "tabs": "arale/switchable/1.0.1/tabs",
            }
           }
        }

3. 页面上的 js 是这样写的

        <script id="seajsnode" src="/static/sea-modules/seajs/seajs/2.1.1/sea.js"></script>
        <script>
          seajs.config({
            alias: {
              '$': 'jquery/jquery/1.10.1/jquery'    # 必须，不知道为什么
            }
          });

          seajs.use(['$', 'arale/switchable/1.0.1/tabs'], function ($, Tabs) {
            tabs = new Tabs({ ... });
          });
        </script>

4. 也可以这样写

        <script id="seajsnode" src="/static/sea-modules/seajs/seajs/2.1.1/sea.js"></script>
        <script src="/static/js/seajs_config.js"></script>
        <script src="/static/js/main.js"></script>

        # seajs_config.js
        seajs.config({
          alias: {
           '$': 'jquery/jquery/1.10.1/jquery',
          },
          paths: {
           'js': '/static/js'      # 相对路径始终是相对当前 html 的，太难搞了，不如直接写死
          }
        });

        # main.js
        seajs.use(['js/biz']);

        # biz.js
        define(function (require, exports, module) {
          var $ = require('$');
          var Tabs = require('arale/switchable/1.0.1/tabs');  # 可以 require 随便什么，就像单独使用 Sea.js 时候那样

          tabs = new Tabs({ ... });
        });

5. 接下来把 `Alice` 也用 `spm2` 来管理吧。

        $ cd application/static
        $ spm install alice/one --save

        <link media="all" href="/static/sea-modules/alice/one/1.2.2/one.css" rel="stylesheet">

##[Arale](http://aralejs.org/)

`Arale` 就没什么好说的了，就是一堆好用的模块，自己看文档吧。

<span class="anchor" id="in-5-minutes">&nbsp;</span>

##结论：真正的 5 分钟上手

1. 类比关系

        Alice   ->   bootstrap.css
        Arale   ->   jquery.js + bootstrap.js
        Sea.js  ->   RequireJS

2. 学习顺序

    1. 如果你想要 `bootstrap.css` 的替代品，那么就下载 `Alice` 的 `one.css` 直接用。但是相较 `Bootstrap`, `Foudation` 等而言可能不够用。
    2. <del>如果你想要 `bootstrap.js` 的替代品，直接下载使用 `Arale` 的相关模块几乎是不可能的，必然要用到 `spm2` 包管理。</del>
    3. 因此你必须学习 `spm2`，然后用 `spm2` 来安装 `Arale` 的相应模块。
    4. 如果你想要 `RequireJS` 的替代品，直接下载使用 `sea.js`；但还记得吗，你看本文是为了用所有这些东西，所以你应该用 `spm2` 来安装 `Sea.js`。
    5. 想打包/压缩？本文不讨论。
    6. 想扩展开发？本文不讨论。

3. 我太懒了，我要看结论

        # 文件夹层次应该是这样的
        application/
            static/
                js/
                    biz.js
                sea-modules/
                    arale/...
                    jquery/...
                    seajs/...
                package.json
            templates/
                layout.html

        # package.json
        {
            "spm": {
                "alias": {
                    "jquery": "jquery/jquery/1.10.1/jquery",
                    "sea": "seajs/seajs/2.1.1/sea",
                    "switchable": "arale/switchable/1.0.1/switchable",
                    ...
                }
             }
        }

        # 安装 Arale 的相应模块
        $ cd application/static
        $ spm install family/name --save      # 即 package.json 同一目录下

        # layout.html
        <link media="all" href="/static/sea-modules/alice/one/1.2.2/one.css" rel="stylesheet">

        <script id="seajsnode" src="/static/sea-modules/seajs/seajs/2.1.1/sea.js"></script>
        <script src="/static/js/seajs_config.js"></script>
        <script>
            seajs.use(['js/biz']);
        </script>

        # seajs_config.js
        seajs.config({
            alias: {
               '$': 'jquery/jquery/1.10.1/jquery',   # 必须，不知道为什么
            },
            paths: {
               'js': '/static/js'                    # 相对路径始终是相对当前 html 的，太难搞了，不如直接写死
            }
        });

        # biz.js
        define(function (require, exports, module) {
            var $ = require('$');
            var Tabs = require('arale/switchable/1.0.1/tabs');  # 可以 require 随便什么，就像单独使用 Sea.js 时候那样

            tabs = new Tabs({ ... });
        });
