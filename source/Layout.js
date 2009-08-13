/**
 *
 * @package Mvc_Layout
 * @subpackage Mvc_Layout
 */

/**
 * Mvc_Layout
 *
 * @package Mvc_Layout
 * @subpackage Mvc_Layout
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_Layout = new Class({

    Implements: [Mvc_Class_Base],

    _name: 'Mvc_Layout',

    _scriptPath: null,

    _target: null,

    _layoutHtml: null,

    /**
     * Mvc_Layout::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function() {},

    /**
     * Mvc_Layout::start
     *
     * @scope public
     * @return object
     */
    start: function()
    {
        if(!$chk(this._getLayoutHtml())) {
            this._setLayoutHtml(this._getLayoutFile());
        }

        this.getTarget().set('html', this._getLayoutHtml());
        return this;
    },

    /**
     * Mvc_Layout::_getLayoutHtml
     *
     * @scope protected
     * @return object
     */
    _getLayoutHtml: function()
    {
        return this._layoutHtml;
    }.protect(),

    /**
     * Mvc_Layout::_setLayoutHtml
     *
     * @param string html
     * @scope protected
     * @return void
     */
    _setLayoutHtml: function(html)
    {
        this._layoutHtml = html;
    }.protect(),

    /**
     * Mvc_Layout::_getLayoutFile
     *
     * @scope protected
     * @return string
     */
    _getLayoutFile: function()
    {
        var request = new Request.HTML({method: 'get', url: this.getScriptPath(), async: false, evalScripts: false}).send();

        if(!$chk(request.isSuccess())) {
            new Mvc_Exception('No File for Layout found under: "' + this.getScriptPath() + '"!');
        }

        return request.response.html;

    }.protect(),

    /**
     * Mvc_Layout::setScriptPath
     *
     * @param string path
     * @scope public
     * @return object
     */
    setScriptPath: function(path)
    {
        this._scriptPath = path;
        return this;
    },

    /**
     * Mvc_Layout::getScriptPath
     *
     * @scope public
     * @return string
     */
    getScriptPath: function()
    {
        return this._scriptPath;
    },

    /**
     * Mvc_Layout::setTarget
     *
     * @param mixed target
     * @scope public
     * @return object
     */
    setTarget: function(target)
    {
        if($type(target) == 'element') {
            this._target = target;
        }
        if($type(target) == 'string') {
            this._target = document.getElement(target);
        }
        return this;
    },

    /**
     * Mvc_Layout::getTarget
     *
     * @scope public
     * @return object
     */
    getTarget: function()
    {
        return this._target;
    },

    /**
     * Mvc_Layout::getElement
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getElement: function(selector)
    {
        return this.getTarget().getElement(selector);
    }

});