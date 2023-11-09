<?php
/**
 * Customizer panels.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Add a custom panels to attach sections too.
 *
 * @author Misfist
 *
 * @param WP_Customize_Manager $wp_customize Instance of WP_Customize_Class.
 */
function customize_panels( $wp_customize ) {
	// Register a new panel.
	$wp_customize->add_panel(
		'site-options',
		array(
			'priority'       => 10,
			'capability'     => 'edit_theme_options',
			'theme_supports' => '',
			'title'          => esc_html__( 'Site Options', 'redkeyclub' ),
			'description'    => esc_html__( 'Other theme options.', 'redkeyclub' ),
		)
	);
}

add_action( 'customize_register', __NAMESPACE__ . '\customize_panels' );
