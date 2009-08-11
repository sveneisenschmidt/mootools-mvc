/**
 *
 * @package Mvc_Config
 * @subpackage Mvc_Config
 */

/**
 * Mvc_Config
 *
 * @package Mvc_Config
 * @subpackage Mvc_Configw
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license MIT-Style License
 * @access public
 */

var Mvc_Config = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Mvc_Config',

    _storage: {},

    initialize: function(type)
    {
        if(!$chk(type)) {
            return this;
        }
        return eval('new Mvc_Config_' + type + '()');
    },

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
        if(!$chk(window._mvcConfig)) {
            window._mvcConfig = new Mvc_Config();
            return window._mvcConfig;
        }

        return window._mvcConfig;
    }
});