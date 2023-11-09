<?php
/**
 * Customizer settings.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Register additional scripts.
 *
 * @author Misfist
 *
 * @param WP_Customize_Manager $wp_customize Instance of WP_Customize_Manager.
 */
function customize_additional_scripts( $wp_customize ) {
	// Register a setting.
	$wp_customize->add_setting(
		'redkeyclub_header_scripts',
		array(
			'default'           => '',
			'sanitize_callback' => 'force_balance_tags',
		)
	);

	// Create the setting field.
	$wp_customize->add_control(
		'redkeyclub_header_scripts',
		array(
			'label'       => esc_attr__( 'Header Scripts', 'redkeyclub' ),
			'description' => esc_attr__( 'Additional scripts to add to the header. Basic HTML tags are allowed.', 'redkeyclub' ),
			'section'     => 'redkeyclub_additional_scripts_section',
			'type'        => 'textarea',
		)
	);

	// Register a setting.
	$wp_customize->add_setting(
		'redkeyclub_footer_scripts',
		array(
			'default'           => '',
			'sanitize_callback' => 'force_balance_tags',
		)
	);

	// Create the setting field.
	$wp_customize->add_control(
		'redkeyclub_footer_scripts',
		array(
			'label'       => esc_attr__( 'Footer Scripts', 'redkeyclub' ),
			'description' => esc_attr__( 'Additional scripts to add to the footer. Basic HTML tags are allowed.', 'redkeyclub' ),
			'section'     => 'redkeyclub_additional_scripts_section',
			'type'        => 'textarea',
		)
	);
}

add_action( 'customize_register', __NAMESPACE__ . '\customize_additional_scripts' );


/**
 * Register copyright text setting.
 *
 * @author Misfist
 *
 * @param WP_Customize_Manager $wp_customize Instance of WP_Customize_Manager.
 */
function customize_copyright_text( $wp_customize ) {
	// Register a setting.
	$wp_customize->add_setting(
		'redkeyclub_copyright_text',
		array(
			'default'           => '',
			'sanitize_callback' => 'wp_kses_post',
		)
	);

	// Create the setting field.
	$wp_customize->add_control(
		'redkeyclub_copyright_text',
		array(
			'label'       => esc_attr__( 'Copyright Text', 'redkeyclub' ),
			'description' => esc_attr__( 'The copyright text will be displayed in the footer. Basic HTML tags allowed.', 'redkeyclub' ),
			'section'     => 'redkeyclub_footer_section',
			'type'        => 'textarea',
		)
	);
}

add_action( 'customize_register', __NAMESPACE__ . '\customize_copyright_text' );
