<?php
/**
 * HTML Minification.
 * https://gist.github.com/sethbergman/d07e879200bef6862131
 * https://wordpress.transformnews.com/code-snippets/pagespeed-insights-minify-html-function-for-wordpress-1075
 *
 * Minify HTML for better performance.
 *
 * @package _s
 */
class WDS_Minify_HTML {
	protected $compress_css    = true;
	protected $compress_js     = true;
	protected $info_comment    = true;
	protected $remove_comments = true;
	protected $html;

	public function __construct( $html ) {

		if ( ! empty( $html ) ) {
			$this->parse_html( $html );
		}
	}
	public function __toString() {
		return $this->html;
	}

	protected function minify_html( $html ) {
		$pattern = '/<(?<script>script).*?<\/script\s*>|<(?<style>style).*?<\/style\s*>|<!(?<comment>--).*?-->|<(?<tag>[\/\w.:-]*)(?:".*?"|\'.*?\'|[^\'">]+)*>|(?<text>((<[^!\/\w.:-])?[^<]*)+)|/si';

		preg_match_all( $pattern, $html, $matches, PREG_SET_ORDER );

		$overriding = false;
		$raw_tag    = false;
		$html       = '';

		foreach ( $matches as $token ) {

			$tag     = ( isset( $token['tag'] ) ) ? strtolower( $token['tag'] ) : null;
			$content = $token[0];

			if ( is_null( $tag ) ) {
				if ( ! empty( $token['script'] ) ) {
					$strip = $this->compress_js;
				} elseif ( ! empty( $token['style'] ) ) {
					$strip = $this->compress_css;
				} elseif ( '<!--wp-html-compression no compression-->' === $content ) {
					$overriding = ! $overriding;
					continue;
				} elseif ( $this->remove_comments ) {
					if ( ! $overriding && 'textarea' !== $raw_tag ) {
						$content = preg_replace( '/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $content );
					}
				}
			} else {
				if ( 'pre' === $tag || 'textarea' === $tag ) {
					$raw_tag = $tag;
				} elseif ( '/pre' === $tag || '/textarea' === $tag ) {
					$raw_tag = false;
				} else {
					if ( $raw_tag || $overriding ) {
						$strip = false;
					} else {
						$strip   = true;
						$content = preg_replace( '/(\s+)(\w++(?<!\baction|\balt|\bcontent|\bsrc)="")/', '$1', $content );
						$content = str_replace( ' />', '/>', $content );
					}
				}
			}

			if ( $strip ) {
				$content = $this->remove_white_space( $content );
			}

			$html .= $content;
		}

		return $html;
	}

	public function parse_html( $html ) {
		$this->html = $this->minify_html( $html );
	}

	protected function remove_white_space( $str ) {
		$str = str_replace( "\t", ' ', $str );
		$str = str_replace( "\n", '', $str );
		$str = str_replace( "\r", '', $str );

		while ( stristr( $str, '  ' ) ) {

			$str = str_replace( '  ', ' ', $str );
		}

		return $str;
	}
}
function wp_html_compression_finish( $html ) {
	return new WDS_Minify_HTML( $html );
}

function wp_html_compression_start() {
	ob_start( 'wp_html_compression_finish' );
}
add_action( 'get_header', 'wp_html_compression_start' );
