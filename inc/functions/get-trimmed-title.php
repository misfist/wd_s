<?php
/**
 * Trim the title length.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Trim the title length.
 *
 * @author Misfist
 *
 * @param array $args Parameters include length and more.
 *
 * @return string The title.
 */
function get_trimmed_title( $args = array() ) {
	// Set defaults.
	$defaults = array(
		'length' => 12,
		'more'   => '...',
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	// Trim the title.
	return wp_kses_post( wp_trim_words( get_the_title( get_the_ID() ), $args['length'], $args['more'] ) );
}
