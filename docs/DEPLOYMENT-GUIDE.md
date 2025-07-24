# Deployment Guide

This guide covers deploying Timeio to various platforms and environments.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm or npm package manager
- Git repository access
- Backend API deployed and accessible

### Environment Setup

1. **Clone and install dependencies**:
   ```bash
   cd apps/v4
   pnpm install
   ```

2. **Set environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your production values
   ```

3. **Build the application**:
   ```bash
   pnpm build
   ```

## 🌐 Platform Deployments

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Select the `apps/v4` directory as the root

#### 2. Configure Build Settings
```json
{
  "framework": "nextjs",
  "buildCommand": "pnpm build",
  "outputDirectory": ".next",
  "installCommand": "pnpm install",
  "devCommand": "pnpm dev"
}
```

#### 3. Environment Variables
Set these in the Vercel dashboard:

```env
# Production API URL
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Authentication
NEXTAUTH_SECRET=your-production-secret-key
NEXTAUTH_URL=https://your-domain.com

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Database (if using)
DATABASE_URL=your-database-url

# Email service (if using)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

#### 4. Custom Domain (Optional)
1. Add your domain in Vercel dashboard
2. Configure DNS records as instructed
3. Enable HTTPS (automatic with Vercel)

### Netlify

#### 1. Build Configuration
Create `netlify.toml` in the project root:

```toml
[build]
  base = "apps/v4"
  command = "pnpm build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Environment Variables
Set in Netlify dashboard under Site settings > Environment variables.

### Railway

#### 1. Railway Configuration
Create `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### 2. Environment Variables
Set in Railway dashboard under Variables tab.

### Docker Deployment

#### 1. Dockerfile
Create `Dockerfile` in `apps/v4`:

```dockerfile
# Use Node.js 18 Alpine image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install -g pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 2. Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  booking-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

  backend:
    image: your-backend-image
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/booking
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=booking
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

#### 3. Build and Run
```bash
# Build the image
docker build -t booking-app .

# Run with docker-compose
docker-compose up -d

# Or run standalone
docker run -p 3000:3000 booking-app
```

## 🔧 Production Configuration

### Next.js Configuration

Update `next.config.mjs` for production:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports if needed
  // output: 'export',
  
  // Optimize images
  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable compression
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-booking',
        destination: '/booking',
        permanent: true,
      },
    ]
  },
  
  // Rewrites for API proxy (if needed)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://your-api-domain.com/api/:path*',
      },
    ]
  },
}

export default nextConfig
```

### Environment Variables

#### Development (.env.local)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication
NEXTAUTH_SECRET=dev-secret-key
NEXTAUTH_URL=http://localhost:4000

# Database (if using)
DATABASE_URL=postgresql://user:pass@localhost:5432/booking_dev

# Email (if using)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
```

#### Production (.env.production)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourapp.com

# Authentication
NEXTAUTH_SECRET=your-super-secret-production-key
NEXTAUTH_URL=https://yourapp.com

# Database
DATABASE_URL=postgresql://user:pass@prod-db:5432/booking

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=GA_MEASUREMENT_ID

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Performance Optimization

#### 1. Bundle Analysis
```bash
# Install bundle analyzer
pnpm add -D @next/bundle-analyzer

# Update next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Run analysis
ANALYZE=true pnpm build
```

#### 2. Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image'

export const OptimizedImage = ({ src, alt, ...props }) => (
  <Image
    src={src}
    alt={alt}
    width={400}
    height={300}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    {...props}
  />
)
```

#### 3. Code Splitting
```typescript
// Lazy load components
import dynamic from 'next/dynamic'

const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
})

const BookingConfirmation = dynamic(() => import('./BookingConfirmation'), {
  loading: () => <LoadingSpinner />
})
```

## 🔒 Security Configuration

### 1. Security Headers
```javascript
// next.config.mjs
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
        },
      ],
    },
  ]
}
```

### 2. Environment Variable Security
- Never commit `.env` files to version control
- Use different secrets for each environment
- Rotate secrets regularly
- Use secret management services (AWS Secrets Manager, Vercel Secrets, etc.)

### 3. CORS Configuration
Ensure your backend has proper CORS settings:

```rust
// Rust backend example
use actix_cors::Cors;

let cors = Cors::default()
    .allowed_origin("https://yourapp.com")
    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE", "PATCH"])
    .allowed_headers(vec![
        http::header::AUTHORIZATION,
        http::header::CONTENT_TYPE,
    ])
    .supports_credentials();
```

## 📊 Monitoring and Analytics

### 1. Error Tracking
```typescript
// Install Sentry
pnpm add @sentry/nextjs

// sentry.client.config.js
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### 2. Performance Monitoring
```typescript
// Custom performance monitoring
export const trackPageView = (page: string) => {
  if (typeof window !== 'undefined') {
    // Google Analytics
    gtag('config', process.env.NEXT_PUBLIC_ANALYTICS_ID, {
      page_path: page,
    })
    
    // Custom metrics
    performance.mark(`page-view-${page}`)
  }
}
```

### 3. Health Checks
```typescript
// pages/api/health.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  })
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        cd apps/v4
        npm install
    
    - name: Run tests
      run: |
        cd apps/v4
        npm run test
    
    - name: Build application
      run: |
        cd apps/v4
        npm run build
      env:
        NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
        NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
        NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### GitLab CI
Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - cd apps/v4
    - npm install
    - npm run test
    - npm run lint

build:
  stage: build
  image: node:18
  script:
    - cd apps/v4
    - npm install
    - npm run build
  artifacts:
    paths:
      - apps/v4/.next/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  script:
    - apk add --no-cache curl
    - curl -X POST $DEPLOY_WEBHOOK
  only:
    - main
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next
rm -rf node_modules
pnpm install
pnpm build
```

#### 2. Environment Variable Issues
- Ensure all required variables are set
- Check variable names (case-sensitive)
- Verify variable values are correct
- Restart deployment after variable changes

#### 3. API Connection Issues
- Verify API URL is correct
- Check CORS configuration
- Ensure API is accessible from deployment platform
- Test API endpoints manually

#### 4. Performance Issues
- Run bundle analysis: `ANALYZE=true pnpm build`
- Check for large dependencies
- Optimize images and assets
- Implement proper caching

### Debug Commands
```bash
# Check build output
pnpm build --debug

# Analyze bundle
ANALYZE=true pnpm build

# Check environment variables
pnpm dev --debug

# Run type checking
pnpm typecheck

# Lint code
pnpm lint
```

## 📈 Scaling Considerations

### 1. Database Scaling
- Use connection pooling
- Implement read replicas
- Consider database sharding for large datasets

### 2. CDN Configuration
- Configure CDN for static assets
- Use edge caching for API responses
- Implement proper cache headers

### 3. Load Balancing
- Use multiple instances
- Implement health checks
- Configure auto-scaling

### 4. Monitoring
- Set up application performance monitoring (APM)
- Monitor error rates and response times
- Implement alerting for critical issues

This deployment guide provides comprehensive instructions for deploying Timeio to various platforms while ensuring security, performance, and scalability. 