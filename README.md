Khaliq's Personal Finance App
===

A simple app to manage finances

* Now is a node app, use nodemon to run the app
```
nodemon server.js
```
* Site can be accessed from http://localhost:3000/

## Next Steps
* Hook in mint api or scrape to get this info automatically?
http://stackoverflow.com/questions/11372408/how-can-i-use-npm-for-front-end-dependencies
* http://browserify.org/
* Basically just copied all the node_modules to the public folder, same with data
but that may not necessarily work
* Pull in accout data programmatically? https://developer.intuit.com/docs/0020_customeraccountdata/0005_service_features
* Use graphs to show changes over time

* Need task runner commands to automate the browersify and npm-css process

## Dev Notes
* Icons used are http://fortawesome.github.io/Font-Awesome/icons/
* Local bashrc file is included as a convenience to run the below commands
* From css directory to compile css run:
```
npm-css finances.css -o app.css
```
* From root directory run for browersify
```
browserify public/assets/js/finances.js -o public/assets/js/app.js -d
```
* In order to not have to compile every time using https://github.com/substack/watchify
```
npm install -g watchify
watchify public/assets/js/finances.js -o public/assets/js/app.js -v
```

## Production
* Hosted at finances.khaliqgant.com which redirects to finances.khaliqgant.com:3000
* Just ended up adding in a redirect in the finances.conf file
```
<VirtualHost *:80>
        ServerName finances.khaliqgant.com
        redirect permanent / http://finances.khaliqgant.com:3000
        ServerAdmin khaliqgant@gmail.com
        <Directory /var/www/finances/>
                Order allow,deny
                Allow from all
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        LogLevel warn
        CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
* Using nohup and forever to run node.js instance
```
nohup forever start -c nodemon server.js
```
* See the processes running
```
ps -ef |grep nohup
```

