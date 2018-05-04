---
layout: post
category: app
tags: [css, viewport, ppi, webview]
title: "CSS Pixels，Viewport，移动设备 WebView 适配再思考"
---
{% include JB/setup %}

几年前曾写过两篇移动设备适配初探，经过学习和实践，发现其中有错误、有过时，也有实践中毫无意义的部分，索性删光重写，免得给别人造成误导。

#### 问题本质：

  1. Resolutions are increasing as screen sizes, in many places, shrink. Ultra-high pixel density available.
  2. 显示屏技术不是阶梯式成整数倍增长的，而是一点点增长的
  3. 丧心病狂生产碎片的厂商

<!--more-->

#### CSS Pixels 的定义:

> - If the pixel density of the output device is very different from that of a typical computer display, the UA should rescale pixel values.
> - [DPI: Dots Per Inch](https://en.wikipedia.org/wiki/Dots_per_inch)，即 PPI: Pixels Per Inch
> - The suggested reference pixel is the visual angle of one pixel on a device with a pixel density of 90dpi and a distance from the reader of an arm’s length.
> - For a nominal arm’s length of 28 inches, the visual angle is about 0.0227&deg;
> - 后来 CSS 2.1 将参考值 90dpi 改成了 96dpi, 因此 css pixel 随之变为了0.0213&deg;
> - 以角度为单位进行测量，使得pixel是非线性的，e.g. 1000px is 21.075&deg;, 2000px is 40.813&deg;
> - DPR: Device Pixel Ratio

1. PPI 实际上是一个计算结果而不是一个原始值，以 iPhone4 为例：`sqrt((640 Physical Pixels) ^ 2 + (960 Physical Pixels) ^ 2) / 3.5 Inch 对角线 = 329.65`，官方的广告是 326 ppi
2. 乔布斯出了一款约 109ppi 的 iMac, 理论上应该用 1.1354 (109ppi / 96ppi)个 Physical Pixels 来显示 1 CSS Pixel，this is not physically possible，于是产生了改进的定义。而当时实际上还没有超过 144dpi 的设备，因此在实践中 1 physical px to display 1 css px

        96ppi
        |                  1 physical px to display 1 css px (The iMac)  dpr = 1
        144ppi(96ppi×1.5)
        |                  2 physical px to display 1 css px (iPhone4)   dpr = 2
        240ppi(96ppi×2.5)
        |                  3 physical px to display 1 css px (iPhone6P)  dpr = 3
        336ppi(96ppi×3.5)
                           4 physical px to display 1 css px

3. 接下来 iPhone4 和 Retina 来了，12.368' * 326 ppi = 28' * 144ppi，即在 12.368' 处使用 326ppi 的 iPhone4 和 28' 处看 144ppi 的电脑效果差不多，因此苹果采用了 2x 的策略，即 2 physical px to display 1 css px。注意：要显示 1x1 css px 实际上需要使用到 2x2 = 4 physical px

4. Android 厂商会有一些 1.5x，1.6x 之类的实现

5. 在 js 中，可以通过 `window.devicePixelRatio` 获取到当前设备的 dpr；在 css 中，可以通过 `-webkit-device-pixel-ratio, -webkit-min-device-pixel-ratio, -webkit-max-device-pixel-ratio` 进行媒体查询

#### Native App 开发中的 DPI，Density Independent Pixel

本文只讨论 Hybrid WebView，不讨论纯 Native 开发，可能另外撰文。

#### Mobile Browser, Native WebView, Viewport

1. 首先你应该仔细研读 ppk 的 [a tale of two viewports](http://www.quirksmode.org/mobile/viewports.html)

        window.screen.width/height 指的是 device 的宽高
        window.innerWidth/Height 即 viewport的宽高（IE不支持）
        // document.documentElement === $('html')[0]
        viewport 包含了 <html> 元素，正常情况下 document.documentElement.clientWidth/Height 即 viewport 的宽高，但是假如人为设定 <html> 元素的 style 的话，两者就不相等了

2. ~~按照 ppk 的说法，我们可以认为存在 2 个 viewport，即 layout viewport 和 visual viewport~~ 在实践中已经没人会这么干了！！！你应该对 `<meta name="viewport>` 进行合理的设置！！！

3. 目前比较普遍的设置是 `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">`

4. 这个设置可以减轻 css 适配的工作量，但并不能完全抹平碎片厂商的差异，例如你会看到：

        // 小米 2A
        {
          "innerWidth": 360,
          "clientWidth": 360,
          "innerHeight": 519, // 去掉了头尾
          "clientHeight": 519,
          "screen.width": 720,
          "screen.height": 1280,
          "matchMediaMinWidth": 360,
        }

        // 在 iPhone5C iOS8 里面嵌一个自定义的 280x514 的 WKWebView
        {
          "innerWidth": 280,
          "clientWidth": 320,
          "innerHeight": 514,
          "clientHeight": 587,
          "screen.width": 320,
          "screen.height": 568,
          "matchMediaMinWidth": 320,
        }

5. [Zepto](https://github.com/madrobby/zepto/blob/601372ac4e3f98d502c707bf841589fbc48a3a7d/src/zepto.js#L827) 用的是 `window.innerWidth` 和 `document.documentElement.scrollWidth`

5. [用你的设备打开看实例](http://lisite.de/blog/lab/2016-04-01-media-query-on-mobile-demo.html)，[看实例2](http://viewportsizes.com/mine/)

<!--
手头有两台测试机，先以此为例

               Resolution  PPI  Size  -
    Nexus S    480*800     233  4'    -
    iPhone 4S  640*960     326  3.5'  号称超越人眼能识别的300ppi，因此叫做retina

####android中的原生应用处理

1. dip(density/device independent pixel) represents an abstraction of a pixel for use by an application
2. Android将设备按照screen size分为4类：small, normal, large, xlarge
3. 按照density分为4类：ldpi, mdpi, hdpi, xhdpi
4. 以dip为设计时使用的单位，以normal, mdpi为baseline，即此设备上的1 dip将被转换为1 css px
5. 关于通用适配文档有3项建议，Explicitly declare in the manifest which screen sizes your application supports，Provide different layouts for different screen sizes，Provide different bitmap drawables for different screen densities
6. 简单来说，程序员在写layout的时候只需要考虑比例，并坚持使用dip单位；同样的"代码"在ppi较小的设备上将提供较小的"区域"来显示，在ppi较大的设备上提供更大的"区域"来显示，至于较大的区域是由正常"图片"拉伸还是另提供一套大图，由资源文件及设置决定
7. 遗留问题：scaled pixels，当用户自定义了系统字体大小时，可能会有影响，未深入研究

![mapping: actual sizes and densities to generalized sizes and densities](http://developer.android.com/images/screens_support/screens-ranges.png)

    small 3.3'           normal 3.5'          large 3.8'
    240*320 device px    320*480 device px    480*800 device px
    ldpi 120ppi          mdpi 160ppi          hdpi 240ppi
    16dip is 12 css px   16dip is 16 css px   16dip is 24 css px
                                              (Nexus S)

####一种利用meta viewport的简单粗暴方案

1. 如果不设置target-densitydpi=device-dpi，设备将按"默认"来缩放页面
2. 所谓的"默认""可能"是指window.devicePixelRatio（我们的产品基本上都要用webkit打包成app，所以这个结论"可能"是片面的）
3. window.devicePixelRatio = device px / dip
4. 几种典型设备都将设备竖直持握的时候的横向dip"定义"为320 dip
5. 因此我们只需要*针对320 dip进行设计，同时尽量考虑到对类似于340这种宽度的自适应*，"针对"这个词三言两语讲不清楚，但做前端的你们肯定懂我的意思

几种典型设备是这样的：

    iPhone 3          iPhone 4          Nexus S
    320 device px     640 device px     480 device px
    320 dip           320 dip           320dip
    1.0               2.0               1.5

如果设置initial-scale为0.5，320 * 320 css px pic is "resized" to

    160^2 css px pic

然后设备使用了如下数量的device px来实际显示

    (160 * 1)^2 device px   (160 * 2)^2 device px   (160 * 1.5)^2 css px

看上去效果就像是在css里面写的数值其实就是dip

    160 dip           160 dip           160 dip

那么为什么要设这个0.5呢

1. 因为这样美工同学就可以按照640x960来出图
2. 并且最终的效果是iP4上使用了 640 device px 来呈现 640 PhotoShop px；如果美工用的是普通pc，那么似乎也就是css px，如果美工用的是retina pc，结果不知道，没见过
3. 同时NS用480 device px 来显示 640 PhotoShop px是盈余的，糊不糊就看设备本身的能力了，Chrome on NS似乎没问题
4. 然后在PC上开一个640x960的窗口进行开发，这样实现的时候心里想着是按2倍大小的比例来处理的，但是到了mobile上就正常了
5. 这种思路的问题在于基本不准备适应pc了，适用于pc/pad一个项目，相对小屏mobile另一个项目
-->

#### 参考文献：

1. [Master css pixels retina displays](http://www.creativebloq.com/css3/master-css-pixels-retina-displays-8122955)
2. [Supporting Multiple Screens](http://developer.android.com/guide/practices/screens_support.html)
3. [First, Understand Your Screen --James Pearce](http://tripleodeon.com/2011/12/first-understand-your-screen/)
4. [A tale of two viewports --ppk](http://www.quirksmode.org/mobile/viewports.html)
5. [device-width and how not to hate your users](http://tech.bluesmoon.info/2011/01/device-width-and-how-not-to-hate-your.html)
6. [The Ultimate Guide To iPhone Resolutions](http://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions)
7. [The Curious Case of iPhone 6+ 1080p Display](https://medium.com/we-are-appcepted/the-curious-case-of-iphone-6-1080p-display-b33dac5bbcb6#.u9wzjhlp7)
