---
layout: post
category: app
tags: [resolution, css]
title: "Media Queries 在移动设备上好像有大坑"
---

<p class="previously">前情回顾：之前在做Phone上的webapp，写了<a target="_blank" href="http://lisite.de/blog/app/2012/12/20/webapp-resolution-research/">《WebApp分辨率，ppi，css解决方案研究》</a>处理分辨率相关的问题，用的方案比较糙快猛。最近开始考虑适配iPad，于是希望能更加responsive一点，所以在学习media query方面的知识，但动起手来却发现好像有很多大坑。</p>

####Targeted Devices

    Android 4.0+ (Nexus S/Chrome)
    iOS     5.0+ (iPad 2/Chrome, iPhone 4/Chrome)
    html5

<!--more-->

####在一台普通的PC上发生着什么

1. “普通”指的是：1)主流；2)不考虑IE；3)手头没有mac retina，所以不确定；4)暂时不考虑zoom in/out，暂时不考虑scroll；
2. 主要参考自ppk的 [a tale of two viewports](http://www.quirksmode.org/mobile/viewports.html)，图文并茂，预知详情自行查看
3. window.screen.width/height指的是device的宽高
4. window.innerWidth/Height即viewport的宽高（IE不支持）
5. `document.documentElement === $('html')[0]`，而viewport包含了`<html>`元素。正常情况下document.documentElement.clientWidth/Height即viewport的宽高，但是假如人为设定`<html>`元素的style的话，两者就不相等了

####在Mobile上发生着什么

1. 按照ppk的说法，我们可以认为存在2个viewport

        layout viewport                                   visual viewport            device width/height
        <html>/css以这个为基准
        如果厂商不Smart，Mobile上的效果和Desktop“一致”
        但只能看到较小的一块区域
        这是一个定义值，厂商之间不一样
        document.documentElement.clientWidth/Height       window.innerWidth/Height   screen.width/height
        ---------------- 目前为止一切正常 ----------------

2. 实际上目前主流的browser on mobile都会进行缩放，缩放因循的标准是：it completely covers the screen in fully zoomed-out mode (and is thus equal to the visual viewport)。我的理解是在visual viewport的范围内让用户能看到layout viewport下能看到的网页全貌。考虑到之前主流的分辨率是1024*768以及一些凑整数的原因，以Apple为首的厂商将layout viewport的width定义为980。因此假如不设置`meta viewport`：

                                                        iPhone 4  iPad 2  Nexus S
        portrait  window.innerWidth                     980       980     980
                  document.documentElement.clientWidth  980       980     980
        landscape window.innerWidth                     981       981     980
                  document.documentElement.clientWidth  980       980     980
        *  实际上在此情况下我们根本得不到所谓的visual viewport

        portrait  screen.width                          320       768     320
                  screen.height                         480       1024    534
        landscape screen.width                          320       768     534
                  screen.height                         480       1024    320
        *  Apple对于screen.width/height始终返回的是portrait状态下的值

3. 使用`<meta name="viewport" content="width=device-width, user-scalable=no">`会使得问题得到一定程度的简化（禁掉scalable是因为暂时不准备讨论zoom的影响）：

                                                        iPhone 4  iPad 2  Nexus S
        portrait  window.innerWidth                     320       768     320
                  document.documentElement.clientWidth  320       768     320
        landscape window.innerWidth                     320       768     534
                  document.documentElement.clientWidth  320       768     534

        portrait  screen.width                          320       768     320
                  screen.height                         480       1024    534
        landscape screen.width                          320       768     534
                  screen.height                         480       1024    320

4. @media width is always monitoring `window.innerWidth`

                                                        iPhone 4  iPad 2  Nexus S
        portrait  window.innerWidth                     320       768     320
                  @media width                          320       768     320
        landscape window.innerWidth                     508       768     534
                  @media width                          320       768     534

5. 然而设置了`initial-scale=1.0`之后故事又完全不一样了，看上去这才是期望的结果

                                                        iPhone 4  iPad 2  iPad 3  Nexus S
        portrait  window.innerWidth                     0         768     768     320
                  document.documentElement.clientWidth  0         768     768     320
                  @media width                          0         768     768     320
        landscape window.innerWidth                     0         1024    1024    534
                  document.documentElement.clientWidth  0         1024    1024    534
                  @media width                          0         1024    1024    534

6. 然而，有人指出这样还是有很多bug [参考文献3]

        DO use the viewport meta tag
        DO use media queries to render your page appropriately for various widths ranging from under 200px to 1024px or more
        DO use width=device-width,initial-scale=1 in your viewport meta tag OR use width=device-width alone12.
        DO NOT use maximum-scale=1 or user-scalable=no
        DO NOT use width=<specific width>
        DO NOT use @media all and (*-device-width: xxx)

7. 好吧我放弃了，反正我的博客在`<meta name="viewport" content="width=device-width, initial-scale=1.0">`下面很正常，接下来就等着各家赶紧统一吧，本文暂告一段落

[用Mobile打开看实例](http://lisite.de/blog/lab/2013-03-14-media-query-on-mobile-demo.html)

参考文献：

1. [First, Understand Your Screen --James Pearce](http://tripleodeon.com/2011/12/first-understand-your-screen/)
2. [A tale of two viewports --ppk](http://www.quirksmode.org/mobile/viewports.html)
3. [device-width and how not to hate your users](http://tech.bluesmoon.info/2011/01/device-width-and-how-not-to-hate-your.html)
