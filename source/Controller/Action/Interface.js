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

    /**
     * Mvc_Controller_Action_Interface::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()
    {
        throw new Error("Interface can't be called itself!");
    },

    /**
     * Mvc_Controller_Action_Interface::dispatch
     *
     * @scope public
     * @return void
     */
    dispatch: function() {
        throw new Error("Method can't be called from its Interface. You have to implement in the child Class!");
    },

    /**
     * Mvc_Controller_Action_Interface::render
     *
     * @scope public
     * @return void
     */
    render: function() {
        throw new Error("Method can't be called from its Interface. You have to implement in the child Class!");
    }
});