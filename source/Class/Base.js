/**
 *
 * @package Mvc_Class
 * @subpackage Mvc_Class_Base
 */

/**
 * Mvc_Class_Base
 *
 * @package Mvc_Class
 * @subpackage Mvc_Class_Base
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Class_Base = new Class({

    _name: 'Mvc_Class_Base',

    /**
     * Mvc_Class_Base::getClassName
     *
     * @scope public
     * @return string
     */
    getClassName: function()
    {
        return this._name;
    }
});