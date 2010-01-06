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

    html: '',

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
        if($type(key) === 'object') {
            $each(key, function(value, key2) {
                this.vars[key2] = value;
            }, this);
            return;
        }

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

        var request = new Request.HTML({method: 'get', async: false, url: fullPath, evalScripts: false});
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

        this.html = new Element('div', {
            'html': request.response.html
        });


        var js = request.response.javascript.trim();
        if(js != "") {
            eval(js);
        }


        return this.html;
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