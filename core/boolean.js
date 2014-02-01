/**
 * Booleans have no properties or methods in ES5. This wrapper is included only
 * for a sense of completeness.
 */
var B = (function (native) {

    'use strict';

    var Bool = native.createPrimative({

        /**
         * Coerces a variable into being a boolean.
         * 
         * @param {*} value Original variable.
         * @return {boolea} Boolean version of original variable.
         */
        coerce: function (value) {
            return !!value;
        },

        /**
         * Returns either "true" or "false" depending on the truthiness of the
         * value.
         */
        toString: function () {
            return this.value ? 'true' : 'false';
        }

    });

    return native.makeWrapper(Bool);

}(NATIVE));