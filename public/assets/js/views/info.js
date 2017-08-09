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
            theme: 'light',
            dynamicTitle: true
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

        var $li = $(this).parents('li');
        var key = $li.attr('data-key');
        var model = $(this).parents('.financial').attr('data-model');
        var oldInfo = $(this).attr('data-original-title');
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
        $li.find(vars.infoInput).val(oldInfo);

    },

});

module.exports = Info;
