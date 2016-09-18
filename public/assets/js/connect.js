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
    // should grab this from a config or something
    accounts: {
        wells: {
            url: '/wells',
            params: 'checking,savings'
        },
        bofa: {
            url: '/bofa',
            params: 'cash,travel'
        }
    },

    buildUrl: function(account) {
        return this.base +
               this.accounts[account].url +
               '?type=' +
               this.accounts[account].params;
    },

    get: function(account) {
        var url = this.buildUrl(account);

        return server.getPromise(url);
    },

};

module.exports = Connect;
