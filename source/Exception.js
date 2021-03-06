/**
 *
 * @package Mvc_Exception
 * @subpackage Mvc_Exception
 */

/**
 * Mvc_Exception
 *
 * @package Mvc_Exception
 * @subpackage Mvc_Exception
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Exception = new Class({

    _name: 'Mvc_Exception',

    initialize: function(msg)
    {
        throw new Error(msg);
    }
});