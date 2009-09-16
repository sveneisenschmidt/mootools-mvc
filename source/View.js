/**
 *
 * @package Mvc_View
 * @subpackage Mvc_View
 */

/**
 * Mvc_View
 *
 * @package Mvc_View
 * @subpackage Mvc_View
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */

var Mvc_View = new Class({

    _name: 'Mvc_View',

    _scriptPath: null,

    _helpers: {},

    vars: {},

    _renderContainer: null,

    _controller: null,

    /**
     * Mvc_View::initialize
     *
     * @scope public
     * @return void
     */
    initialize: function()
    {
        return this._setupRenderContainer();
    },

    /**
     * Mvc_View::getHelpers
     *
     * @scope public
     * @return object
     */
    getHelpers: function()
    {
        return this._helpers;
    },

    /**
     * Mvc_View::getHelper
     *
     * @scope public
     * @return object
     */
    getHelper: function(helper)
    {
        var helperName = helper.toLowerCase();
            helperName = helperName[0].toUpperCase() + helperName.substr(1, helperName.length);

        var helper = helper.toLowerCase();

        if(!$chk(this._helpers[helper.toLowerCase()])){
            this._helpers[helper] = eval('new Mvc_View_Helper_' + helperName);
            return this._helpers[helper];
        }
        
        return this._helpers[helper];
    },

    /**
     * Mvc_View::_setupRenderContainer
     *
     * @scope protected
     * @return void
     */
    _setupRenderContainer: function()
    {
        this._renderContainer = new Element('div', {
            'styles': {
                'display': 'none',
                'visibility': 'hidden'
            },
            'class': '_mvcRenderContainer',
            'text': 'test'
        }).inject(document.getElement('body'), 'bottom');

        return this;
    }.protect(),

    /**
     * Mvc_View::getRenderContainer
     *
     * @scope protected
     * @return element
     */
    _getRenderContainer: function()
    {
        return document.getElement('div._mvcRenderContainer');
    }.protect(),

    /**
     * Mvc_View::setScriptPath
     *
     * @param string path
     * @scope public
     * @return void
     */
    setScriptPath: function(path)
    {
        this._scriptPath = path;
    },

    /**
     * Mvc_View::assign
     *
     * @param string key
     * @param mixed value
     * @scope public
     * @return void
     */
    assign: function(key, value)
    {
        this.vars[key] = value;
    },

    /**
     * Mvc_View::render
     *
     * @param string filePath
     * @scope public
     * @return string
     */
    render: function(filePath)
    {
        var fullPath = this.getScriptPath() + filePath;

        var request = new Request({method: 'get', async: false, url: fullPath, evalScripts: false});
            request.send();
            
        if(!$chk(request.isSuccess())) {
            new Mvc_View_Exception('No File for View found under: "' + fullPath + '"!');
        }

        $each(this.vars, function(value, key) {
            if($chk(this[key])) {
                new Mvc_Exception(this._name + ': Possible overwrite of an internal Method/Property "' + propName +  '"!');
            }
            this[key] = this.vars[key];
        }.bind(this));

        this.vars = null;

        var injectContainer = new Element('div', {
            'html': request.response.text,
            'class': 'inject-container'
        }).inject(this._getRenderContainer());

        injectContainer.getElements('script').each(function(script){
            eval(script.get('text'));
            script.dispose();
        }.bind(this));

        var html = injectContainer.clone();

        var htmlElements = html.getElements('*');
        
        injectContainer.getElements('*').each(function(injectItem, index) {
            htmlElements[index].cloneEvents(injectItem);
        });

        injectContainer.dispose();

        return injectContainer;
    },

    /**
     * Mvc_View::getScriptPath
     *
     * @scope public
     * @return string
     */
    getScriptPath: function()
    {
        return this._scriptPath;
    },

    /**
     * Mvc_View::getElement
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getElement: function(selector)
    {
        return this._getRenderContainer().getElement('.inject-container').getElement(selector);
    },

    /**
     * Mvc_View::getElements
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getElements: function(selector)
    {
        return this._getRenderContainer().getElement('.inject-container').getElements(selector);
    },

    /**
     * Mvc_View::setController
     *
     * @param string selector
     * @scope public
     * @return object
     */
    setController: function(controller)
    {
        this._controller = controller;
        return this;
    },

    /**
     * Mvc_View::getController
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getController: function(controller)
    {
        return this._controller;
    },

    /**
     * Mvc_View::getFrontController
     *
     * @param string selector
     * @scope public
     * @return object
     */
    getFrontController: function()
    {
        return this._controller.getFrontController();
    }
});