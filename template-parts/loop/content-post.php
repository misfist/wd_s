<?php
/**
 * Template part for displaying posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package redkeyclub
 */

use function Red_Key_Club\print_post_date;
use function Red_Key_Club\print_post_author;
use function Red_Key_Club\print_entry_footer;
use function Red_Key_Club\print_post_taxonomies;
?>

<article <?php post_class( 'post-container card' ); ?>>
	<?php
	if ( has_post_thumbnail() ) :
		?>
		<figure class="card-image"><?php the_post_thumbnail( 'medium' ); ?></figure>
		<?php
	endif;
	?>
	<div class="card-body">
		<header class="card-title entry-header is-layout-constrained has-global-padding">
			<?php
			the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
			?>
		</header><!-- .card-title -->

		<div class="card-content entry-content is-layout-constrained has-global-padding">
			<?php
			the_excerpt(
				sprintf(
					wp_kses(
						/* translators: %s: Name of current post. */
						esc_html__( 'Continue reading %s <span class="meta-nav">&rarr;</span>', 'redkeyclub' ),
						array(
							'span' => array(
								'class' => array(),
							),
						)
					),
					the_title( '<span class="screen-reader-text">"', '"</span>', false )
				)
			);
			?>
		</div><!-- .card-content -->

		<footer class="card-actions entry-footer is-layout-constrained has-global-padding">
			<div class="entry-meta">
				<?php print_post_date(); ?>
				<?php print_post_author(); ?>
				<?php
				// Use the print_post_taxonomies template tag - set up the optional args.
				print_post_taxonomies(
					array(
						'post_id'      => $post->ID,
						'in_list'      => 0,
						'primary_only' => true,
						'linked'       => false,
					)
				);
				?>
			</div><!-- .entry-meta -->
			<?php print_entry_footer(); ?>
		</footer><!-- .card-actions -->
	</div><!-- .card-body -->
</article><!-- #post-## -->
