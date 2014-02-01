/**
 * Functions don't have many methods in ES5. The unique thing about them in this
 * library is that if a non-function is passed to the wrapper, an error is
 * thrown.
 */
var F = (function (native) {

    'use strict';

    var Func = native.createPrimative({

        init: function (value) {

            if (typeof value !== 'function') {
                throw new TypeError(value + ' is not a function');
            }

            this.$super(value);

        },

        toString: function () {
            return this.value.toString();
        }

    });

    [
        'apply',
        'bind',
        'call'
    ].forEach(function (method) {

        Func.prototype[method] = function () {
            return P(Function.prototype[method].apply(this, arguments));
        };

    });

    return native.makeWrapper(Func);

}(NATIVE));