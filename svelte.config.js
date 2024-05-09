import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess({}),
	kit: {
		adapter: adapter(),
		alias: {
			$components: path.resolve("./src/lib/components"),
			$assets: path.resolve("./src/lib/assets"),
			$scss: path.resolve("./src/lib/scss"),
			$utils: path.resolve("./src/lib/utils"),
			$threeApp: path.resolve("./src/lib/ThreeApp"),
			$stores: path.resolve("./src/lib/stores"),
		}
	}
};

export default config;
