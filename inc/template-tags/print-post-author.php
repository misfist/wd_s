<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package redkeyclub
 */

namespace Red_Key_Club;

/**
 * Prints HTML with author information for the current post.
 *
 * @author Misfist
 *
 * @param array $args Configuration args.
 */
function print_post_author( $args = array() ) {

	// Set defaults.
	$defaults = array(
		'author_text' => esc_html__( 'by', 'redkeyclub' ),
	);

	// Parse args.
	$args = wp_parse_args( $args, $defaults );

	?>
	<span class="post-author">
		<?php echo esc_html( $args['author_text'] . ' ' ); ?>
		<span class="author vcard">
			<a class="url fn n" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>"><?php echo esc_html( get_the_author() ); ?></a>
		</span>
	</span>

	<?php
}
