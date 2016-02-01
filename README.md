Khaliq's Personal Finance App
===

A simple app to manage finances. This is the public branch which runs the example
app at finance.khaliqgant.com.

# About
* I love mint and also mint bills, but wanted more control and ability to forecast
my current and future expenses. So I built this. I've been using this pretty consistently
over the past 4 or so months and it has worked out great. I open sourced it in hopes
that others might find it useful as well. Blog post explaining more coming soon. A demo
app is hosted at http://finance.khaliqgant.com/


## Getting Started
* The app is structured through a series of json documents. The main one being
the dated file in the test data directory. For the actual app, I used a data directory
which is not committed for obvious reasons (it has all my financial data). In this
case the entry point file is [07_2015.json](https://github.com/khaliqgant/finance-app/blob/master/test%20data/07_2015.json).
* The main categories are
    - Debt
    - Cash
    - To Pay
    - Notes
* Those sections are in an [array](https://github.com/khaliqgant/finance-app/blob/master/public/assets/js/finances.js#L45)
that gets looped through when processing that file. Some data is nested in other files
and some data is in in the main file. The remote property signifies there for [clarity](https://github.com/khaliqgant/finance-app/blob/master/public/assets/js/finances.js#L139)
when looping through each section to determine whether or not that data needs to be
fetched from a remote file or not.
* So the first thing you would do if you were setting up this app is to map out your
data in each category. Make the directories exactly the same as the test data,
fill in your credit cards debt, statement balance (to pay), due dates, cash - paycheck,
and fixed costs, and any notes. I've thought about automating this file creation
process via a CLI so if you are interested in that, let me know!
* After that, you should be ready to go. Any new months navigated to copies the previous
months data into new files so you can forecast payments as well.
* Any questions or issues feel free to make a Github issue!

# Elasticsearch
* Aggregations are run on the data once a month
* Explained more [here](https://github.com/khaliqgant/finance-app/tree/master/elasticsearch)


# Development
* Any pull requests are welcomed and encouraged!

* Start the app by running:
```
nodemon server.js
```
* App can be accessed from http://localhost:3000/
* In production I use [forever](https://github.com/foreverjs/forever) to launch the app and run in the background
```
NODE_ENV=prod forever start --uid finances --append -c nodemon server.js
```

* There is a basic auth in [place](https://github.com/khaliqgant/finance-app/blob/master/server.js#L11)
so you'll need to create an auth directory and a .htpasswd file with some creds.
You can generate such a file [here](http://www.htaccesstools.com/htpasswd-generator/)

## Next Steps
* Hook in mint api or scrape to get this info automatically?
* http://browserify.org/
* Pull in accout data programmatically? https://developer.intuit.com/docs/0020_customeraccountdata/0005_service_features
* Use graphs to show changes over time
* Need task runner commands to automate the browersify and npm-css process

## Notes
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
