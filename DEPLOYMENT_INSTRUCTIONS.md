# Deployment Instructions

This document provides step-by-step instructions for deploying the Shikho Quarter in Review application to production with proper security measures and API integration.

## Prerequisites

Before deployment, ensure you have:

- Access to Shikho's production API endpoints
- Environment variables and secrets management system
- SSL certificates for HTTPS
- CI/CD pipeline setup (recommended)
- Monitoring and logging infrastructure

## 1. Environment Configuration

### Update Environment Settings

1. **Modify `src/config/environment.ts`**:
```typescript
export const ENV_CONFIG = {
  // Set to true for production
  IS_PRODUCTION: true,
  
  // Update with your actual production API endpoint
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://api.shikho.com/v1/students',
  
  // Increase timeout for production (15-30 seconds recommended)
  API_TIMEOUT: 30000,
  
  // Add environment-specific settings
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  VERSION: process.env.VITE_APP_VERSION || '1.0.0',
};
```

2. **Create environment files**:
```bash
# .env.production
VITE_API_BASE_URL=https://api.shikho.com/v1/students
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production

# .env.staging (optional)
VITE_API_BASE_URL=https://staging-api.shikho.com/v1/students
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=staging
```

## 2. API Security Implementation

### Authentication & Authorization

1. **Update `src/services/studentAPI.ts`** to include authentication:
```typescript
// Add authentication headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-API-Key': process.env.VITE_API_KEY,
    'X-Client-Version': process.env.VITE_APP_VERSION,
  };
};

// Update fetchStudentData function
export async function fetchStudentData(studentId: string): Promise<StudentData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ENV_CONFIG.API_TIMEOUT);

  try {
    const response = await fetch(getStudentAPIUrl(studentId), {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal,
      credentials: 'include', // For session cookies
    });

    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to login or refresh token
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (response.status === 403) {
      throw new Error('Access denied to student data');
    }

    // ... rest of the function
  } catch (error) {
    // ... error handling
  }
}
```

2. **Add token refresh logic**:
```typescript
// src/services/authService.ts
export class AuthService {
  static async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('auth_token', token);
        return token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    return null;
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
```

## 3. API Endpoint Requirements

### Expected API Response Format

Your API must return data in this exact format:

```typescript
interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
  requestId: string; // For tracking/debugging
}

interface StudentData {
  id: string;
  name: string;
  class: string;
  section: string;
  engagementLevel: 'high' | 'moderate' | 'low';
  attendance: {
    percent: number;
    total: number;
    attended: number;
    missed: number;
  };
  quiz: {
    completed: number;
    correctAnswers: number;
    totalQuestions: number;
  };
  modelTests: {
    total: number;
    completed: number;
    avgScore: number;
    avgTime: string;
  };
  streak: {
    longest: number;
  };
  studyTime: {
    total: string; // Format: "HH:MM"
    october: string;
    november: string;
    december: string;
  };
  finalScore: number;
}
```

### API Endpoint Structure

```
GET /api/v1/students/{studentId}
```

**Required Headers**:
- `Authorization: Bearer {token}`
- `X-API-Key: {api_key}`
- `X-Client-Version: {version}`

**Response Example**:
```json
{
  "data": {
    "id": "1937",
    "name": "তাসনিম হাসান",
    "class": "ক্লাস ৯",
    "section": "বিজ্ঞান বিভাগ",
    "engagementLevel": "high",
    "attendance": {
      "percent": 95,
      "total": 40,
      "attended": 38,
      "missed": 2
    },
    "quiz": {
      "completed": 40,
      "correctAnswers": 110,
      "totalQuestions": 130
    },
    "modelTests": {
      "total": 12,
      "completed": 12,
      "avgScore": 85,
      "avgTime": "38 mins"
    },
    "streak": {
      "longest": 15
    },
    "studyTime": {
      "total": "60:00",
      "october": "18:00",
      "november": "20:00",
      "december": "22:00"
    },
    "finalScore": 92
  },
  "success": true,
  "message": "Student data retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req_123456789"
}
```

