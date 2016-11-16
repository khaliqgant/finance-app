/**
 * Connect.js
 * @author Khaliq Gant
 * @use handles all the requests to the connect api via ajax
 * @dependencies :
 *      Moment.js : https://github.com/moment/moment
 *      Backbone : http://backbonejs.org/
 */

'use strict';

var $        = require('jquery');
var vars     = require('./vars');
var server   = require('./server');
var Backbone = require('backbone');

var Connect = {
    base: '/api',

    buildUrl: function(account) {
        return this.base + '/'+ account;
    },

    get: function(account) {
        var url = this.buildUrl(account);

        return server.getPromise(url);
    },

};

module.exports = Connect;
