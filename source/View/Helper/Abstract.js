/**
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Abstract
 */

/**
 * Mvc_View_Helper_Abstract
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Abstract
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_View_Helper_Abstract = new Class({

    Implements: [Mvc_Class_Base],

    /**
     * Mvc_View_Helper_Abstract::execute
     *
     * @scope public
     * @return void
     */
    execute: function() {
        throw new Error("Method can't be called from its parent. You have to overwrite this method in you class!");
    }
});