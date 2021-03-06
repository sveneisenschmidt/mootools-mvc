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

    Implements: Events,

    _name: 'Mvc_Registry',

    _storage: {},

    /**
     * Mvc_Router::store
     *
     * @param string key
     * @param mixed value
     * @scope public
     * @return object
     */
    store: function(key, value)
    {

        this._storage[key] = value;
        this.fireEvent('stored', [key, value]);
        return this
    },

    /**
     * Mvc_Router::get
     *
     * @param string key
     * @scope public
     * @return mixed
     */
    get: function(key)
    {
        return this._storage[key];
    },

    /**
     * Mvc_Router::erase
     *
     * @param string key
     * @scope public
     * @return void
     */
    erase: function(key)
    {
        this._storage.erase(key);
        this.fireEvent('erased', [key]);
        return this;
    },

    /**
     * Mvc_Router::getInstance
     *
     * @scope public
     * @return object
     */
    getInstance: function()
    {
        if(!$chk(window._mvcRegistry)) {
            window._mvcRegistry = new Mvc_Registry();
            return window._mvcRegistry;
        }

        return window._mvcRegistry;
    }
});