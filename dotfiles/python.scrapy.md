Python
==

[Installing Python 3 on Mac OS X](https://docs.python-guide.org/starting/install3/osx/)

[Pipenv & Virtual Environments](https://docs.python-guide.org/dev/virtualenvs/#next-steps)

[PyCharm: Configure a virtual environment](https://www.jetbrains.com/help/pycharm/creating-virtual-environment.html)

    $ vim ~/.pip/pip.conf
    [global]
    index-url=https://mirrors.aliyun.com/pypi/simple/
    
    $ vim ～/.pydistutils.cfg
    [easy_install]
    index-url=https://mirrors.aliyun.com/pypi/simple/

    $ sudo apt-get install python-pip python-dev build-essential
    $ sudo easy_install -U distribute

    $ sudo pip install MySQL-python
    $ sudo pip install sqlalchemy

    $ sudo apt-get install libpng12-dev libjpeg8-dev libfreetype6-dev  # matplotlib
    
    $ sudo pip install virtualenv
    $ virtualenv --no-site-packages env
    $ source env/bin/activate
    (env)$ pip install ......  # MySQL-python 1st, there was something not user friendly
    (env)$ pip install -r requirements.txt -i http://pypi.douban.com/simple/
    (env)$ pip install some_package.tar.gz  # 墙
    (env)$ pip list
    (env)$ pip install --upgrade some_package
    (env)$ pip freeze > requirements.txt 
    (env)$ deactivate
    
    $ sudo apt-get install python3
    $ virtualenv -p /usr/bin/python3 --no-site-packages ENV
    
    $ sudo pip install virtualenvwrapper
    $ export WORKON_HOME=~/envs
    $ source /usr/local/bin/virtualenvwrapper.sh
    $ mkvirtualenv env1
    (env1)$ mkvirtualenv env2
    (env2)$ workon env1
    (env1)$ deactivate
