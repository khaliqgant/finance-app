/**
 * Layout Model
 */

var Backbone    = require('backbone');
var Layout = Backbone.Model.extend({

    defaults: {
        sections: [
            'debt',
            'cash',
            'to_pay',
            'notes',
            'links'
        ]
    },

});

module.exports = new Layout();
