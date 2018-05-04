性能 CheckList v1.0
图片性能

webp格式支持 ：Android 推荐使用.
DPI 图片适配 ：DPI>=2 的情况下2x图片，其余使用1x图片
弱网适配 Q值配置 ：推荐DPI>=2的情况下强网q50 弱网q30 ，DPI<2 强网使用q9，弱网使用q75。锐化可根据实际情况选择 s150。可以适当根据实际情况选择q90，q75，q50，q30.
图片文件大小 kb控制 : 单张图片不要大于50kb。
图片渲染高宽和实际大小控制（内存消耗控制）：切图推荐最小尺寸裁剪，不能超过展示区域大小（retina下小于2x）。
CDN适配尺寸 ： 推荐根据显示区域大小适配CDN规范中的最佳尺寸图片。
IconFont 正确使用(不引用无效资源) ： 无线端只加载1个字体文件。
合理使用（CSS3, SVG,ICONFONT）替代UI图片 ：
合理使用PNG GIF 等图片（如运营填写的图片地址）: 不推荐商品图片，运营图片使用PNG,GIF 文件格式（不是扩展名）。
推荐使用

- [lib.img](http://gitlab.alibaba-inc.com/mtb/lib-img) 无前端框架依赖
- [km-lazyload](http://kimi.taobao.net/index.php#issues/81) kimi的组件
域名收敛

尽量控制在5个域名左右。

图片同域 gw.alicdn.com
静态脚本CSS同域 g.alicdn.com
动态数据请求 使用MTOP
加载性能

Gzip 静态资源
首屏显示（必要）资源加载控制 ：检测显示的图片是否在首屏区域内。
首屏1个数据接口请求 ：首屏需要的数据接口控制在1个。
按需加载资源 ：
合并CSS，Javascript资源 ：
避免重定向 ：如脚本资源301
禁止图片空地址 ：
Slider Banner 滚动时间不宜过快
使用 lib.mtop 最新版本
渲染性能

禁止使用iframe （阻塞父文档onload事件）
禁止使用GIF图片实现Loading 效果 （降低CPU消耗，提升渲染性能）http://v.youku.com/v_show/id_XODY2OTI5NzI4.html
CSS写头部，JS写尾部
如有新的建议可以反馈给@晓田，或者提issues。

CDN 图片组件规范
Posted on 2015-05-21   |   暂无评论
CDN 图片组件规范
由于目前各个前端团队都有自己的开发框架，业务组件，各自的依赖，导致各个团队都有自己的CDN图片组件，为了更好的性能和体验，我们制定图片组件规范，罗列必须要有的功能和特性。

必须功能

无线端域名收敛

~图片地址收敛至 单个域名（减少DNS解析时间）

CDN 最佳尺寸适配

~ 给出期望尺寸配对CDN尺寸列表给出最佳图片尺寸（没有一样尺寸按最佳尺寸小的配对）

取高度最佳
取宽度最佳
webp格式适配，android 设备支持webp格式

~ 通过检测浏览器是否支持webp格式，输出webp格式

适配设备DPI，给出2x图片

~根据设备DPI 给出2X图片，DPI等于

支持网络环境判断，输出不同的CDN图片Q值

~ 推荐DPI>=2的情况下强网q50 弱网q30 ，DPI<2 强网使用q9，弱网使用q75。锐化可根据实际情况选择 s150。可以适当根据实际情况选择q90，q75，q50，q30。

裁剪功能
~可以根据参数配置图片裁剪功能。

建议

在DPI参数大于2的时候建议使用2x的图片。在RetinaHD这类的设备3x图片在webview中内存不足造成容易App Crash。

CDN 尺寸列表

各团队根据自己的实际CDN图片尺寸列表为准。

可选功能

Lazyload功能
默认占位图片base64

`(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

常见问题

gif图片：只做域名收敛，不加任何后缀。
png图片:q值无效，sharpen值会使图片失真，两个值会过滤掉
png|gif图片:不加_.webp参数，小米2s上png加webp图片不显示，gif加webp动画失效


参考资料
==

1. [性能 CheckList v1.0](http://ntx.me/2015/03/02/checkList/)
2. [CDN 图片组件规范](http://ntx.me/2015/05/21/CDNPhoto/)
