/**
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Stack
 */

/**
 * Mvc_Controller_Action_Stack
 *
 * @package Mvc_Controller
 * @subpackage Mvc_Controller_Action_Stack
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */


var Mvc_Controller_Action_Stack = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Mvc_Controller_Action_Stack',

    _items: null,

    /**
     * Mvc_Controller_Action_Stack::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function(items)
    {
        this._items = items;
    },

    /**
     * Mvc_Controller_Action_Stack::_getAllStackItems
     *
     * @scope protected
     * @return object
     */
    _getAllStackItems: function()
    {
        return this._items;
    }.protect(),

    /**
     * Mvc_Controller_Action_Stack::hasItemsForRoute
     *
     * @param string routeName
     * @scope public
     * @return boolean
     */
    hasItemsForRoute: function(routeName)
    {
        var hasItems = null;
        var items = this._getAllStackItems();

        items.each(function(item) {
            if($chk(item[routeName]) && hasItems == null) {
                hasItems = true;
            }
        });

        if(!$chk(hasItems)) {
            items.each(function(item) {
                if($chk(item['default']) && hasItems == null) {
                    hasItems = true;
                }
            });
        }

        return $chk(hasItems);
    },

    /**
     * Mvc_Controller_Action_Stack::getItemsForRoute
     *
     * @param string routeName
     * @scope public
     * @return object
     */
    getItemsForRoute: function(routeName)
    {
        var returnItems = null;
        var items = this._getAllStackItems();

        items.each(function(item) {
            if($chk(item[routeName]) && returnItems == null) {
                returnItems = item[routeName];
            }
        });

        if(!$chk(returnItems)) {
            items.each(function(item) {
                if($chk(item['default']) && returnItems == null) {
                    returnItems = item['default'];
                }
            });
        }

        return returnItems;
    }
});