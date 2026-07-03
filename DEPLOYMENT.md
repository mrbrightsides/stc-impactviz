# Deployment Guide

## STC ImpactViz - Production Deployment

This guide covers deploying STC ImpactViz to various platforms.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [AWS Amplify](#aws-amplify)
  - [Docker](#docker)
  - [Traditional VPS](#traditional-vps)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure:

- ✅ Node.js 18.x or higher installed
- ✅ npm or yarn package manager
- ✅ Git repository set up
- ✅ All tests passing (if applicable)
- ✅ Build succeeds locally

**Local Build Test:**
```bash
npm run build
npm start
```

---

## Build Configuration

### Next.js Configuration

The project uses Next.js 15.3.4 with App Router. Configuration is in `next.config.js` (if exists) or uses defaults.

**Build Output:**
```bash
npm run build
```

**Expected Output:**
```
Route (app)                           Size    First Load JS
┌ ƒ /                               864 kB    977 kB
├ ƒ /_not-found                      980 B    103 kB
├ ƒ /api/health                      143 B    102 kB
├ ƒ /api/logger                      143 B    102 kB
└ ƒ /api/proxy                       143 B    102 kB
+ First Load JS shared by all       102 kB
```

**Build Optimizations:**
- Automatic code splitting
- Image optimization (Next.js Image)
- Font optimization (Geist fonts)
- CSS minification
- JavaScript minification

---

## Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform as it's built by the Next.js team.

#### Quick Deploy

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Automatic Deployment**
   - Every push to `main` triggers deployment
   - Preview deployments for pull requests
   - Automatic rollbacks on failure

#### Manual Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS (automatic with Vercel DNS)

**Example DNS Configuration:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

### Netlify

#### Deploy via Git

1. **Connect Repository**
   - Visit [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Deploy**
   - Click "Deploy site"
   - Automatic deployments on git push

#### Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

### AWS Amplify

1. **Connect Repository**
   - Open AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect to GitHub

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Deploy**
   - Review and deploy
   - Automatic deployments on push

---

### Docker

#### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Build and Run

```bash
# Build image
docker build -t stc-impactviz .

# Run container
docker run -p 3000:3000 stc-impactviz

# Or use docker-compose
docker-compose up -d
```

---

### Traditional VPS

For traditional VPS (Ubuntu/Debian):

#### 1. Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2
```

#### 2. Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/stc-impactviz.git
cd stc-impactviz

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "stc-impactviz" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 3. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install nginx -y

# Create config
sudo nano /etc/nginx/sites-available/stc-impactviz
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/stc-impactviz /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 4. Setup SSL (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up automatically
```

---

## Environment Variables

### Required Variables

None required for basic functionality. Blockchain API uses public Infura endpoint.

### Optional Variables

For production, you may want to add:

```env
# .env.local
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_INFURA_API_KEY=your_private_key
```

### Setting Environment Variables

**Vercel:**
- Project Settings → Environment Variables

**Netlify:**
- Site Settings → Build & Deploy → Environment

**Docker:**
```bash
docker run -e NEXT_PUBLIC_APP_URL=https://example.com -p 3000:3000 stc-impactviz
```

---

## Post-Deployment

### 1. Verify Deployment

Check these endpoints:

- ✅ Homepage: `https://your-domain.com`
- ✅ API Health: `https://your-domain.com/api/health`
- ✅ Blockchain tab loads without errors
- ✅ Sample data loads successfully
- ✅ Export functions work
- ✅ Dark mode toggles properly

### 2. Performance Testing

Use these tools:

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://www.webpagetest.org)

**Target Metrics:**
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

### 3. Setup Monitoring

**Free Options:**
- Vercel Analytics (if using Vercel)
- Google Analytics
- Sentry for error tracking

**Example Sentry Setup:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## Monitoring

### Health Check Endpoint

The app includes a health check endpoint:

```bash
curl https://your-domain.com/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com) (free)
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

---

## Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors
```bash
# Solution: Check type errors
npm run type-check

# Fix errors and rebuild
npm run build
```

**Issue:** Out of memory during build
```bash
# Solution: Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Runtime Issues

**Issue:** "Module not found" errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Issue:** API routes not working
- Check Vercel/Netlify function configuration
- Verify API routes are in `src/app/api/`
- Check middleware configuration

### Performance Issues

**Issue:** Slow initial load
- Enable Next.js Image optimization
- Implement code splitting
- Use dynamic imports for large components
- Enable CDN caching

**Issue:** High memory usage
- Check for memory leaks in components
- Optimize large data structures
- Implement virtualization for long lists

---

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main
```

---

## Backup Strategy

### Database (if using)
- Not applicable (localStorage only)

### Configuration
- Backup `package.json`
- Backup environment variables
- Backup custom configuration files

---

## Support

For deployment issues:
- GitHub Issues: [Report Issue](https://github.com/yourusername/stc-impactviz/issues)
- Email: deploy@stc-impactviz.com
- Documentation: [Full Docs](https://docs.stc-impactviz.com)

---

**Happy Deploying! 🚀**
