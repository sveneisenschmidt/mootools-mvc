/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Interface
 */

/**
 * Mvc_Controller_Action_Interface
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Interface
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Controller_Action_Interface = new Class({
    initialize: function(request, response)
    {
        throw new Error("Interface can't be called itself!");
    },
    dispatch: function(action) {
        throw new Error("Method can't be called from its Interface. You have to implement in the child Class!");
    }
});