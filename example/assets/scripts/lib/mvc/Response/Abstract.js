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
 * @license MIT-Style License
 * @access public
 */

var Mvc_Response_Abstract = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Mvc_Response_Abstract',

    _responseBody: [],

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

    getResponseBody: function()
    {
        return this._responseBody;
    }
});