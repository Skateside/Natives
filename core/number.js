/**
 * Numbers have very few methods in ES5.
 */
var N = (function (native) {

    'use strict';

    var Num = native.createPrimative({

        coerce: function (value) {
            return +value;
        }

    });

    /**
     * Any method that would return a string should go through Pstring.
     */
    [
        'toExponential',
        'toFixed',
        'toLocaleString',
        'toPrecision'
    ].forEach(function (method) {

        Num.prototype[method] = function () {
            return P(Number.prototype[method].apply(this.value, arguments));
        };

    });

    return native.makeWrapper(Num);

}(NATIVE));