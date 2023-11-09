<?php
/**
 * Customizer sections.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Register the section sections.
 *
 * @author Misfist
 * @param object $wp_customize Instance of WP_Customize_Class.
 */
function customize_sections( $wp_customize ) {

	// Register additional scripts section.
	$wp_customize->add_section(
		'redkeyclub_additional_scripts_section',
		array(
			'title'    => esc_html__( 'Additional Scripts', 'redkeyclub' ),
			'priority' => 10,
			'panel'    => 'site-options',
		)
	);

	// Register a footer section.
	$wp_customize->add_section(
		'redkeyclub_footer_section',
		array(
			'title'    => esc_html__( 'Footer Customizations', 'redkeyclub' ),
			'priority' => 90,
			'panel'    => 'site-options',
		)
	);
}
add_action( 'customize_register', __NAMESPACE__ . '\customize_sections' );
