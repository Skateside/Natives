/**
 * Unlike actual JavaScript, these natives do not inherit from O. Therefore, we
 * can add methods unique to O that do not affect the other types.
 */
var O = (function (native) {

    'use strict';

    var Obj = native.createPrimative({

            coerce: function (value) {
                return Object(value);
            }

        }),

        O = native.makeWrapper(Obj);

    [
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable'
    ].forEach(function (method) {

        Obj.prototype[method] = function () {
            return P(Object.prototype[method].apply(this.value, arguments));
        };

    });

    [
        'create',
        'defineProperty',
        'defineProperties',
        'freeze',
        'getOwnPropertyDescriptor',
        'getOwnPropertyNames',
        'getPrototypeOf',
        'isExtensible',
        'isFrozen',
        'isSealed',
        'keys',
        'preventExtensions',
        'seal'
    ].forEach(function (method) {

        O[method] = function () {
            return P(Object[method].apply(null, arguments));
        };

    });

    return O;

}(NATIVE));