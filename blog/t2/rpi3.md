---
layout: page
book: t2
title: "2016 Raspberry Pi Model 3 B"
---

2016 Raspberry Pi Model 3 B
==

购买清单（非广告）
--

1. [套装](https://item.taobao.com/item.htm?spm=a1z09.2.0.0.AgcDV0&id=542803358257&_u=g1jegdo93a8)
    1. 2016 Raspberry Pi Model 3 B，板载 wifi、蓝牙
    2. [散热片 x 3](./img/rpi3-heat-sink.jpg)
    3. 5V 2.5A 电源
    4. HDMI 线
    5. SanDisk 16GB micro sd 卡
    6. [透明亚克力外壳](https://item.taobao.com/item.htm?spm=a1z10.5-c-s.w4002-15826757858.92.P2arCR&id=22318619764)
    7. [风扇](https://item.taobao.com/item.htm?spm=2013.1.0.0.IVOfsA&id=41257329856)，[风扇接线示意图](./img/rpi3-fan.png)

初始化
--

1. [初次链接 HDMI 无信号解决办法](http://www.iteye.com/topic/1141733)
2. `$ ssh pi@raspberrypi.local`
3. 修改镜像源 http://mirrors.aliyun.com/raspbian/raspbian/
4. `$ sudo raspi-config` -> `enable ssh server`, `change locale`
5. [Docker](http://blog.alexellis.io/getting-started-with-docker-on-raspberry-pi/)，[Daocloud 镜像](http://get.daocloud.io/)

常用命令
--

1. 查看 CPU 温度 `$ vcgencmd measure_temp`
