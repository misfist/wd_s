<?php
/**
 * Display the comments if the count is more than 0.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Display the comments if the count is more than 0.
 *
 * @author Misfist
 */
function print_comments() {
	if ( comments_open() || get_comments_number() ) {
		comments_template();
	}
}
