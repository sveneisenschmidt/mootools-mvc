/**
 * Extends Mootools Events
 *
 * Fires when the hash of the locationbar has hanged
 *
 * @package Mvc_Application
 * @subpackage Mvc_Application
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license MIT-Style License
 * @access public
 */

Element.Events.hashChanged = {

	onAdd: function(){

            var _hash  = window.location.hash;
            var _timer = function() {
                            if(window.location.hash != _hash) {
                                _hash = window.location.hash;
                                this.fireEvent('hashChanged');
                            }
                         };

            _timer.periodical(50, this);
	}

};