/**
 *
 * @package String
 */

/**
 * Ucfirst
 *
 * @package String
 * @subpackage String
 * @author Sven Eisenschmidt
 * @copyright 2009
 * @version $Id$
 * @license Custom License
 * @access public
 */


String.implement({
	ucfirst: function(){
            return this.toString().charAt(0).toUpperCase() + this.toString().substr(1);
	}
});