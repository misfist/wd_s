<?php
/**
 * Enqueue scripts and styles.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Enqueue scripts and styles.
 *
 * @author Misfist
 */
function scripts() {
	$asset_file_path = get_template_directory() . '/build/index.asset.php';

	if ( is_readable( $asset_file_path ) ) {
		$asset_file = include $asset_file_path;
	} else {
		$asset_file = array(
			'version'      => '1.0.0',
			'dependencies' => array( 'wp-polyfill' ),
		);
	}

	// Register styles & scripts.
	wp_enqueue_style( 'redkeyclub-styles', get_stylesheet_directory_uri() . '/build/index.css', array(), $asset_file['version'] );
	wp_enqueue_style( 'custom-preflight', get_stylesheet_directory_uri() . '/assets/tailwind-preflight.css', array(), $asset_file['version'] );
	wp_enqueue_script( 'redkeyclub-scripts', get_stylesheet_directory_uri() . '/build/index.js', $asset_file['dependencies'], $asset_file['version'], true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\scripts' );
