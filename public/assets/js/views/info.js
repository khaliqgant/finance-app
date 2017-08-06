/**
 * Info View
 * @dependencies https://atomiks.github.io/tippyjs/
 */

/* global document */

'use strict';

var Backbone       = require('backbone');
var $              = require('jquery');
var vars           = require('../vars');
var tippy          = require('tippy.js');

var Info = Backbone.View.extend({

    initialize: function () {

        tippy(vars.info, {
            position: 'right',
            theme: 'light'
        });

        $(document).on('click', vars.info, this.editInfo);

    },

    /**
     *
     * Edit Info
     * @desc change value to a input box when a pencil is clicked
     *
     */
    editInfo: function (e) {

        console.log('edit info');
        // TODO

    },

});

module.exports = Info;
