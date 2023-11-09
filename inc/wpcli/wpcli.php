<?php
/**
 * Set up wp-cli.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

use WP_CLI;
use const Red_Key_Club\ROOT_PATH;

/**
 * Registers our command when cli get's initialized.
 *
 * @since  4.0.0
 * @author Biplav Subedi <biplav.subedi@misfist.com>
 * @return void
 */
function cli_register_commands() {
	WP_CLI::add_command( 'wds', __NAMESPACE__ . '\Blocks_Scaffold' );
}
add_action( 'cli_init', __NAMESPACE__ . '\cli_register_commands' );

/**
 * Register Blocks
 *
 * @return void
 * @author Jenna Hines
 * @since  2.0.0
 */
function acf_register_blocks() {
	$wds_acf_blocks = glob( ROOT_PATH . 'blocks/*/block.json' );

	foreach ( $wds_acf_blocks as $block ) {
		register_block_type( $block );
	}
}
add_action( 'init', __NAMESPACE__ . '\acf_register_blocks' );
