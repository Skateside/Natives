/**
 * Core is the main NATIVE function which every wrapper uses.
 */

var NATIVE = (function () {

    'use strict';

        /**
         * Empty "no operation" function.
         */
    var noop = function () {
            return;
        },

        /**
         * @type {Object} native Populated and returned.
         * @alias NATIVE
         */
        native = {},

        /**
         * @type {Function} Primative Primative variable - built later.
         */
        Primative = null,

        /**
         * @type {Function} ArrayLike Array-like variable - built later.
         */
        ArrayLike = null,

        /**
         * @type {Function} hasOwn Short-cut to Object.prototype.hasOwnProperty.
         */
        hasOwn = Object.prototype.hasOwnProperty,

        /**
         * @type {RegExp} fnTest Regular expression test for methods to see if
         * they have the "$super" magic method. If it can't be detected, assume
         * that all do.
         */
        fnTest = /xyz/.test(function () { xyz; }) ?
                /[\.'"]\$super\b/ :
                /.*/;

    /**
     * Extends an object with the properties in one or more other objects.
     * 
     * @param {Object} source Source object to extend.
     * @param {...Object} extension Objects used to extend the source.
     * @return {Object} Extended source object.
     */
    function extendObject(source) {

        var extensions = Array.prototype.slice.call(arguments, 1),
            length     = extensions.length,
            i          = 0,
            prop       = '';

        while (i < length) {

            for (prop in extensions[i]) {

                if (hasOwn.call(extensions[i], prop)) {

                    source[prop] = extensions[i][prop];

                }

            }

            i += 1;

        }

        return source;

    }

    /**
     * Adds a single method to a prototype. This added method will have access
     * to the $super magic method for easy access to the parent's prototype
     * method.
     *
     * @this Constructor function.
     * @param {string} name Name of the method.
     * @param {Function} method Function to be executed.
     */
    function addMethod(name, method) {

        var parent = this.parent;

        this.prototype[name] = typeof method === 'function' &&
                typeof parent[name] === 'function' &&
                fnTest.test(method) ?

                    (function (nm, meth) {

                        return function () {

                            var hasSuper = '$super' in this,
                                temp     = this.$super,
                                ret      = null;

                            this.$super = parent[nm];

                            ret = meth.apply(this, arguments);

                            if (hasSuper) {
                                this.$super = temp;
                            } else {
                                delete this.$super;
                            }

                            return ret;

                        };

                    }(name, method)) :

                    method;


    }

    /**
     * Short-cut for adding multiple methods to a prototype with the $super
     * magic method enabled.
     *
     * @this Constructor function.
     * @param {Object} proto Methods to add to the prototype in key/value pairs
     * of method name => method.
     */
    function addMethods(proto) {

        var prop = '';

        for (prop in proto) {
            if (hasOwn.call(proto, prop)) {
                addMethod.call(this, prop, proto[prop]);
            }
        }

    }

    /**
     * A simple function to allow a user to pass either a name and method or an
     * object and the appropriate function (addMethod / addMethods) will be
     * called.
     *
     * @this Constructor function.
     * @param {string|Object} name Either the name of the method or an object of
     * all methods.
     * @param {?Function} method Method function if name is a string.
     */
    function extend(name, method) {

        if (name && typeof name === 'object') {
            addMethods.call(this, name);
        } else {
            addMethod.call(this, name, method);
        }

    }

    /**
     * Creates a new class, possibly based on an old one.
     *
     * @param {Function=} Base Optional base class that the new one will inherit
     * from.
     * @param {Object} proto Methods and properties to be added to the new
     * class' prototype.
     * @return {Function} New class constructor.
     */
    function createClass(Base, proto) {

        /**
         * Empty function so a constructor function isn't called when
         * inheriting.
         *
         * @constructor
         */
        var B = noop;

        /**
         * Base function for the new class. All new classes push everything into
         * an init method.
         *
         * @constructor
         */
        function F() {
            this.init.apply(this, arguments);
        }

        // Allow the Base to be optional.
        if (!proto) {

            proto = Base;
            Base  = Object;

        }

        // Add a static property for the parent.
        F.parent = Base.prototype;

        // Inherit from Base.
        B.prototype = Base.prototype;
        F.prototype = new B();

        // Add all methods to the new prototype.
        addMethods.call(F, proto);

        // Basic constructor hack.
        F.prototype.constructor = F;

        // Allow a class to me made without a constructor function.
        if (typeof F.prototype.init !== 'function') {
            F.prototype.init = noop;
        }

        // Expose a prototype extension method that enables the $super magic
        // method.
        F.extend = extend;

        // Return the constructor.
        return F;

    }

    /**
     * @lends Primative.prototype
     */
    Primative = createClass({

        /**
         * @constructor
         * @param {*} value Variable to be wrapped.
         * @property {*} value Primative variable after any modification.
         * @return {Primative} Primative instance to allow for chaining.
         */
        init: function (value) {

            this.value = this.coerce(value);

            return this;

        },

        /**
         * Allows a value to be type-casted (or "coerced") into another type.
         *
         * @param {*} value Value to coerce.
         * @return {*} Coerced value.
         */
        coerce: function (value) {
            return value;
        },

        /**
         * Converts the instance into a string. Typically this just returns the
         * value as a string.
         * 
         * @return {string} Value property as a string.
         */
        toString: function () {
            return String(this.value);
        },

        /**
         * A method that always returns the un-wrapped value.
         * 
         * @return {*} Un-wrapped value.
         */
        toNative: function () {
            return this.value;
        }

    });

    /**
     * @lends ArrayLike.prototype
     * @extends Primative
     */
    ArrayLike = createClass(Primative, {

        /**
         * @override
         */
        init: function (value) {

            this.$super(value);

            this.clearArray();
            this.simArray(this.toArray());

            return this;

        },

        /**
         * Removes any properties created by the array making.
         */
        clearArray: function () {

            while (this.length) {
                Array.prototype.pop.call(this);
            }

        },

        /**
         * Converts this instance into an Array.
         * 
         * @return {Array} Array of this instance.
         */
        toArray: function () {
            return Array.prototype.slice.call(this);
        },

        /**
         * Pushes the numeric properties of the arrayLike variable onto this
         * instance and sets this instance's length property to match the array.
         * 
         * @param {Array|Object} arrayLike Array (or array-like object) that
         * this instance should be modified to simulate.
         */
        simArray: function (arrayLike) {
            Array.prototype.push.apply(this, arrayLike);
        }

    });

    /**
     * @lends native
     */
    extendObject(native, {

        /**
         * Creates a wrapper for the vativew variable types.
         *
         * @param {Function} Base Base function. The wrapper returns a new 
         * instance of Base.
         * @return {Function} Wrapper with a couple of useful static methods.
         */
        makeWrapper: function (Base) {

            var p = Base.prototype,
                W = function (value) {
                    return new Base(value);
                };

            extendObject(W, {

                extend: extend.bind(Base),

                has: function (extension) {
                    return extension in p;
                }

            });

            return W;

        },

        /**
         * Expose the createClass function for easy reference.
         */
        createClass: createClass,

        /**
         * Expose the extendObject function for easy reference.
         */
        extendObject: extendObject,

        /**
         * Expose the Primative function for future modification.
         */
        Primative: Primative,

        /**
         * Expose the ArrayLike function for future modification.
         */
        ArrayLike: ArrayLike,

        /**
         * A simple function to facilitate creating a class based on Primative.
         */
        createPrimative: createClass.bind(null, Primative),

        /**
         * A simple function to facilitate creating a class based on ArrayLike.
         */
        createArrayLike: createClass.bind(null, ArrayLike)

    });

    return native;

}());


/**
 * P is a Primative wrapper that attempts to guess the correct wrapper to use
 * based on the variable. If the variable is not recognised, an error is thrown.
 * 
 * @param {*} value Variable to attempt to wrap.
 * @return {NATIVE.Primative|*} Primative wrapper for the given variable or an
 * unerapped variable if the variable type is not recognised.
 */
function P(value) {

    var mapped = P.map[Object.prototype.toString.call(value)],
        retVal = value;

    if (mapped) {
        retVal = P.name[mapped](value);
    }

    return retVal;

}

/**
 * @type {Object} map P.map is the map used. The result of
 * Object.prototype.toString is the key and the wrapper name is the value.
 */
P.map = {
    '[object Array]':    'A',
    '[object Boolean]':  'B',
    '[object Function]': 'F',
    '[object Number]':   'N',
    '[object Object]':   'O',
    '[object String]':   'S'
};

/**
 * @type {Object} name P.name is the namespace in which the wrappers live. By
 * default the wrappers are global so the namespace is the window global
 * variable.
 */
P.name = window;
