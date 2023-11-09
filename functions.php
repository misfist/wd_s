<?php
/**
 * WDS redkeyclub functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

// Define a global path and url.
define( 'Red_Key_Club\ROOT_PATH', trailingslashit( get_template_directory() ) );
define( 'Red_Key_Club\ROOT_URL', trailingslashit( get_template_directory_uri() ) );

/**
 * Get all the include files for the theme.
 *
 * @author Misfist
 */
function include_inc_files() {
	$files = array(
		'inc/customizer/customizer.php', // Customizer additions.
		'inc/functions/', // Custom functions that act independently of the theme templates.
		'inc/hooks/', // Load custom filters and hooks.
		'inc/post-types/', // Load custom post types.
		'inc/setup/', // Theme setup.
		'inc/shortcodes/', // Load shortcodes.
		'inc/template-tags/', // Custom template tags for this theme.
		'inc/wpcli/',
	);

	foreach ( $files as $include ) {
		$include = trailingslashit( get_template_directory() ) . $include;

		// Allows inclusion of individual files or all .php files in a directory.
		if ( is_dir( $include ) ) {
			foreach ( glob( $include . '*.php' ) as $file ) {
				require $file;
			}
		} else {
			require $include;
		}
	}
}

include_inc_files();
