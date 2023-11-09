<?php
/**
 * Template part for displaying the password protection form.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package redkeyclub
 */

?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<header class="entry-header is-layout-constrained has-global-padding">
		<?php the_title( '<h1 class="entry-title">', '</h1>' ); ?>
	</header><!-- .entry-header -->

	<div class="entry-content is-layout-constrained has-global-padding">
		<?php
		echo wp_kses(
			get_the_password_form(),
			array(
				'p'     => array(),
				'label' => array(
					'for' => array(),
				),
				'form'  => array(
					'action' => array(),
					'class'  => array(),
					'method' => array(),
				),
				'input' => array(
					'id'    => array(),
					'name'  => array(),
					'size'  => array(),
					'type'  => array(),
					'value' => array(),
				),
			)
		);
		?>
	</div><!-- .entry-content -->

</article><!-- #post-## -->
