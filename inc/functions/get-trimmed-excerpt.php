<?php
/**
 * Limit the excerpt length.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Limit the excerpt length.
 *
 * @author Misfist
 *
 * @param array $args Parameters include length and more.
 *
 * @return string The excerpt.
 */
function get_trimmed_excerpt( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'length' => 20,
		'more'   => '...',
		'post'   => '',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Trim the excerpt.
	return wp_trim_words( get_the_excerpt( $args['post'] ), absint( $args['length'] ), esc_html( $args['more'] ) );
}
