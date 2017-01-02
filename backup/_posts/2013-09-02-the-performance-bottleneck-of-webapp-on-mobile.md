---
layout: post
category : app
tags : [mobile, javascript, html5, css ]
title: "WebApp在移动设备上的性能瓶颈"
---
{% include JB/setup %}

一些大家都知道但是很难执行的思路就不说了，比如不要使用jQuery，或者用Zepto代替jQuery之类的。我可能会长期使用jquery, underscore, sugar等基础类库，并且不准备在库的性能选择上花太多时间，在这些方面更看中开发效率。并且也算是给最终优化留些释放黑魔法的机会。另外，本文不准备提供定量的benchmark，只提供关于best/better practice的建议。


####Target

本文应该不会涉及offline app，可能会涉及localStorage, sessionStorage, websql等。不涉及动画，可能会另外专门写一篇。

<!--more-->

####1. Cache [ref1](http://www.guypo.com/mobile/understanding-mobile-cache-sizes/) [ref2](http://www.guypo.com/uncategorized/mobile-browser-cache-sizes-round-2/)


Persistent cache: lives through a restart of the browser process or a power cycle of the device

    OS               Browser             Max Persistent Cache Size
    iOS 5.1.1 	     Mobile Safari 	     0
    iOS 5.1.1 	     Chrome for IOS 	 200 MB+
    Android 4.0–4.1  Chrome for Android  85 MB
    Android 4.0–4.1  Android Browser     85 MB
    Android 4.1 	 Firefox Beta 	     75 MB
    Blackberry OS 6  Browser 	         25 MB
    Blackberry OS 7  Browser             85 MB

1. 如果不考虑一些老的设备或系统，这个数字足以满足要求，因此瓶颈应该不在这里，可能会影响启动速度。
2. Memory cache only lives while the browser process lives, and often shrinks if the system requires more memory，并且因此extremely unpredictable。同时对单页面应用来说，这个应该也不是瓶颈。
3. iOS 5.1 has even made localStorage non-persistent for apps that use UIWebView
4. `Lock/unlock`, `Power of`, `Quit Safari`, `Close Tabs` 都可能对Cache产生影响 [ref3](http://www.winktoolkit.org/blog/204/)，这篇文章太老，随便参考参考

####2. Reflow, Repaint [ref1](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)

1. **Reflow(mozilla)**: or layout(other), parts of the render tree (or the whole tree) to be revalidated and the node dimensions recalculated. 至少会发生一次reflow，即initial layout of the page
2. **Repaint**: updating the screen with the results of the recalculated render tree
3. 都是性能杀手，考虑DOM是一个tree，在靠近root的地方做更改，可能影响到的node更多，也就更杀性能
4. 触发事件包括：
    1. adding, removing, updating DOM nodes
    2. `display:none` (reflow and repaint), `visibility:hidden` (repaint only, because no geometry changes)
    3. moving, animating a DOM node on the page
    4. adding a stylesheet, tweaking style properties
    5. User action such as resizing the window, changing the font size, or scrolling
5. 调优建议：
    1. 尽量减少操作次数，实用的方式包括`documentFragment, $('<div></div>'), $('<div>hello</div>')`，`this.cloneNode(true), $(this).clone(true)`，`display:none`操作结束后再显示出来
    2. smart browsers有相应的队列机制，自动推迟和批处理，因此不要反复去取computed styles，因为这样会强制队列flush
    3. 使用`el.className += " the_class_name";`或者`el.style.cssText += ";the_full_style_string;";`，不要每次修改一个style
    4. 使用`position:absolute, fixed`等可以将元素设为body的直接child，这样影响基本上只限于当前元素

#####webkit对于可视区域外的内容是不渲染的 [ref1](http://www.iunbug.com/archives/2012/09/19/411.html)

平铺层会被拆分成很多的块来绘制，即尽占用尽可能小的内存，只是将可视范围内的那部分渲染出来。以下则是webkit划分为层绘制的场景：

1. 页面主容器永远是独立的平铺层
2. 绘制密集型元素时，如`<video>, <canvas>`
3. 应用3D transformations的元素，包括translate3d, rotate3d, translateZ
4. 内容被加强时，如Filters, masks, reflections, opacity, transitions, animations
5. 某些特殊的情况下也会，如position:fixed, -webkit-overflow-scroll:touch
6. 任何在已知层上覆盖的内容

解决办法是将滚动区域可视范围的“所有”元素强制缓存起来，将他们独立成一个层`-webkit-transform:translateZ(0);`，同时又需要保证这个层当然不会很大，否则会被视为平铺层处理了。

####3. translate, translate3D, position:abs

参考这篇[Moving Elements With Translate Better Than Pos:abs Top/Left](http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/)，核心概念就是`pos:abs`用CPU，`translate`用GPU。双方有许多争论，有的和技术相关，有的和目前的硬件实际水平相关，看上去并没有定论。有一个[famo.us](http://famo.us/)项目看上去很不错。

考虑到本文并不涉及动画，只是想要普通效果更smooth，从实践经验上看，目前移动设备上使用translate3D更好。但一个明显的问题是可能更耗电池。

如动画过程有闪烁（通常发生在动画开始的时候），可以尝试下面的Hack：[ref2](http://www.qianduan.net/high-performance-css3-animations.html)

    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -ms-backface-visibility: hidden;
    backface-visibility: hidden;

    -webkit-perspective: 1000;
    -moz-perspective: 1000;
    -ms-perspective: 1000;
    perspective: 1000;

####4. MISC

1. 尽可能少的使用box-shadows与gradients，性能杀手，尤其是在一个元素上同时使用，所以拥抱扁平化设计吧。[ref1](http://www.qianduan.net/high-performance-css3-animations.html)
2. 1160KB是能放入单个TCP/IP包中的字节数。所以，最好将每个js文件保持在1160KB以下，以获取最优的下载时间。[ref2](http://www.gracecode.com/posts/726.html)


####5. 什么时候浏览器会认为应用太慢了？

[What determines that a script is long-running?](http://www.nczonline.net/blog/2009/01/05/what-determines-that-a-script-is-long-running/)

1. IE认为执行超过5 million statements（在注册表中修改），就会弹出警告窗口，此时代码就停了，如果选择继续，那么计数器清零，直到又累计执行了5 million statements。
2. Firefox认为是10秒（在about:config中修改）。
3. Safari好像是5秒。
4. Chrome好像是10秒，也可能是5秒，而且如果你kill page，那么整个页面都挂了。
5. Opera没有这样的限制，而且在这个过程中页面能保持足够的responsive，which is impressive。
