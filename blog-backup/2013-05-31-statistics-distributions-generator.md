---
layout: post
category: psychology
tags: [psychology]
title: "统计分布生成"
---

{% include JB/setup %}

####正态分布

主要参考《Numerical Recipes in C++ 2/e》p.292～p.294 和《Simulation Modeling and Analysis 3/e》p.465～p.466。

Box 和 Muller 在 1958 年给出了由均匀分布的随机变量生成正态分布的随机变量的算法。设 U1, U2 是区间 (0, 1) 上均匀分布的随机变量，且相互独立。令

    X1 = sqrt(-2*log(U1)) * cos(2*PI*U2);
    X2 = sqrt(-2*log(U1)) * sin(2*PI*U2);

那么 X1, X2 服从 N(0,1) 分布，且相互独立。等于说我们用两个独立的 U(0,1) 随机数得到了两个独立的 N(0,1)随机数。

<!--more-->

Marsaglia 和 Bray 在 1964 年提出了一种改进算法，避免使用三角函数。以下的实现代码用的就是这种改进算法。

    // Gaussian Random Number Generator class
    // ref. ``Numerical Recipes in C++ 2/e'', p.293 ~ p.294
    public class GaussianRNG
    {
      int iset;
      double gset;
      Random r1, r2;

      public GaussianRNG()
      {
        r1 = new Random(unchecked((int)DateTime.Now.Ticks));
        r2 = new Random(~unchecked((int)DateTime.Now.Ticks));
        iset = 0;
      }

      public double Next()
      {
        double fac, rsq, v1, v2;
        if (iset == 0) {
          do {
            v1 = 2.0 * r1.NextDouble() - 1.0;
            v2 = 2.0 * r2.NextDouble() - 1.0;
            rsq = v1*v1 + v2*v2;
          } while (rsq >= 1.0 || rsq == 0.0);

          fac = Math.Sqrt(-2.0*Math.Log(rsq)/rsq);
          gset = v1*fac;
          iset = 1;
          return v2*fac;
        } else {
          iset = 0;
          return gset;
        }
      }
    }


