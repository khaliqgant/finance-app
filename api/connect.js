'use strict';
/**
 * Connect
 * @use use figo to connect grab the financial data
 * @docs https://plaid.com/docs/api/#balance
 *       nodejs: https://github.com/plaid/plaid-node
 */

var fs = require('fs');
var path = require('path');
var plaid = require('plaid');

var configFile = path.join(__dirname, '../config.json');
var config = JSON.parse(fs.readFileSync(configFile));

var connect = {
    client: null,
    institution: null,
    creds: {},

    /**
     * Init
     * @use set instance variables
     */
    init: function(account, type, callback) {
        this.client = new plaid.Client(
                config.plaid.client_id,
                config.plaid.secret,
                plaid.environments.tartan);
        if (type === undefined) {
            callback({'error': 'please provide an account type'});

            return;
        }
        if (!config.accounts.hasOwnProperty(account)) {
            callback({'error': 'account not found'});

            return;
        }
        this.creds.username = config.accounts[account].username;
        this.creds.password = config.accounts[account].password;
        this.institution = config.accounts[account].id;
    },

    /**
     * Get
     * @use grab account information, register if no access token or just obtain
     *      data if so
     * @return {json} balance
     */
    get: function(account, type, callback) {
        this.init(account, type, callback);

        if (config.accounts[account].hasOwnProperty('access_token')) {
            this.getBalance(account, type, function(balance) {
                callback(balance);
            });
        } else {
            this.addUserAndGetBalance(account, function(balance) {
                callback(balance);
            });
        }
    },

    /**
     * Add User And Get Balance
     * @use add an authenticated user, store the access token and return
     *      balance
     */
    addUserAndGetBalance: function(account, callback) {
        var options = {};
        var self = this;

        console.log(this);
        this.client.addAuthUser(this.institution, this.creds, options,
                                function(err, mfaResponse, response)
        {
            console.log(err,mfaResponse,response);
            // store access token for later
            config.accounts[account].access_token = response.access_token;
            fs.writeFileSync(configFile, JSON.stringify(config));
        });
    },

    /**
     * Get Balance
     */
    getBalance: function(account, type, callback) {
        var self = this;
        var token = config.accounts[account].access_token;
        this.client.getBalance(token, function(err, resp){
            // keep this for local dev
            console.log(resp.accounts[0].meta);
            console.log(resp.accounts[0].balance);
            console.log(resp.accounts[1].meta);
            console.log(resp.accounts[1].balance);
            console.log(err);

            var balances = self.findBalancesByType(account, type, resp);
            callback(balances);
        });
    },

    /**
     * Find Balances By Type
     * @param {object} response
     * @return {object} account
     */
    findBalancesByType: function(account, type, response) {
        var self = this;
        var balances = {};
        var accounts = response.accounts;
        for (var i = 0; i < accounts.length; i++)
        {
            for (var j = 0; j < type.length; j++)
            {
                if (accounts[i].meta.number ===
                    config.accounts[account].type[type[j]])
                    {
                        balances[type[j]] = accounts[i].balance.available;
                    }
            }
        }

        return balances;
    },
};

module.exports = connect;
