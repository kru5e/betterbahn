# Coolify Deployment Guide for BetterBahn

This guide will help you deploy BetterBahn on Coolify with your existing Cloudflare tunnel setup.

## Prerequisites

- Coolify instance running and accessible
- Cloudflare tunnel configured to proxy `*.mydomain.de` traffic to Coolify
- Docker support enabled on your Coolify instance

## Deployment Steps

### 1. Create New Application in Coolify

1. Log into your Coolify dashboard
2. Click "New Resource" → "Application"
3. Choose "Docker Image" as the source
4. Set the Docker image to: `ghcr.io/l2xu/betterbahn:main` (or build from source)

### 2. Configure Application Settings

#### Basic Configuration

- **Name**: `betterbahn`
- **Port**: `3000`
- **Protocol**: `HTTP`
- **Expose Port**: Make sure port 3000 is exposed

#### Environment Variables

Set the following environment variables in Coolify:

```
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

#### Build Configuration (if building from source)

- **Build Pack**: Docker (since you have a Dockerfile)
- **Dockerfile Path**: `./Dockerfile`
- **Build Context**: `.`

### 3. Configure Domain

1. In the application settings, go to "Domains"
2. Add your domain: `betterbahn.mydomain.de` (or your preferred subdomain)
3. Since you have Cloudflare tunnel configured, Coolify will automatically handle the routing

### 4. Health Check Configuration

The application includes a health check endpoint at `/api/health` that Coolify can use for monitoring:

- **Health Check Path**: `/api/health`
- **Health Check Interval**: 30s
- **Health Check Timeout**: 10s
- **Health Check Retries**: 3

**Important**: Ensure health checks are properly configured to avoid issues with rolling updates. The health check endpoint should return HTTP 200 when the container is operational. If health checks fail, Traefik proxy may not function correctly.

### 5. Build from Source (Alternative)

If you prefer to build from source instead of using the pre-built image:

1. Choose "Git Repository" as source
2. Use this repository URL: `https://github.com/L2xu/betterbahn.git`
3. Coolify will automatically detect the Dockerfile and build the application

#### Build Configuration

- **Dockerfile Path**: `./Dockerfile`
- **Build Context**: `.`
- **Port**: `3000`

### 6. Deploy

1. Click "Deploy" to start the deployment
2. Monitor the deployment logs for any issues
3. Once deployed, access your application at `https://betterbahn.mydomain.de`

## Cloudflare Tunnel Integration

Since you already have a Cloudflare tunnel running that proxies `*.mydomain.de` to Coolify:

1. The traffic flow will be: `User → Cloudflare → Tunnel → Coolify → BetterBahn Container`
2. SSL/TLS termination happens at Cloudflare
3. Coolify handles the internal routing to your BetterBahn container
4. No additional configuration needed on the application side

**Important Notes:**

- Ensure your Cloudflare SSL/TLS encryption mode is set to "Full" or higher
- Your BetterBahn app runs on HTTP internally (port 3000), while Cloudflare handles HTTPS externally
- If you need HTTPS directly on Coolify (e.g., for secure cookies), follow Coolify's "Full TLS HTTPS" guide
- The tunnel should be configured to route `*.mydomain.de` to `localhost:80` (Coolify's Traefik proxy)

## Monitoring and Maintenance

### Health Monitoring

- Use the `/api/health` endpoint to monitor application status
- Coolify will automatically restart the container if health checks fail

### Logs

- Access application logs through the Coolify dashboard
- Logs include API request information and error details

### Updates

To update the application:

1. Trigger a new deployment in Coolify (if using source)
2. Or update the Docker image tag (if using pre-built image)

## Troubleshooting

### Common Issues

1. **Container not starting**

   - Check the deployment logs in Coolify
   - Verify environment variables are set correctly
   - Ensure port 3000 is properly configured

2. **Application not accessible**

   - Verify domain configuration in Coolify
   - Check Cloudflare tunnel status
   - Ensure DNS records are pointing to Cloudflare

3. **Health check failures**
   - Check if the application is responding on port 3000
   - Verify the `/api/health` endpoint is accessible
   - Review application logs for errors

### Useful Commands

If you need to access the container for debugging:

```bash
# Check container status
docker ps | grep betterbahn

# View container logs
docker logs <container-id>

# Access container shell
docker exec -it <container-id> sh
```

## Security Considerations

- The application runs in production mode with telemetry disabled
- All traffic is encrypted by Cloudflare
- Environment variables are securely managed by Coolify
- Health checks don't expose sensitive information

## Support

For issues related to:

- **BetterBahn Application**: Check the main repository issues
- **Coolify Deployment**: Refer to Coolify documentation
- **Cloudflare Tunnel**: Check Cloudflare dashboard and logs
