```html
<!--[if lt IE 7 ]> <html class="ie ie6 ie-lt10 ie-lt9 ie-lt8 ie-lt7 no-js" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="ie ie7 ie-lt10 ie-lt9 ie-lt8 no-js" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="ie ie8 ie-lt10 ie-lt9 no-js" lang="en"> <![endif]-->
<!--[if IE 9 ]>    <html class="ie ie9 ie-lt10 no-js" lang="en"> <![endif]-->
<!--[if gt IE 9]><!--><html class="no-js" lang="en"><!--<![endif]-->
```

常用
==

微信内置浏览器可用区域分辨率

1. iPhone 4: 320 x 416
2. Moto X: 360 x 519
3. iPhone 5s: 320 x 504
4. iPhone 6: 375x609 (?)
4. iPhone 6p: 414 x 672

安全字体

```
font-family: "Microsoft YaHei", "Hiragino Sans GB", "Hiragino Sans GB W3", "WenQuanYi Micro Hei", "Helvetica Neue", Helvetica, Arial, sans-serif;
```

去掉 bootstrap 3 `<select>` 中的圆角，[ref](http://stackoverflow.com/a/24766039/707580)

```
  select.form-control {
    border: none;
    outline: 1px solid #ccc;
    outline-offset: -1px;
  }
```

隐藏 `<input type="number">` 的滚轮，[ref](http://stackoverflow.com/a/27935448/707580)

    input[type="number"]::-webkit-outer-spin-button,
    input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    input[type="number"] {
      -moz-appearance: textfield;
    }
