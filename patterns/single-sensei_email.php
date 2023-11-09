<?php
/**
 * Title: single-sensei_email
 * Slug: redkeyclub/single-sensei_email
 * Categories: hidden
 * Inserter: no
 */
?>

<!-- wp:group {"tagName":"main","style":{"spacing":{"blockGap":"0px","padding":{"top":"0px","right":"0px","bottom":"0px","left":"0px"},"margin":{"top":"10px","bottom":"40px"}}},"layout":{"type":"constrained","contentSize":"800px"}} -->
<main class="wp-block-group" style="margin-top:10px;margin-bottom:40px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
	<!-- wp:group {"style":{"spacing":{"blockGap":"0px","padding":{"top":"0px","right":"0px","bottom":"0px","left":"0px"},"margin":{"top":"0px","bottom":"0px"}},"color":{"background":"#ffffff"}},"className":"email-notification__wrapper","layout":{"type":"constrained","contentSize":"800px"}} -->
	<div class="wp-block-group email-notification__wrapper has-background" style="background-color:#ffffff;margin-top:0px;margin-bottom:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
		<!-- wp:group {"style":{"color":{"background":"#ffffff"},"spacing":{"padding":{"top":"40px","right":"56px","bottom":"0px","left":"56px"},"margin":{"top":"0px","bottom":"0px"}}},"className":"header email-notification__header","layout":{"type":"default"}} -->
		<div class="wp-block-group header email-notification__header has-background" style="background-color:#ffffff;margin-top:0px;margin-bottom:0px;padding-top:40px;padding-right:56px;padding-bottom:0px;padding-left:56px">
			<!-- wp:site-logo {"width":48,"className":"inline-block","style":{"spacing":{"padding":{"top":"0px","right":"0px","bottom":"0px","left":"0px"}}}} /-->
			<!-- wp:site-title {"textAlign":"left","isLink":false,"style":{"color":{"text":"#101517"},"typography":{"fontSize":"16px","fontStyle":"normal","fontWeight":"700"},"elements":{"link":{"color":{"text":"#101517"}}},"spacing":{"margin":{"top":"0px","right":"0px","bottom":"0px","left":"0px"},"padding":{"top":"0px","right":"0px","bottom":"0px","left":"0px"}}},"className":"inline-block"} /-->
		</div>
		<!-- /wp:group -->

		<!-- wp:post-content {"className":"email__wrapper","layout":{"type":"constrained","contentSize":"800px"}} /-->
		<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"0px","bottom":"40px","left":"52px","right":"52px"},"blockGap":"0px"}},"backgroundColor":"white","className":"email-notification__footer","layout":{"type":"default"}} -->
		<div class="wp-block-group alignwide email-notification__footer has-white-background-color has-background" style="padding-top:0px;padding-right:52px;padding-bottom:40px;padding-left:52px">
			<!-- wp:group {"style":{"spacing":{"padding":{"top":"0px","right":"0px","bottom":"0px","left":"0px"},"margin":{"top":"0px","bottom":"0px"},"blockGap":"0"}},"className":"footer_info","layout":{"type":"default"}} -->
			<div class="wp-block-group footer_info" style="margin-top:0px;margin-bottom:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
				<!-- wp:image {"id":1088,"width":32,"height":32,"sizeSlug":"full","linkDestination":"none","style":{"border":{"width":"0px","style":"none"}},"className":"sensei-logo inline-block"} -->
				<figure class="inline-block wp-block-image size-full is-resized has-custom-border sensei-logo">
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/assets/images/sensei-circle-logo.png" alt="<?php echo esc_attr_e( 'Sensei logo', 'Red Key Club' ); ?>" class="wp-image-1088" style="border-style:none;border-width:0px" width="32" height="32" />
				</figure>
				<!-- /wp:image -->

				<!-- wp:paragraph {"align":"left","style":{"spacing":{"padding":{"top":"0px","right":"0px","bottom":"0px","left":"7px"},"margin":{"top":"0px","right":"0px","bottom":"0px","left":"0px"}},"color":{"text":"#101517"},"typography":{"fontSize":"14px"}},"className":"inline-block powered"} -->
				<p class="inline-block has-text-align-left powered has-text-color" style="color:#101517;margin-top:0px;margin-right:0px;margin-bottom:0px;margin-left:0px;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:7px;font-size:14px">
					Powered by <a href="https://senseilms.com" target="_blank" rel="noopener noreferrer">SenseiLMS.com</a>				</p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</main>
<!-- /wp:group -->
