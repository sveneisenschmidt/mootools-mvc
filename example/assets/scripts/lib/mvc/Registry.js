/**
 *
 * @package Mvc_Registry
 * @subpackage Mvc_Registry
 */

/**
 * Mvc_Registry
 *
 * @package Mvc_Registry
 * @subpackage Mvc_Registry
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Registry = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Mvc_Registry',

    _storage: {},

    initialize: function(type) {},

    store: function(key, value)
    {
        this._storage[key] = value;
    },

    get: function(key)
    {
        return this._storage[key];
    },

    getInstance: function()
    {
        if(!$chk(window._mvcRegistry)) {
            window._mvcRegistry = new Mvc_Registry();
            return window._mvcRegistry;
        }

        return window._mvcRegistry;
    }
});