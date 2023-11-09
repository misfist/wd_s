<?php
/**
 * Registers custom block pattern categories for the WD_S theme.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Registers custom block pattern categories for the WD_S theme.
 */
function register_custom_block_pattern_category() {

	register_block_pattern_category(
		'wds-patterns',
		array(
			'label' => __( 'WDS Patterns', 'redkeyclub' ),
		)
	);

	// Remove default patterns.
	remove_theme_support( 'core-block-patterns' );
}
add_action( 'init', __NAMESPACE__ . '\register_custom_block_pattern_category', 9 );
