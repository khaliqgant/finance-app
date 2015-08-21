Khaliq's Personal Finance App
===

A simple app to manage finances

## Why
* I love mint and also mint bills, but wanted more control and ability to forecast
my current and future expenses. So I built this. I've been using this pretty consistently
over the past 4 or so months and it has worked out great. I open sourced it in hopes
that others might find it useful as well. Blog post explaining more coming soon. A demo
app is hosted at http://finance.khaliqgant.com/


## Dev
* Start the app by running:
```
nodemon server.js
```
* Site can be accessed from http://localhost:3000/

## Next Steps
* Hook in mint api or scrape to get this info automatically?
* http://browserify.org/
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
