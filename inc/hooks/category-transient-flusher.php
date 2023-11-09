<?php
/**
 * Flush out the transients used in redkeyclub_categorized_blog.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Flush out the transients used in redkeyclub_categorized_blog.
 *
 * @author Misfist
 *
 * @return bool Whether or not transients were deleted.
 */
function category_transient_flusher() {
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return false;
	}

	// Like, beat it. Dig?
	return delete_transient( 'redkeyclub_categories' );
}

add_action( 'delete_category', __NAMESPACE__ . '\category_transient_flusher' );
add_action( 'save_post', __NAMESPACE__ . '\category_transient_flusher' );
