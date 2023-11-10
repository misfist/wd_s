<?php
/**
 * Title: Courses
 * Slug: redkeyclub/courses
 * Categories: theme
 * Block Types: core/content
 *
 * @package redkeyclub
 */
?>
 
<!-- wp:query {
	"query": {
		"perPage": "24",
		"pages": 0,
		"offset": 0,
		"postType": "course",
		"order": "desc",
		"orderBy": "date",
		"author": "",
		"search": "",
		"exclude": [],
		"sticky": "",
		"inherit": false,
		"parents": []
	}
} -->
<div class="wp-block-query course-list">
	<!-- wp:post-template {"className":"cards","layout":{"type":"default"}} -->
	<!-- wp:post-featured-image {"isLink":true,"sizeSlug":"medium","className":"wp-block-post__image"} /-->

	<!-- wp:group {"className":"card-body wp-block-post__body","layout":{"type":"flex","orientation":"vertical","verticalAlignment":"space-between"}} -->
	<div class="wp-block-group card-body wp-block-post__body">
		<!-- wp:post-title {"isLink":true,"className":"card-title wp-block-post__title"} /-->

		<!-- wp:post-excerpt {"className":"card-excerpt"} /-->

		<!-- wp:group {"tagName":"footer","className":"card-actions wp-block-post__actions"} -->
		<footer class="wp-block-group card-actions wp-block-post__actions">
			<!-- wp:post-author {"avatarSize":96,"showBio":true,"byline":"Coach","isLink":true,"lock":{"move":false,"remove":false},"className":"rounded-full","fontSize":"medium"} /-->

			<!-- wp:group {"className":"wp-block-post__actions-course","layout":{"type":"flex","orientation":"vertical"}} -->
			<div class="wp-block-group wp-block-post__actions-course">
				<!-- wp:sensei-lms/course-progress {"barColor":"tertiary-200","defaultBarColor":"tertiary-200"} /-->

				<!-- wp:sensei-lms/course-actions -->
				<!-- wp:sensei-lms/button-take-course -->
				<div class="wp-block-sensei-lms-button-take-course wp-block-button has-text-align-left">
					<button class="wp-block-button__link">Start Course</button>
				</div>
				<!-- /wp:sensei-lms/button-take-course -->

				<!-- wp:sensei-lms/button-continue-course -->
				<div class="wp-block-sensei-lms-button-continue-course wp-block-button">
					<a class="wp-block-button__link">Continue Course</a>
				</div>
				<!-- /wp:sensei-lms/button-continue-course -->

				<!-- wp:sensei-lms/button-view-results -->
				<div
					class="wp-block-sensei-lms-button-view-results wp-block-button">
					<a class="wp-block-button__link">Course Results</a></div>
				<!-- /wp:sensei-lms/button-view-results -->
				<!-- /wp:sensei-lms/course-actions -->
			</div>
			<!-- /wp:group -->
		</footer>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
	<!-- /wp:post-template -->

	<!-- wp:query-pagination {
		"paginationArrow": "chevron",
		"style": {
			"elements": {
				"link": {
					"color": {
						"text": "var:preset|color|primary-300"
					}
				}
			}
		},
		"layout": {
			"type": "flex",
			"justifyContent": "center"
		}
	} -->
	<!-- wp:query-pagination-previous /-->

	<!-- wp:query-pagination-numbers /-->

	<!-- wp:query-pagination-next /-->
	
	<!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