## 4. Security Measures

### Frontend Security

1. **Content Security Policy (CSP)**:
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.shikho.com;
  frame-ancestors 'none';
">
```

2. **HTTPS Enforcement**:
```typescript
// src/utils/security.ts
export const enforceHTTPS = () => {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }
};
```

3. **Input Validation**:
```typescript
// src/utils/validation.ts
export const validateStudentId = (id: string): boolean => {
  return /^\d{4,6}$/.test(id) && id.length >= 4 && id.length <= 6;
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};
```

### API Security Headers

Ensure your API returns these security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

## 5. Error Handling & Monitoring

### Enhanced Error Handling

1. **Update error handling in components**:
```typescript
// src/components/ErrorDisplay.tsx
interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  errorCode?: string;
  requestId?: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  errorCode, 
  requestId 
}) => {
  const logError = () => {
    // Send error to monitoring service
    console.error('Application Error:', {
      error,
      errorCode,
      requestId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  };

  useEffect(() => {
    logError();
  }, [error]);

  // ... rest of component
};
```

2. **Add error boundary**:
```typescript
// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    // Send to monitoring service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 6. Performance Optimization

### Build Optimization

1. **Update `vite.config.ts`**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    https: process.env.NODE_ENV === 'production',
  },
});
```

2. **Add service worker for caching**:
```typescript
// public/sw.js
const CACHE_NAME = 'shikho-qinreview-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 7. Deployment Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] API endpoints tested and validated
- [ ] Authentication flow tested
- [ ] Error handling verified
- [ ] Security headers implemented
- [ ] HTTPS certificates installed
- [ ] Monitoring and logging configured
- [ ] Performance testing completed
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness verified

### Deployment Steps

1. **Build the application**:
```bash
npm run build
```

2. **Test the production build locally**:
```bash
npm run preview
```

3. **Deploy to your hosting platform** (examples):

**Vercel**:
```bash
npm install -g vercel
vercel --prod
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**AWS S3 + CloudFront**:
```bash
aws s3 sync dist/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Post-Deployment

- [ ] Verify all routes work correctly
- [ ] Test API integration with real data
- [ ] Monitor error rates and performance
- [ ] Verify security headers are present
- [ ] Test authentication flow
- [ ] Validate HTTPS enforcement
- [ ] Check mobile responsiveness
- [ ] Monitor user analytics

## 8. Monitoring & Analytics

### Recommended Tools

1. **Error Monitoring**: Sentry, LogRocket, or Bugsnag
2. **Performance Monitoring**: Google Analytics, Hotjar, or FullStory
3. **API Monitoring**: Postman Monitor, Pingdom, or UptimeRobot
4. **Security Monitoring**: Security headers, CSP violations

### Implementation Example

```typescript
// src/utils/monitoring.ts
export const initializeMonitoring = () => {
  // Initialize your monitoring service here
  if (process.env.VITE_SENTRY_DSN) {
    // Sentry.init({ dsn: process.env.VITE_SENTRY_DSN });
  }
  
  if (process.env.VITE_GA_ID) {
    // Google Analytics initialization
  }
};
```

## 9. Backup & Recovery

### Data Backup Strategy

1. **API Data**: Ensure your backend has proper backup strategies
2. **User Sessions**: Implement session persistence
3. **Configuration**: Version control all environment configurations

### Disaster Recovery

1. **Rollback Plan**: Maintain previous versions for quick rollback
2. **Monitoring Alerts**: Set up alerts for critical failures
3. **Documentation**: Keep deployment procedures documented

## 10. Maintenance

### Regular Tasks

- [ ] Monitor API performance and error rates
- [ ] Update dependencies regularly
- [ ] Review security headers and CSP
- [ ] Analyze user analytics and feedback
- [ ] Test backup and recovery procedures
- [ ] Update SSL certificates before expiration

### Version Updates

1. **Semantic Versioning**: Follow semantic versioning for releases
2. **Changelog**: Maintain a changelog for all updates
3. **Testing**: Test updates in staging before production
4. **Rollback**: Always have a rollback plan ready