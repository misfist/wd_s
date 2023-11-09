<?php
/**
 * Customize the [...] on the_excerpt();
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Customize the [...] on the_excerpt();
 *
 * @author Misfist
 *
 * @return string Read more link.
 */
function excerpt_more() {
	return sprintf( ' <a class="more-link" href="%1$s">%2$s</a>', get_permalink( get_the_ID() ), esc_html__( 'Read more...', 'redkeyclub' ) );
}

add_filter( 'excerpt_more', __NAMESPACE__ . '\excerpt_more' );
