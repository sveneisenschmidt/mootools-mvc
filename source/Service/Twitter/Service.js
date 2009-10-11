/**
 *
 * @package Mvc_Service_Twitter
 * @subpackage Mvc_Service_Twitter_Service
 */

/**
 * Mvc_Service_Twitter_Service
 *
 * @package Mvc_Service_Twitter
 * @subpackage Mvc_Service_Twitter_Service
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */


var Mvc_Service_Twitter_Service = new Class({

    Implements: Events,

    _user: $empty,

    _pass: $empty,

    _defaults: {
        publicTimeLine: 20
    },

    _request: $empty,

    /**
     * Mvc_Service_Twitter_Service::setLogin
     *
     * @param string user
     * @param string pass
     * @scope public
     * @return object
     */
    setLogin: function(user, pass)
    {
        this._user = user;
        this._pass = pass;
        return this;
    },

    /**
     * Mvc_Service_Twitter_Service::setUser
     *
     * @param string user
     * @scope public
     * @return object
     */
    setUser: function(user)
    {
        this._user = user;
        return this;
    },

    /**
     * Mvc_Service_Twitter_Service::setPassword
     *
     * @param string pass
     * @scope public
     * @return object
     */
    setPassword: function(pass)
    {
        this._pass = pass;
        return this;
    },

    /**
     * Mvc_Service_Twitter_Service::getPublicTimeline
     *
     * @param int amount
     * @scope public
     * @return void
     */
    getPublicTimeline: function(amount)
    {
        if(!$chk(amount)) {
            var amount = this._defaults.publicTimeLine;
        }

        // &callback=callback
        this._request = new Request.JSONP({
            url: 'http://twitter.com/status/user_timeline/moovc.json',
            data: {
                count: amount
            },
            onComplete: this.callback.bind(this)
        }).send();


    },

    /**
     * Mvc_Service_Twitter_Service::callback
     *
     * @param object data
     * @scope public
     * @return void
     */
    callback: function(data)
    {
        this.data = data;
        this.fireEvent('loaded');
    }
});