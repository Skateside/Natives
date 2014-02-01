/**
 * The Array wrapper attempts to maintain things like the numberic indices and
 * the length property. Be warned that directly deleting or adding numberic
 * indixes will not be reflected in the length property.
 */
var A = (function (native) {

    'use strict';

    var Arr = native.createArrayLike({

            coerce: function (value) {
                return this.toArray.call(value);
            }

        }),

        A = native.makeWrapper(Arr),

        arrProto = Array.prototype;

    // Accessor and Mutator methods that return arrays.
    [
        'concat',
        'reverse',
        'sort',
        'slice',
        'splice'
    ].forEach(function (method) {

        Arr.prototype[method] = function () {
            return this.init(arrProto[method].apply(this.value, arguments));
        };

    });

    // Mutator methods that return entries in an array.
    [
        'pop',
        'push',
        'shift',
        'unshift'
    ].forEach(function (method) {

        Arr.prototype[method] = function () {

            var value  = this.value,
                result = arrProto[method].apply(value, arguments);

            this.init(value);

            return P(result);

        };

    });

    // Iterator methods.
    [
        'every',
        'filter',
        'forEach',
        'indexOf',
        'lastIndexOf',
        'map',
        'some',
        'reduce',
        'reduceRight'

    ].forEach(function (method) {

        Arr.prototype[method] = function () {
            return P(arrProto[method].apply(this.value, arguments));
        };

    });

    /**
     * Simple mapping of Array.isArray.
     */
    A.isArray = Array.isArray;

    return A;

}(NATIVE));
