/**
 * Server.js
 * @author Khaliq Gant
 * @use handles all the requests to the server via ajax
 * @dependencies :
 *      Moment.js : https://github.com/moment/moment
 *      Backbone : http://backbonejs.org/
 */

'use strict';

var $        = require('jquery');
var vars     = require('./vars');
var moment   = require('moment');
var Backbone = require('backbone');
var Q        = require('q');

var Server = {
    /**
     * Post It
     * @use make a post update to change the json
     * @param {string} name - of the field to change
     * @param {object} model - of what want to change
     */
    postIt : function(model,name,key,value,par,id,date,callback) {
        var file;
        var entryPoint;
        var object;
        var change;
        var parent;
        if (model.remote) {
            file = 'data/' + model.file;
            entryPoint = file.split('/')[1];
            if (id === false) {
                object = undefined;
                change = key;
                parent = par;
            } else {
                object = par;
                parent = key;
                change = name;
            }
        } else {
            // not a remote file but the root
            file = 'data/' + date + '.json';
            entryPoint = name;
            object = id;
            parent = par;
            change = key;
        }
        var data = {
            file : file,
            entryPoint : entryPoint,
            object : object,
            parent : parent,
            key : change,
            value : value
        };

        $.ajax({
            type: 'POST',
            url: '/update',
            data: data,
            success: function(data,textStatus,jqXHR){
                if (typeof callback === 'function'){
                    callback(data);
                }
            },
            dataType: 'json'
        });
    },

    /**
     * Next Month Check
     * @use run a check to see if next months file exsits, if it doesn't
     *      set some instance variables
     */
    nextMonthCheck : function(date) {
        var nextMonth = moment(date,'YYYY_MM')
            .add(1, 'months').format('YYYY_MM');
        var url = 'data/' + nextMonth + '.json';
        var lastMonth = 'data/' + date + '.json';
        var exists = true;

        $.ajax({
            type: 'HEAD',
            url: 'data/' + nextMonth + '.json',
            success: function(data,textStatus,jqXHR){
                // proceed
            },
            error : function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    exists = false;
                }
            },
            complete : function(jqXHR,textStatus) {
                if (!exists) {
                    $(vars.increaseMonth).addClass('inactive');
                    $(vars.increaseMonth).attr('data-url',url);
                    $(vars.increaseMonth).attr('data-lastMonth',lastMonth);
                    $(vars.increaseMonth).attr('data-rawDate',nextMonth);
                } else {
                    $(vars.increaseMonth).removeClass('inactive');
                    $(vars.increaseMonth).attr('data-url',url);
                    $(vars.increaseMonth).attr('data-lastMonth',lastMonth);
                    $(vars.increaseMonth).attr('data-rawDate',nextMonth);
                }
            },
        });
    },


    /**
     * Previous Month Check
     * @use run a check if the previous month exists and hide it if it doesn't
     */
    previousMonthCheck : function(date) {
        var lastMonth = moment(date,'YYYY_MM')
            .subtract(1, 'months').format('YYYY_MM');
        var url = 'data/' + lastMonth + '.json';
        var exists = true;

        $.ajax({
            type: 'HEAD',
            url: 'data/' + lastMonth + '.json',
            success: function(data,textStatus,jqXHR){
                // proceed
            },
            error : function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status === 404) {
                    exists = false;
                }
            },
            complete : function(jqXHR,textStatus) {
                if (!exists) {
                    $(vars.decreaseMonth).hide();
                } else {
                    $(vars.decreaseMonth).show();
                }
            },
        });

    },

    /**
     * Post Promise
     * @use utility ajax POST call
     * @return ajax promise
     */
    postPromise : function(data,endpoint,callback) {
        return  $.ajax({
            type: 'POST',
            url: endpoint,
            data: data,
            success: function(data,textStatus,jqXHR){
                // nada
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log('whoops!');
            },
            dataType: 'json'
        });
    },

    /**
     * Get Promise
     * @use utility ajax GET request
     * @return ajax promise
     */
    getPromise : function(endpoint) {
        return $.ajax({
            type: 'GET',
            url: endpoint,
            success: function(data, textStatus, jqXHR) {
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log('whoops!');
            },
            dataType: 'json'
        });
    },

    /**
     * New Month
     * @use makes post request to add a new month data file
     */
    newMonth : function(data,callback) {
        $.ajax({
            type: 'POST',
            url: '/new',
            data: data,
            success: function(data,textStatus,jqXHR){
                // nada
            },
            error : function(jqXHR, textStatus, errorThrown) {
                console.log('whoops!');
            },
            dataType: 'json'
        }).done(function(){
            if (typeof callback === 'function') {
                callback(true);
            }
        });
    },

    note : {
        /**
         * Post Note
         * @use handler to post a note
         */
        update : function(data,callback) {
            $.ajax({
                type: 'POST',
                url: '/updateNote',
                data: data,
                success: function(data,textStatus,jqXHR){
                    if (typeof callback === 'function'){
                        callback(data);
                    }
                },
                dataType: 'json'
            });
        },

        add : function(file,model,value,key,callback) {
            var data = {
                file : file,
                model : model,
                key : key,
                value : value
            };

            // send request
            $.ajax({
                type: 'POST',
                url: '/addNote',
                data: data,
                success: function(data,textStatus,jqXHR){
                    if (typeof callback === 'function'){
                        callback(data);
                    }
                },
                dataType: 'json'
            });
        },

        /**
         * Delete Note
         * @use send post request to delete a note item in the array
         */
        remove : function(data,callback) {
            $.ajax({
                type: 'POST',
                url: '/deleteNote',
                data: data,
                success: function(data,textStatus,jqXHR){
                    if (typeof callback === 'function'){
                        callback(data);
                    }
                },
                dataType: 'json'
            });
        },

        /**
         * Add Section
         * @use add in a note section
         */
        addSection : function(data,callback) {
            // TODO

        },

        removeSection : function(data,callback) {
            // TODO

        },
    },
};

module.exports = Server;
