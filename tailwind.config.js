const fs = require( 'fs' );
const path = require( 'path' );
const glob = require( 'glob' );

// Get arrays of all of the files.
const topLevelPhpFiles = glob.sync( './*.php' ),
	directoryFiles = [
		'./inc/*.php',
		'./template-parts/*.php',
		'./assets/js/**/*.js',
	];

const themeJsonPath = path.join( __dirname, 'theme.json' );
const themeJson = fs.readFileSync( themeJsonPath );
const theme = JSON.parse( themeJson );

const { palette } = theme.settings.color;
const colors = palette.reduce( ( acc, item ) => {
	const [ color, number ] = item.slug.split( '-' );

	if ( number ) {
		// If there is a number identifier, make this an object
		if ( ! acc[ color ] ) {
			acc[ color ] = {};
		}
		acc[ color ][ number ] = item.color;
	} else {
		acc[ color ] = item.color;
	}

	return acc;
}, {} );

module.exports = {
	corePlugins: {
		preflight: false,
	},
	darkMode: false,
	content: topLevelPhpFiles.concat( directoryFiles ),
	theme: {
		fontFamily: {
			headline: [ 'Lato', 'sans-serif' ],
			subheading: [ 'Lora', 'serif' ],
			body: [ 'Nunito', 'sans-serif' ],
			mono: [ 'Oxygen Mono', 'monospace' ],
			sans: [ '"DM Sans"', 'sans-serif' ],
			serif: [ 'Lora', 'serif' ],
		},
		extend: {
			colors,
			boxShadow: {
				'hard-shadow': '10px 10px 0 0 rgba(0,0,0,1)',
			},
		},
	},
	daisyui: {
		themes: [
			{
				redkeyclub: {
					primary: '#000000',
					secondary: '#b91c1c',
					accent: '#d1d5db',
					neutral: '#222222',
					'base-100': '#ffffff',
					info: '#f3f4f6',
					success: '#0d9488',
					warning: '#fbbf24',
					error: '#b91c1c',
				},
			},
		],
	},
	plugins: [
		require( '@tailwindcss/forms' ),
		require( '@tailwindcss/typography' ),
		require( 'daisyui' ),
	],
};
