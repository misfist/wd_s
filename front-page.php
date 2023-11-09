<?php
/**
 * The template used to render your site’s front page.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#front-page-display
 *
 * @package redkeyclub
 */

use function Red_Key_Club\print_numeric_pagination;
use function Red_Key_Club\main_classes;

get_header(); ?>
	<div class="wp-site-blocks">
		<main id="main" class="<?php echo esc_attr( main_classes( array() ) ); ?>">

			<?php
			if ( have_posts() ) :

				/* Start the Loop */
				while ( have_posts() ) :
					the_post();

					get_template_part( 'template-parts/content', get_post_type() );

				endwhile;

				print_numeric_pagination();

			else :
				get_template_part( 'template-parts/content', 'none' );
			endif;
			?>

		</main><!-- #main -->
	</div><!-- .wp-site-blocks -->

<?php get_footer(); ?>
