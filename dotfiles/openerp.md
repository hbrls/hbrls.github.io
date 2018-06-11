Bazaar
======

    $ sudo add-apt-repository ppa:bzr/ppa
    $ sudo apt-get install bzr

OpenERP 7.0
===========

1. 参考 Dockerfile 和 requirements.txt

        $ sudo apt-get install python-dateutil python-docutils python-feedparser python-gdata \
                               python-jinja2 python-ldap python-libxslt1 python-lxml python-mako \
                               python-mock python-openid python-psycopg2 python-psutil \
                               python-pybabel python-pychart python-pydot python-pyparsing \ 
                               python-reportlab python-simplejson python-tz python-unittest2 \
                               python-vatnumber python-vobject python-webdav python-werkzeug \
                               python-xlwt python-yaml python-zsi

2. 在一台机器上运行多个实例：

    1. Each instance should have its own user, home directory, PostgreSQL account for security reason.（用PyCharm运行的时候，用的当前用户启动，所以不可能跑多个实例；要用到 sudo su）
    2. You need several config files, each specifying different ports for the NET-RPC(default 8070), XML-RPC(default 8069) and XML-RPCS (default 8071)
    
            netrpc_port = 8050
            xmlrpc_port = 8049
            xmlrpcs_port = 8051

AddOn开发
=========

1. Module == AddOn == Application （？）

2. 文件夹组织，命名将最重要的单词放在最前面（e.g. sale_order），不要使用复数形式

        /module/

            /__init__.py
            /__openerp__.py
            /module.py
            /module_other.py
            /module_view.xml
            /module_data.xml
            /module_demo.xml

            /wizard/
            /wizard/__init__.py
            /wizard/wizard_name.py

            /report/
            /report/
            /report/__init__.py
            /report/report_name.sxw
            /report/report_name.rml
            /report/report_name.py

3. 新建一个模块后要更新模块列表才能看得到

ORM
===

####Naming Conventions

1. OpenERP `objects` are usually called `classes` in OOP.

2. An OpenERP `resource` is usually called an `object` in OOP, `instance` of a class.

Pool（？不确定）
===============

1. 定义完成后直接生成一个实例，会把自己注册到 pool 里面去

        class name_of_object(osv.osv):
            _name = 'name.of.object'
        
        name_of_object()
    
        when_you_want_to_use_the_obj = self.pool.get('name.of.object')

Inherit
=======

1. `class inheritance`：不指定新的 _name，生成新实例（？），则是对原 object 的扩展，用同一张表，不存在新的 object

        class child_object(osv.osv):
            _name = 'parent.object'
            _inherit = 'parent.object'
            
            def child_func():
                pass

        child_object()
        
        when_you_want_to_use_the_obj = self.pool.get('parent.object')
        when_you_want_to_use_the_obj.child_func()

2. `inheritance by prototyping`：指定新的 _name，生成新实例，和原 object 没有关系（？）

        class child_object(osv.osv):
            _name = 'child.object'
            _inherit = 'parent.object'
            
            def child_func():
                pass
        
        child_object()
        
        when_you_want_parent = self.pool.get('parent.object')
        when_you_want_child = self.pool.get('child.object')
        when_you_want_child.child_func()

Official Guidelines
===================

1. [Developing Modules: Organisation of files in modules, Coding Guidelines, etc.](https://doc.odoo.com/contribute/05_developing_modules/)
2. v8 正在往 `CamelCase`，`orm.Model` 转；[Maillist discussion of CamelCase](https://www.mail-archive.com/openerp-community@lists.launchpad.net/msg05167.html)
