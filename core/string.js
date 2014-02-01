var S = (function (native) {

    'use strict';

    var Str = native.createArrayLike({

        coerce: function (value) {
            return String(value);
        },

        toArray: function () {
            return this.value.split('');
        },

        split: function (divider) {
            return P(this.value.split(divider || ''));
        }

    });

    /**
     * Add on all String.prototype methods that return a string.
     */
    [
        'charAt',
        'concat',
        'replace',
        'slice',
        'substr',
        'substring',
        'toLocaleLowerCase',
        'toLocaleUpperCase',
        'toLowerCase',
        'toUpperCase',
        'trim'
    ].forEach(function (method) {

        Str.prototype[method] = function () {

            return this.init(
                String.prototype[method].apply(this.value, arguments)
            );

        };

    });

    /**
     * All methods that return a number should pass that value through Pnumber.
     */
    [
        'charCodeAt',
        'indexOf',
        'lastIndexOf',
        'localeCompare',
        'search'
    ].forEach(function (method) {

        Str.prototype[method] = function () {
            return P(String.prototype[method].apply(this.value, arguments));
        };

    });

    /**
     * Any method that returns something other than a string or a number should
     * just return the native object.
     */
    [
        'match'
    ].forEach(function (method) {

        Str.prototype[method] = function () {
            return P(String.prototype[method].apply(this.value, arguments));
        };

    });

    return native.makeWrapper(Str);

}(NATIVE));