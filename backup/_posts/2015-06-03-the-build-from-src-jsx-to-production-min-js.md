---
layout: post
category : app
tags : [angular, react, browserify, uglify, gulp, babel]
title: "The build from src.jsx -> production.min.js with browserify"
---
{% include JB/setup %}

My efforts at work involves an SPA based on `backbone` and `jquery`. It loads all the js files at the beginning and resolves the dependencies with a hard to follow/document convention. I'm making it more dev friendly recently and that's where most of the knowledge in this post is from.

I'm familiar with `browserify` and not yet buying the features of `webpack`. And the nature of my project do not allow hot loading, so there will be nothing about `webpack` in this post. I have both `angular` and `react` at the same time for different partials, so the approach will be universal however I will not explain the details other than build.

**TL;DR;**: `src.jsx -> jscs -> jsxhint -> reactify -> exorcist -> build.js/build.js.map -> uglify2 -> production.min.js/production.min.js.map`

**UPDATE**: Everything is fate. I'm using `webpack`, `eslint`, `babel`, `postcss` now.

<!--more-->

## What if there is no such gulp plugins?

I was stucked a lot at first while searching for kinds of gulp plugins to fully serve my requirements. The js eco is evolving rapidly (I'm looking at you, jsx) so that the plugins get outdated so often. Wish me good luck if my dependent package maintainers works hard to keep up with everything that comes out everyday. But with the least luck will the gulp plugin maintainers to keep up with the keep ups. Google was full of recipes that do not work.

After reading [Why we should stop using Grunt & Gulp](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/) and [How to Use npm as a Build Tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/), I decide to give it a shot.

The `jscs` has a gulp plugin from the official. The `jsxhint` [is however unlucky](https://github.com/spalger/gulp-jshint/issues/55). But we can still use it directly and then make an alias for it in our gulp build system.

    // package.json
    "scripts": {
        "jscs": "jscs ./web/src/* ./web/src/**/* --esprima=esprima-fb --color",
        "jsxhint": "jsxhint --jsx-only ./web/src/* ./web/src/**/*",
    }

    // gulpfile.js
    var shell = require('gulp-shell');
    gulp.task('jscs', shell.task(['npm run jscs -s'], { quiet: true, errorMessage: '\n<%= error.stdout %>' }));
    gulp.task('jsxhint', ['jscs'], shell.task(['npm run jsxhint -s'], { quiet: true, errorMessage: '\n<%= error.stdout %>' }));

## Browserify jsx with an external sourcemap

`browserify` has a straight forward [document about source maps](https://github.com/substack/browserify-handbook#source-maps). But `reactify` will expose the absolute path to the source map, sth like `/User/albert/github/...`. First of all, it's not secure. Secondly it makes me hard to find my js in the chrome dev tools. Absolute paths gethers on top of the panel while the other relative path modules are at the bottom.

At the time of writing this post, `exorcist` got an [issue for Support base-relative sources](https://github.com/thlorenz/exorcist/pull/12) and fixed it. So the solution is obvious:

    // package.json
    "scripts": {
        "browserify": "(set -o pipefail && browserify --extension=.jsx --debug ./static/src/index.js | exorcist --base ./static/js ./static/js/index.js.map > ./static/js/index.js)",
    },
    "browserify": {
        "transform": [
            "reactify",
            "browserify-shim"
        ]
    },

## Sourcemap doesn't work

We've observed a bug with transformed jsx. As for now, my guess of the bug is that transforming from jsx to js with sourcemap will confuse the line numbers. The chrome dev tool will then be broken. I have a temp solution for it, that is [disabling the sourcemap from jsx to js with reactify](https://github.com/hbrls/reactify/commit/a167b454f2ae37d6663e938cbe20805b4e189bb2). The sourcemap from modules to compiled with browserify will then work as expected.

For more details, please review these issues. [What are these grey lines in the Chrome sources panel?](http://stackoverflow.com/questions/29650951/what-are-these-grey-lines-in-the-chrome-sources-panel), [JSX source maps create gray lines in chrome sources panel](https://github.com/babel/babel/issues/1318), [Make source map generation optional](https://github.com/andreypopp/reactify/pull/48), [source maps & generator breakpoints don't work well together](https://github.com/babel/babel/issues/726).

## Uglify2

    // package.json
    "scripts": {
        "uglify": "uglifyjs ./static/js/index.js --screw-ie8 --stats --verbose --source-map ./static/js/index.min.js.map --source-map-url=index.min.js.map --in-source-map ./static/js/index.js.map --output ./static/js/index.min.js",
    }

## Finally

    // package.json
    "scripts": {
        "publish": "browserify --extension=.jsx ./static/src/index.js | uglifyjs --screw-ie8 --stats --mangle --verbose --compress > ./static/js/index.min.js",
    }

    // gulpfile.js
    var gulp = require('gulp');
    var shell = require('gulp-shell');

    gulp.task('jscs', shell.task(['npm run jscs -s'], { quiet: true, errorMessage: '\n<%= error.stdout %>' }));
    gulp.task('jsxhint', ['jscs'], shell.task(['npm run jsxhint -s'], { quiet: true, errorMessage: '\n<%= error.stdout %>' }));
    gulp.task('build', ['jsxhint'], shell.task(['npm run browserify -s', 'npm run uglify -s'], { quiet: true, errorMessage: '\n<%= error.stdout %>' }));
    gulp.task('publish', ['jsxhint'], shell.task(['NODE_ENV=production npm run publish -s'], { quiet: true, errorMessage: '\n<%= error.stdout %>' }));

*I started to write this post a month ago. There were a lot of problems then so that I felt obligated to write it down. Time passed. I got rid of most of the bugs and now I've forgot what I was willing to write. I will keep updating this post as long as I recalled something.*
