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

var InfoAdd = Backbone.View.extend({

    initialize: function () {

        $(document).on('click', vars.infoCreate, this.addInfo);

    },

    /**
     *
     * Add Info
     * @desc change value to a input box when a pencil is clicked
     *
     */
    addInfo: function (e) {

        $(this).hide();
        var $li = $(this).parents('li');
        var key = $li.attr('data-key');
        var model = $(this).parents('.financial').attr('data-model');
        var associatedValue = $li.find('.js-value').attr('data-value');
        if (!$li.find(vars.confirmInfo).length) {
            var input = '<input name="' + model + '"' +
                'type="text" data-key="' + key + '"' +
                'data-associated-value="' + associatedValue + '"' +
                'class="info-input js-info-input">' +
                ' <i class="fa fa-check-circle js-confirm-info">' +
                '</i>';
            $(this).after(input);
        } else {
            $(vars.infoInput).css('display', 'inline-block');
            $(vars.confirmInfo).show();
        }

        $li.find(vars.infoInput).focus();

    },

});

module.exports = new InfoAdd();

