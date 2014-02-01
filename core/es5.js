/**
 * This function defines all wrappers for the native variables and adds methods
 * to bring them up to ES5 standards.
 *
 * As a quick reference, the first letter of the variable type is the wrapper:
 * A = Array
 * B = Boolean
 * F = Function
 * N = Number
 * O = Object
 * S = String
 *
 * This script also shows how to create a modify the wrappers to allow for
 * future modifications.
 */

var A = (function (native) {

    'use strict';

    

}(NATIVE));

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
