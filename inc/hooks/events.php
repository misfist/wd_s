<?php
/**
 * Adds custom classes to the array of body classes.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

define( 'EM_GUTENBERG', true );

\add_filter( 'em_ct_categories', __NAMESPACE__ . '\event_category_args', 10, 1 );
\add_filter( 'em_ct_tags', __NAMESPACE__ . '\event_tag_args', 10, 1 );
\add_filter( 'em_person_get_bookings_url', ' __return_false' );

/**
 * Modify Event Category Args
 *
 * @param array $args
 * @return array $args
 */
function event_category_args( $args ) : array {
	$args['show_in_rest'] = true;
	return $args;
}

/**
 * Modify Event Tag Args
 *
 * @param array $args
 * @return array $args
 */
function event_tag_args( $args ) : array {
	$args['show_in_rest'] = true;
	return $args;
}
