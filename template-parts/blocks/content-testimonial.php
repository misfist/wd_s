<?php
/**
 * Block Name: Testimonial
 *
 * This is the template that displays the testimonial block.
 */

// Set up fields.
$author      = get_field( 'author' );
$avatar      = get_field( 'avatar' );
$testimonial = get_field( 'testimonial' );
$bg_color    = get_field( 'background_color' );
$text_color  = get_field( 'text_color' );
$block_id    = 'testimonial-' . $block['id'];

?>
<blockquote id="<?php echo esc_attr( $block_id ); ?>" class="testimonial">
	<?php wp_kses_post( $testimonial ); ?>
	<cite>
		<img src="<?php echo esc_url( $avatar['url'] ); ?>" alt="<?php echo esc_attr( $avatar['alt'] ); ?>" />
		<span><?php echo esc_html( $author ); ?></span>
	</cite>
</blockquote>
<style type="text/css">
	#<?php echo esc_attr( $id ); ?> {
		background: <?php echo esc_attr( $bg_color ); ?>;
		color: <?php echo esc_attr( $text_color ); ?>;
	}
</style>
