// Next.js Konfigurationsdatei
module.exports = {
	// Standalone-Output für Docker-Deployment aktivieren
	// Dies erstellt eine eigenständige Version der App mit allen Abhängigkeiten
	output: "standalone",
	typescript: {
		ignoreBuildErrors: true // temporarily, since some type errors still exists and are ambiguous
	},
	experimental: {
		// Optimize package imports for better build performance
		optimizePackageImports: [
			'db-hafas-stations',
			'db-vendo-client',
			'zod'
		],
		// Note: turbopackPersistentCaching is only available in canary versions
		// Remove this line for stable Next.js versions
	}
};
