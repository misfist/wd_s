<?php
/**
 * ACF flexible content + Alogolia
 *
 * Allow ACF flexible content fields to be indexed by Alogolia search.
 * Requires: https://wordpress.org/plugins/search-by-algolia-instant-relevant-results/
 *
 * @package _s
 */

/**
 * Make flexible content fields searchable.
 *
 * @param array $settings settings array from API.
 *
 * @return array
 */
function _s_update_acf_index_settings( $settings ) {

	// Define flexible content layouts.
	$layouts = array(
		'accordion',
		'carousel',
		'hero',
		'generic_content',
		'fifty_fifty_block',
	);

	// Add layouts to indicies.
	foreach ( $layouts as $layout ) {
		$settings['attributesToIndex'][]    = 'unordered(' . $layout . ')';
		$settings['attributesToSnippet'][]  = $layout . ':30';
	}

	// Return settings.
	return $settings;
}
add_filter( 'algolia_searchable_posts_index_settings', '_s_update_acf_index_settings' );
add_filter( 'algolia_posts_page_index_settings', '_s_update_acf_index_settings' );

/**
 * Send field data to Algolia indicies.
 *
 * @param array   $attributes post attributes.
 * @param WP_Post $post post object.
 *
 * @return array
 */
function _s_updates_acf_post_attributes( array $attributes, WP_Post $post ) {

	// Only if we're using an ACF template.
	if ( 'template-acf.php' !== get_page_template_slug( $post->ID ) ) {
		return $attributes;
	}

	// Grab the flexible content fields IDs.
	$flexible_content = get_field( 'content_blocks', $post->ID );

	// Loop through flexible content fields.
	foreach ( $flexible_content as $item ) :

		$layout = $item['acf_fc_layout'];

		// Add field content to Alogolia indicies.
		switch ( $layout ) {
			case 'accordion':
				$attributes[ $layout ]['title'] = $item['title'];
				$attributes[ $layout ]['text']  = $item['text'];
				$accordion_items                = $item['accordion_items'];
				$i                              = 0;
				foreach ( $accordion_items as $accordion ) {
					$attributes[ $layout ]['accordion_items'][ $i ]['title'] = $accordion['accordion_title'];
					$attributes[ $layout ]['accordion_items'][ $i ]['text']  = $accordion['accordion_text'];
					$i++;
				}
				break;

			case 'carousel':
				$carousel_items = $item['carousel_slides'];
				$i              = 0;
				foreach ( $carousel_items as $slide ) {
					$attributes[ $layout ]['carousel_slides'][ $i ]['title']       = $slide['title'];
					$attributes[ $layout ]['carousel_slides'][ $i ]['text']        = $slide['text'];
					$attributes[ $layout ]['carousel_slides'][ $i ]['button_text'] = $slide['button_text'];
					$attributes[ $layout ]['carousel_slides'][ $i ]['button_url']  = $slide['button_url'];
					$i++;
				}
				break;

			case 'generic_content':
				$attributes[ $layout ]['content'] = $item['content'];
				break;

			case 'hero':
				$attributes[ $layout ]['title']       = $item['title'];
				$attributes[ $layout ]['text']        = $item['text'];
				$attributes[ $layout ]['button_url']  = $item['button_url'];
				$attributes[ $layout ]['button_text'] = $item['button_text'];
				break;

			case 'fifty_fifty_block':
				$attributes[ $layout ]['media_left']     = $item['media_left'];
				$attributes[ $layout ]['text_primary']   = $item['text_primary'];
				$attributes[ $layout ]['media_right']    = $item['media_right'];
				$attributes[ $layout ]['text_secondary'] = $item['text_secondary'];
				break;

		}

	endforeach;

	// Return field content.
	return $attributes;
}
add_filter( 'algolia_post_shared_attributes', '_s_updates_acf_post_attributes', 10, 2 );
add_filter( 'algolia_searchable_post_shared_attributes', '_s_updates_acf_post_attributes', 10, 2 );
