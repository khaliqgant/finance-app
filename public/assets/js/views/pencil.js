/**
 * Pencil View
 */

/* global document */

'use strict';

var Backbone       = require('backbone');
var $              = require('jquery');
var vars           = require('../vars');

var Pencil = Backbone.View.extend({

    initialize: function () {

        $(document).on('click', vars.pencil, this.swap);

    },

    /**
     *
     * Swap
     * @desc change value to a input box when a pencil is clicked
     *
     */
    swap: function (e) {

        var $li = $(this).parents('li');
        var key = $li.attr('data-key');
        var info = $(this).parent('span').attr('data-has-info');
        var model = $(this).parents('.financial').attr('data-model');
        var note = false;

        if (!$li.find(vars.confirm).length) {
            var input = '<input name="' + model + '"' +
                'type="text" data-key="' + key + '"';
            if (info) {
                input += 'data-info="' + info + '"';
            }

            input += 'class="text-input js-pay-input">' +
                ' <i class="fa fa-check-circle js-confirm">' +
                '</i>';

            // put before and hide that element
            if ($(this).parent('span').length) {
                $(this).parent('span').before(input);
            } else {
                // dealing with a note
                var previousText = $li.text();
                $li.html(input).append(vars.pencilHtml);
                $li.find(vars.payInput).attr(
                    'data-value', previousText
                ).addClass('js-value');
                $li.find(vars.pencil).hide();
                note = true;
            }
        } else {
            $(vars.payInput).css('display', 'inline-block');
            $(vars.confirm).show();
        }

        $li.find(vars.payInput).focus();
        $li.find(vars.payInput).val('');

        if (note) {
            $li.find(vars.payInput).val(previousText);
        }

        $(this).parent('span').hide();

    },

});

module.exports = new Pencil();
