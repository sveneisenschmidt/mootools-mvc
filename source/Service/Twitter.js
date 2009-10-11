/**
 *
 * @package Mvc_Service_Twitter
 * @subpackage Mvc_Service_Twitter
 */

/**
 * Mvc_Service_Twitter
 *
 * @package Mvc_Service_Twitter
 * @subpackage Mvc_Service_Twitter
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */


var Mvc_Service_Twitter = new Class({

    Implements: Events,

    _service: $empty,

    /**
     * Mvc_Service_Twitter::initialize
     *
     * @param string user
     * @param string pass
     * @scope public
     * @return void
     */
    initialize: function(user, pass)
    {
        this._service = new Mvc_Service_Twitter_Service();


        this._service.addEvent('loaded', function(){
            this.data = this._service.data;
            this.fireEvent('loaded');
        }.bind(this));


        if($chk(user)) {
            this.setUser(user);
        }

        if($chk(pass)) {
            this.setPassword(pass);
        }

    },

    /**
     * Mvc_Service_Twitter::setLogin
     *
     * @param string user
     * @param string pass
     * @scope public
     * @return void
     */
    setLogin: function(user, pass)
    {
        return this.setUser(user).setPassword(pass);
    },

    /**
     * Mvc_Service_Twitter::setUser
     *
     * @param string user
     * @scope public
     * @return object
     */
    setUser: function(user)
    {
        if(!$chk(user) || $type(user) != 'string') {
            new Mvc_Service_Twitter_Exception(this._name + ': Username is no String!');
        }
        this._service.setUser(user);
        return this;
    },

    /**
     * Mvc_Service_Twitter::setPassword
     *
     * @param string pass
     * @scope public
     * @return object
     */
    setPassword: function(pass)
    {
        if(!$chk(pass) || $type(pass) != 'string') {
            new Mvc_Service_Twitter_Exception(this._name + ': Password is no String!');
        }
        this._service.setPassword(pass);
        return this;
    },

    /**
     * Mvc_Service_Twitter::getPublicTimeline
     *
     * @param int amount
     * @scope public
     * @return void
     */
    getPublicTimeline: function(amount)
    {
        this._service.getPublicTimeline(amount);
    },

    /**
     * Mvc_Service_Twitter::getData
     *
     * @scope public
     * @return object
     */
    getData: function()
    {
        return this.data;
    }
});