Python
==

    $ vim ~/.pip/pip.conf
    [global]
    #index-url=http://pypi.douban.com/simple
    index-url=http://mirrors.aliyun.com/pypi/simple/
    
    $ vim ～/.pydistutils.cfg
    [easy_install]
    index-url=http://mirrors.aliyun.com/pypi/simple/

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

Sphinx
==

    $ pip install sphinx sphinx_rtd_theme watchdog
    $ sphinx-quickstart
    
    // conf.py
    import sphinx_rtd_theme
    html_theme = 'sphinx_rtd_theme'
    html_theme_path = [sphinx_rtd_theme.get_html_theme_path(), ]
    
    def setup(app):
        app.add_stylesheet( "css/style.css" )
    
    // Makefile
    .PHONY: watch
    watch:
    	watchmedo shell-command --patterns="*.rst" --ignore-pattern='_build/*' --recursive --command='make html'
    
    .PHONY: upload
    upload:
    	@echo "[ Uploading to http://xx.xx.xx.xx           ]"
    	@echo "[   ./_build/html -> /path/to/html          ]"
    	@rsync -auv --progress --exclude-from ./rsync.ignore.txt $(BUILDDIR)/html/* xx@xx.xx.xx.xx:/path/to/html
    	@echo "[ Uploaded -------------------------------- ]"

Node
==

    // https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories
    $ curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
    $ sudo apt-get install -y nodejs
    
    $ npm config set prefix /usr/local
    $ sudo chown -R $USER /usr/local
    
    $ vim .bashrc
    export NODE_PATH=/usr/local/lib/node_modules
    
    $ npm install -g yo generator-generator bower --verbose --registry=https://registry.npm.taobao.org
    $ npm install -g grunt-cli
    $ npm install -g spm
    $ npm install -g nodemon pm2
    $ npm install -g totoro totoro-server
    $ npm install mocha chai plato grunt-contrib-jshint
    
    // FIXME
    babel/
    babel-cli/
    generator-generator/
    grunt-cli/
    gulp/
    npm/
    react-native-cli/
    webpack/
    yo/
    colorguard/
    node-gyp/
    node-pre-gyp/
