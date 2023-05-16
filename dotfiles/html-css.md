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

```html
// 1、捕获摄像头，user 表示前置摄像头，environment 表示后置摄像头
<input type="file" capture="user" accept="image/*" />

// 2、每 10s 刷新一次
<meta http-equiv="refresh" content="10" />

// 3、开启 input 输入框的拼写检测
<input type="text" spellcheck="true" lang="en" />

// 4、上传文件时指定允许的文件格式
<input type="file" accept=".jpeg,.png" />

// 5、阻止浏览器翻译，适用场景比如 Logo 和品牌名
<p translate="no">Brand name</p >

// 6、允许选择多个文件
<input type="file" multiple />

// 7、为 video 标签添加缩略图
<video poster="picture.png"></video>

// 8、声明资源文件的下载
<a href="image.png" download>
```
