<?php
/**
 * Template part for displaying page content in page.php.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package redkeyclub
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<header class="page-header entry-header is-layout-constrained has-global-padding">
		<?php the_title( '<h1 class="page-title entry-title">', '</h1>' ); ?>
	</header><!-- .page-header -->

	<div class="entry-content is-layout-constrained has-global-padding">
		<?php
		the_content();

		wp_link_pages(
			array(
				'before' => '<div class="page-links is-layout-constrained has-global-padding">' . esc_html__( 'Pages:', 'redkeyclub' ),
				'after'  => '</div>',
			)
		);
		?>
	</div><!-- .entry-content -->

	<?php if ( get_edit_post_link() ) : ?>
		<footer class="entry-footer is-layout-constrained has-global-padding">
			<?php
				edit_post_link(
					sprintf(
						/* translators: %s: Name of current post */
						esc_html__( 'Edit %s', 'redkeyclub' ),
						the_title( '<span class="screen-reader-text">"', '"</span>', false )
					),
					'<div class="edit-link">',
					'</div>'
				);
			?>
		</footer><!-- .entry-footer -->
	<?php endif; ?>

</article><!-- #post-## -->
