<?php
/**
 * The template for displaying all single posts.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package redkeyclub
 */

use function Red_Key_Club\print_comments;
use function Red_Key_Club\main_classes;

get_header(); ?>

	<main id="main" class="<?php echo esc_attr( main_classes( array() ) ); ?>">

		<?php
		while ( have_posts() ) :
			the_post();

			get_template_part( 'template-parts/content', get_post_type() );

			echo wp_kses_post(
				get_the_post_navigation(
					array(
						'class' => 'is-layout-constrained',
					)
				)
			);

			print_comments();

		endwhile; // End of the loop.
		?>

	</main><!-- #main -->

<?php get_footer(); ?>
