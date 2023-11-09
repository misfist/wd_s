<?php
/**
 * Adds custom classes to apply to <main>
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Adds custom classes to apply to <main>
 *
 * @author Misfist
 *
 * @param array $new_classes Classes for the <main> element.
 *
 * @return array main classes.
 */
function main_classes( $new_classes ) {

	$classes = array( 'site-main' );

	if ( ! empty( $new_classes ) ) {
		$classes = array_merge( $classes, $new_classes );
	}

	$classes = apply_filters( 'redkeyclub_main_classes', $classes );

	return implode( ' ', $classes );
}
