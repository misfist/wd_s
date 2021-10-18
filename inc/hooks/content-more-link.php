<?php
/**
 * Customize "Read More" string on <!-- more --> with the_content();
 *
 * @package _s
 */

/**
 * Customize "Read More" string on <!-- more --> with the_content();
 *
 * @author WebDevStudios
 *
 * @return string Read more link.
 */

namespace WD_S\Hooks;

function content_more_link() {
	return ' <a class="more-link" href="' . get_permalink() . '">' . esc_html__( 'Read More', '_s' ) . '...</a>';
}

add_filter( 'the_content_more_link', 'WD_S\Hooks\content_more_link' );
