---
layout: post
category : python
tags : [python, module, package, import]
---
{% include JB/setup %}

###Imports are pretty straightforward really. Just remember the following:
1. 'import' and 'from xxx import yyy' are executable statements. They execute when the running program reaches that line.
2. If a module is not in sys.modules, then an import creates the new module entry in sys.modules and then executes the code in the module. It does not return control to the calling module until the execution has completed.
3. If a module does exist in sys.modules then an import simply returns that module whether or not it has completed executing. That is the reason why cyclic imports may return modules which appear to be partly empty.
4. Finally, the executing script runs in a module named __main__, importing the script under its own name will create a new module unrelated to __main__.

<!--more-->

###Why not one class per file
1. If a depends on c and c depends on a, aren't they actually the same unit then? You should really examine why you have split a and c into two packages, because either you have some code you should split off into another package (to make them both depend on that new package, but not each other), or you should merge them into one package.
2. 'Java-like' one class per file is not necessary.
3. collect some related class to one module(source file),and collect some related module to one package, is helpful for code maintain.
4. A Python file is called a "module" and it's one way to organize your software so that it makes "sense". Another is a directory, called a "package". A module is a distinct thing that may have one or two dozen closely-related classes. The trick is that a module is something you'll import, and you need that import to be perfectly sensible to people who will read, maintain and extend your software.
5. The rule is this: a module is the unit of reuse.
6. You can't easily reuse a single class. You should be able to reuse a module without any difficulties. Everything in your library (and everything you download and add) is either a module or a package of modules.
7. Think of the import as the way to organize your code in concepts or chunks. Exactly how many classes are in each import doesn't matter. What matters is the overall organization that you're portraying with your import statements.
8. Python is not exclusively class-based - the natural unit of code decomposition in Python is the module. Modules are just as likely to contain functions (which are first-class objects in Python) as classes. In Java, the unit of decomposition is the class. Hence, Python has one module=one file, and Java has one (public) class=one file.
9. Python is much more expressive that Java, and if you restrict yourself to one class per file (which Python does not prevent you from doing) you will end up with lots of very small files - more to keep track of with very little benefit.
10. There's a mantra, "flat is better than nested," that generally discourages an overuse of hierarchy. I'm not sure there's any hard and fast rules as to when you want to create a new module -- for the most part, people just use their discretion to group logically related functionality (classes and functions that pertain to a particular problem domain). Good thread from the Python mailing list, and a quote by Fredrik Lundh:     even more important is that in Python, you don't use classes for every- thing; if you need factories, singletons, multiple ways to create objects, polymorphic helpers, etc, you use plain functions, not classes or static methods. once you've gotten over the "it's all classes", use modules to organize things in a way that makes sense to the code that uses your components. make the import statements look good.

* [1] http://stackoverflow.com/questions/744373/python-circular-or-cyclic-imports
* [2] http://stackoverflow.com/questions/1091756/multiple-python-classes-in-a-single-file