/**
 * A plugin to add logic gates to the B wrapper.
 */
(function () {

    'use strict';

    B.extend({

        and: function (value) {

            return this.init(this.value && value);

        },

        or: function (value) {

            return this.init(this.value || value);

        },

        not: function () {

            return this.init(!this.value);

        },

        xor: function (value) {

            return this.init((!this.value && value) || (this.value && !value));

        },

        nand: function (value) {

            return this.and(value).not();

        },

        nor: function (value) {

            return this.or(value).not();

        },

        xnor: function (value) {

            return this.xor(value).not();

        }

    });

}());