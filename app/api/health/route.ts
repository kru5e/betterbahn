export async function GET() {
	try {
		// Basic health check - verify the app is running
		// You can add more checks here like database connectivity if needed
		return Response.json({
			status: "healthy",
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
		}, {
			status: 200,
			headers: {
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0',
			},
		});
	} catch (error) {
		return Response.json({
			status: "unhealthy",
			timestamp: new Date().toISOString(),
			error: error instanceof Error ? error.message : "Unknown error",
		}, {
			status: 503,
		});
	}
}
