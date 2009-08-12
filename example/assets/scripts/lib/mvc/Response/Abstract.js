/**
 *
 * @package Mvc_Response
 * @subpackage Mvc_Response_Abstract
 */

/**
 * Mvc_Response_Abstract
 *
 * @package Mvc_Response
 * @subpackage Mvc_Response_Abstract
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Response_Abstract = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Mvc_Response_Abstract',

    _responseBody: [],

    _responseHelpers: null,

    /**
     * Mvc_Response_Abstract::appendBody
     *
     * @param string key
     * @param string value
     * @scope public
     * @return object
     */
    appendBody: function(key, value)
    {
        this._responseBody.include(
            {
                'target': key,
                'content': value
            }
        );

        return this;
    },

    /**
     * Mvc_Response_Abstract::getResponseBody
     *
     * @scope public
     * @return object
     */
    getResponseBody: function()
    {
        return this._responseBody;
    },

    /**
     * Mvc_Response_Abstract::appendHelpers
     *
     * @param object helpers
     * @scope public
     * @return object
     */
    appendHelpers: function(helpers)
    {
        for(var helper in helpers) {
            if(!$chk(this._responseHelpers)) {
                this._responseHelpers = [];
            }
            this._responseHelpers.include(helpers[helper]);
        }
        return this;
    },

    /**
     * Mvc_Response_Abstract::getViewHelpers
     *
     * @scope public
     * @return object
     */
    getViewHelpers: function()
    {
        return this._responseHelpers;
    }
});