<?php
/**
 * The template used for displaying a testimonial.
 *
 * @package _s
 */

// Set up fields.
$author      = get_field( 'author' );
$avatar      = get_field( 'avatar' );
$testimonial = get_field( 'testimonial' );
$bg_color    = get_field( 'background_color' );
$text_color  = get_field( 'text_color' );
?>

<blockquote class="testimonial">
	<p><?php echo wp_kses_post( $testimonial ); ?></p>
	<cite>
		<img class="avatar" src="<?php echo esc_url( $avatar ); ?>" alt="<?php echo esc_attr( $author ); ?>" />
		<span class="author-name"><?php echo esc_html( $author ); ?></span>
	</cite>
</blockquote>
<style type="text/css">
	.testimonial {
		background: <?php echo esc_attr( $bg_color ); ?>;
		color: <?php echo esc_attr( $text_color ); ?>;
		padding: 24px;
	}

	.testimonial .avatar {
		border-radius: 50%;
		height: 64px;
		width: 64px;
	}
</style>
