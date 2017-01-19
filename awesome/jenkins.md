Jenkins
=======

[Official: Installing Jenkins on Ubuntu](https://wiki.jenkins-ci.org/display/JENKINS/Installing+Jenkins+on+Ubuntu)

    $ wget -q -O - http://pkg.jenkins-ci.org/debian/jenkins-ci.org.key | sudo apt-key add -
    // deb http://pkg.jenkins-ci.org/debian binary/
    $ sudo apt-get install jenkins
    $ sudo vim /etc/default/jenkins
    // HTTP_PORT=9000
    $ sudo /etc/init.d/jenkins restart
    // now you can use it with web http://127.0.0.1:9000/
    // the default JENKINS_HOME is /var/lib/jenkins
    
    // Build -> Execute shell
    $ export NODE_PATH=/usr/local/lib/node_modules
    $ cd /home/albert/github/jake
    $ grunt test --no-color

[Enable Security](http://www.cnblogs.com/itech/archive/2011/11/15/2249457.html)
