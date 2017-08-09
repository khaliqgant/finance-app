/**
 *  Input
 *  @desc
 */

/* global $ */
/* global jQuery */
/* global _ */
/* global Backbone */
/* global window */
/* global document */
/* global _dev */
/* global URI */
/* global vmg_submit_form */
/* global canvg */
/* global vmg_update_cart_preview */

'use strict';

function Input() {
}

Input.prototype = {

    map: function ($el) {

        var data = {};
        data.name = $el.attr('name');
        data.key = $el.attr('data-key');
        data.parent = $el.parents('.circle').attr('data-name')
            .toLowerCase();

        return data;

    },
};

module.exports = Input;
