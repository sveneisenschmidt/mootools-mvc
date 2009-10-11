/**
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Headlink
 */

/**
 * Mvc_View_Helper_Headlink
 *
 * @package Mvc_View
 * @subpackage Mvc_View_Helper_Headlink
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_View_Helper_Headtitle = new Class({

    _name: 'Mvc_View_Helper_Headtitle',

    _headTitle: '',

    _preserveOld: false,

    _oldTitle: null,

    /**
     * Mvc_View_Helper_Headtitle::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function() {},

    /**
     * Mvc_View_Helper_Headtitle::set
     *
     * @param sting value
     * @param string type
     * @scope public
     * @return object
     */
    set: function(value, type)
    {
        if(!$chk(type)) {
            this._headTitle = value;
        } else if(type == 'append') {
            this._append(value);
        } else if(type == 'prepend') {
            this._prepend(value);
        }
        return this;
    },

    /**
     * Mvc_View_Helper_Headtitle::execute
     *
     * @scope public
     * @return object
     */
    execute: function(frontController)
    {   
        if(!$chk(this._headTitle)) {
            return false;
        }

        this._oldTitle = document.title;

        if(this._preserveOld) {


            document.title = document.title + " - " + this._headTitle;
        } else {
            document.title = this._headTitle;
        }
        

        var headTitleEvent = function() {
            document.title = this._oldTitle;
            frontController.removeEvent('beforeRouteStartup', headTitleEvent);
        }.bind(this);
        
        frontController.addEvent('beforeRouteStartup', headTitleEvent);

        return true;        
    },

    /**
     * Mvc_View_Helper_Headtitle::preserveOldTitle
     *
     * @param bool boolean
     * @scope public
     * @return object
     */
    preserveOldTitle: function(bool)
    {
        this._preserveOld = bool;
        return this;
    },

    /**
     * Mvc_View_Helper_Headtitle::_append
     *
     * @param sting value
     * @scope protected
     * @return void
     */
    _append: function(value)
    {
        this._set(this._headTitle + value);
    }.protect(),

    /**
     * Mvc_View_Helper_Headtitle::_prepend
     *
     * @param sting value
     * @scope protected
     * @return void
     */
    _prepend: function(value)
    {
        this._set(value + this._headTitle);
    }.protect(),
    
    /**
     * Mvc_View_Helper_Headtitle::_set
     *
     * @param sting value
     * @scope protected
     * @return void
     */
    _set: function(value)
    {
        this._headTitle = value;
    }.protect()
});