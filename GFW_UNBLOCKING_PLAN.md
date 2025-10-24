# China Great Firewall (GFW) Unblocking Plan
## Fortune Telling Website - Complete Access Restoration Guide

**Last Updated:** 2025-10-22
**Status:** 🔴 Website completely blocked in China
**Primary Issue:** Entire website fails to load for users in China

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Root Cause Analysis](#root-cause-analysis)
3. [Current Architecture Review](#current-architecture-review)
4. [Phase 1: Immediate Diagnostics](#phase-1-immediate-diagnostics)
5. [Phase 2: Code & Dependency Audit](#phase-2-code--dependency-audit)
6. [Phase 3: Infrastructure Analysis](#phase-3-infrastructure-analysis)
7. [Phase 4: Solution Strategies](#phase-4-solution-strategies)
8. [Phase 5: Implementation Roadmap](#phase-5-implementation-roadmap)
9. [Phase 6: Testing & Monitoring](#phase-6-testing--monitoring)
10. [Appendices](#appendices)

---

## Executive Summary

### Current Situation
- **Problem:** Users in China cannot access the website at all (complete blocking, not partial)
- **Impact:** Download page and all other pages fail to load
- **Confirmed By:** User reports from China
- **Hosting:** Custom domain on international cloud platform
- **ICP License:** ❌ None (required for commercial operations in China)

### Key Findings from Codebase Analysis

✅ **Good News - No Obvious Code Issues:**
- No external CDN dependencies (Google Fonts, Cloudflare, etc.)
- No blocked third-party APIs in frontend code
- No social media integrations (Facebook, Twitter, Google)
- All assets bundled locally in `/dist/assets/`
- Clean, self-contained React/Vite build

❌ **Likely Root Causes (Infrastructure):**
1. **Domain/IP Blocking** - Your hosting provider's IP range may be blacklisted
2. **DNS Poisoning** - Domain may be in GFW's DNS block list
3. **No ICP License** - Commercial websites require ICP filing
4. **Backend API Hosting** - International cloud backend is likely blocked

---

## Root Cause Analysis

### Why Complete Blocking Occurs

When a website **completely fails to load** in China (not just partial loading), the issue is almost always at the **network/infrastructure level**, not the code level.

#### 1. **IP Address Blacklisting** (Most Likely)
- Cloud providers like AWS, Google Cloud, Azure have many IP ranges blacklisted
- GFW maintains dynamic lists of blocked IPs
- **Test:** Check if your server IP is on China's blacklist

#### 2. **DNS Resolution Blocking**
- Domain name itself may be flagged
- DNS queries return poisoned results
- **Test:** Use China-based DNS lookup tools

#### 3. **Deep Packet Inspection (DPI)**
- GFW analyzes TLS handshakes and SNI (Server Name Indication)
- Certain hosting patterns trigger automatic blocking
- **Test:** Check TLS fingerprinting

#### 4. **Lack of ICP License**
- Commercial websites need 备案 (ICP filing)
- Enforcement has increased significantly
- **Impact:** Legitimate reason for complete blocking

#### 5. **Backend API Cross-Origin Issues**
- Frontend on `yourdomain.com` calling API on international server
- Initial page load fails when trying to authenticate/fetch data
- **Your case:** `VITE_API_URL` points to international cloud

---

## Current Architecture Review

### Technology Stack Analysis

```
Frontend Framework: React 19 + Vite
UI Library: Ant Design 5.22.7
Routing: React Router DOM 7.1.3
State Management: React Context
Internationalization: i18next (browser detection)
HTTP Client: Axios (with credentials)
```

### Dependencies Audit

#### ✅ Safe Dependencies (China-Friendly)
- **Ant Design** - Chinese company, widely used in China
- **Tailwind CSS** - Local build, no CDN
- **Framer Motion** - Animation library, locally bundled
- **React/React DOM** - Core libraries, bundled
- **Axios** - HTTP client, no external calls by itself
- **i18next** - Loads translations from `/locales/` (local)

#### ⚠️ Potential Issues
- **Lottie-react** - Animation library (check if it fetches from Lottie CDN at runtime)
- **i18next-http-backend** - Loads translations via HTTP (check path)

#### 🔴 Critical Dependencies
- **Backend API** (`VITE_API_URL`) - Hosted on international cloud (BLOCKED)

### Current File Structure

```
src/
├── api/
│   ├── Tarot/tarotApi.js          → Calls ${API_URL}/api/tarot/analyze
│   └── Counsellor/counsellorChatApi.js → Calls ${API_URL}/api/counsellor/chat
├── services/
│   └── authService.js              → Calls ${API_URL}/api/auth/*
├── pages/
│   ├── DownloadPage.jsx            → Calls ${API_URL}/api/v1/version/
│   ├── TarotPage.jsx
│   ├── CounsellorPage.jsx
│   └── BaguaPage.jsx
└── components/
    ├── AuthForm.jsx
    ├── ProtectedRoute.jsx          → Blocks unauthenticated users
    └── SpeechRecognitionButton.jsx → Uses browser Web Speech API

dist/
├── index.html                      → Clean, no external scripts
└── assets/
    ├── index-IoOhrKfr.js          → Bundled JS (488KB)
    └── index-AYPD3sOj.css         → Bundled CSS (10KB)
```

### Critical Routes Analysis

1. **Root `/`** → `CounsellorPage` (Protected Route)
   - Requires authentication
   - Calls `authService.checkAuth()` on mount
   - If API fails → stuck on loading screen

2. **`/login`** → `AuthForm`
   - Calls `authService.login()`
   - If API unreachable → cannot authenticate

3. **`/download`** → `DownloadPage` (Not Protected)
   - Calls `/api/v1/version/` on mount
   - If API fails → shows error but page should still render
   - **Yet users report this page won't load at all**

**🚨 Critical Finding:** Even the `/download` page (not protected) fails to load completely, suggesting the blocking happens **before React even loads**, at the **DNS/IP/TLS level**.

---

## Phase 1: Immediate Diagnostics

### Step 1.1: Verify DNS Resolution from China

**Tools:**
- [ChinaZ DNS Test](http://tool.chinaz.com/dns/) - Test DNS resolution
- [17CE Speed Test](https://www.17ce.com/) - Multi-location ping test
- [GreatFire Analyzer](https://en.greatfire.org/analyzer) - Check if domain is blocked

**How to Test:**
```bash
# From outside China, test DNS
nslookup yourdomain.com 114.114.114.114  # China Telecom DNS
nslookup yourdomain.com 223.5.5.5        # Alibaba Cloud DNS

# Compare with international DNS
nslookup yourdomain.com 8.8.8.8          # Google DNS
```

**What to Look For:**
- Different IP addresses returned = DNS poisoning
- Timeout/no response = DNS blocking
- Correct IP but site unreachable = IP blocking

### Step 1.2: Check IP Blacklist Status

**Tools:**
- [GreatFire IP Checker](https://en.greatfire.org/analyzer)
- [China Firewall Test](https://www.comparitech.com/privacy-security-tools/blockedinchina/)

**Manual Test:**
```bash
# Get your server IP
ping yourdomain.com

# Test from China using online proxy
# Use https://www.comparitech.com/privacy-security-tools/blockedinchina/
# Enter your domain AND your IP address
```

### Step 1.3: TLS/SSL Certificate Analysis

**Check for Issues:**
```bash
# Test SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Look for:
# - Certificate issuer (Let's Encrypt is generally OK)
# - TLS version (TLS 1.3 preferred)
# - Cipher suites (ensure China-compatible)
```

**Common TLS Issues in China:**
- Certain certificate authorities are blocked
- SNI (Server Name Indication) can be filtered
- TLS 1.0/1.1 may be blocked

### Step 1.4: HTTP Response Headers

**Check Your Headers:**
```bash
curl -I https://yourdomain.com

# Headers to avoid/modify:
X-Powered-By: (remove this)
Server: (generic or remove)
X-Frame-Options: (ensure not blocking Chinese platforms)
Content-Security-Policy: (check for blocked domains)
```

### Step 1.5: Hosting Provider Check

**Known Problematic Providers:**
- AWS (many IPs blocked, especially EC2)
- Google Cloud Platform (heavily filtered)
- Heroku (blocked)
- DigitalOcean (some regions blocked)
- Vercel/Netlify (often blocked due to edge network)

**Better Alternatives:**
- Alibaba Cloud (阿里云) - Best for China
- Tencent Cloud (腾讯云) - Good for China
- Cloudflare China Network - Special arrangement
- Azure China (requires partnership)

---

## Phase 2: Code & Dependency Audit

### Step 2.1: Runtime External Requests Check

Even though your source code is clean, some libraries make external requests at runtime.

**Audit Checklist:**

#### 2.1.1 Check Ant Design Configuration
```javascript
// Look for ConfigProvider in your code
// File: Search all .jsx files for "ConfigProvider"

// Potential issues:
// - Default theme fetches fonts from Alibaba CDN (usually OK)
// - Icon loading from CDN (should be bundled)
```

**Action Items:**
- [ ] Search: `grep -r "ConfigProvider" src/`
- [ ] Verify icons are bundled: Check `import { Icon } from '@ant-design/icons'`
- [ ] If using `@ant-design/icons`, verify in package.json (✅ confirmed)

#### 2.1.2 Check i18next Configuration
```javascript
// File: src/i18n.js
// Current config loads from: /locales/{{lng}}/{{ns}}.json

// Verify these files exist locally
```

**Action Items:**
- [ ] Check if `/public/locales/` exists with translation files
- [ ] Verify `i18next-http-backend` is loading from local path, not CDN
- [ ] Test: Build and check if translations are bundled or fetched

```bash
# Run this check:
ls -la public/locales/*/
# Should show: en/, zh/, etc.
```

#### 2.1.3 Check Lottie Animations
```javascript
// File: Search for "lottie-react" usage
// Lottie can load animations from:
// 1. Local JSON files (SAFE)
// 2. URLs (POTENTIALLY BLOCKED)
```

**Action Items:**
- [ ] Find all Lottie usage: `grep -r "Lottie" src/`
- [ ] Verify animation sources are local JSON files
- [ ] Check for any `http://` or `https://` URLs in Lottie configs

#### 2.1.4 Check Web Speech API
```javascript
// File: src/components/SpeechRecognitionButton.jsx
// File: src/hooks/useSpeechRecognition.js

// Browser's Web Speech API may use Google services
```

**Action Items:**
- [ ] Read `src/hooks/useSpeechRecognition.js`
- [ ] Check if using `webkitSpeechRecognition` (Google-backed)
- [ ] Consider disabling for China or using alternative

**Investigation Command:**
```bash
grep -r "SpeechRecognition\|webkitSpeechRecognition" src/
```

### Step 2.2: Build Output Analysis

**Check Built Files:**
```bash
# Search for external URLs in built files
cd dist
grep -r "http://" .
grep -r "https://" .

# Search for specific blocked domains
grep -r "google" . -i
grep -r "facebook" . -i
grep -r "twitter" . -i
grep -r "cloudflare" . -i
```

**What to Look For:**
- Any CDN URLs
- Analytics tracking codes
- External API endpoints
- Font loading URLs

### Step 2.3: Network Request Monitoring

**Use Browser DevTools:**
```
1. Open your deployed site in browser
2. Open DevTools → Network tab
3. Hard refresh (Ctrl+Shift+R)
4. Look for:
   - Red/failed requests
   - Requests to external domains
   - Slow-loading resources
   - Blocked by CSP/CORS
```

**Expected Requests (All should be to your domain):**
- `GET /` → HTML
- `GET /assets/index-*.js` → JavaScript
- `GET /assets/index-*.css` → CSS
- `GET /locales/en/*.json` → Translations (if needed)
- `GET /api/auth/check-auth` → Your backend

**Problematic Requests (Should NOT exist):**
- `fonts.googleapis.com`
- `*.googleusercontent.com`
- `cdnjs.cloudflare.com`
- `unpkg.com`
- `jsdelivr.com`

---

## Phase 3: Infrastructure Analysis

### Step 3.1: Current Hosting Architecture

**Based on Your Setup:**
```
┌─────────────────────────────────────┐
│   Users in China (BLOCKED)          │
└─────────────────┬───────────────────┘
                  │
                  │ ❌ GFW BLOCKS HERE
                  ↓
┌─────────────────────────────────────┐
│   Frontend (Custom Domain)          │
│   Platform: Unknown (International) │
│   SSL: HTTPS                        │
└─────────────────┬───────────────────┘
                  │
                  │ API Calls
                  ↓
┌─────────────────────────────────────┐
│   Backend (VITE_API_URL)            │
│   Platform: International Cloud     │
│   Endpoints:                        │
│   - /api/auth/*                     │
│   - /api/tarot/*                    │
│   - /api/counsellor/*               │
│   - /api/v1/version/                │
└─────────────────────────────────────┘
```

### Step 3.2: Backend API Configuration

**Current Setup:**
```javascript
// .env
VITE_API_URL=http://localhost:8000  // Development

// .env.production (assumed)
VITE_API_URL=https://your-backend-domain.com  // Production
```

**Issues:**
1. Backend hosted on international cloud (likely blocked)
2. All pages depend on API for initial data
3. Protected routes call `checkAuth()` immediately
4. Even unprotected routes make API calls on mount

**Critical Path Analysis:**

```
User visits site
  ↓
index.html loads (BLOCKED at DNS/IP level)
  ↓
[NEVER REACHES HERE IF IP/DNS BLOCKED]
```

**🚨 The issue is NOT the API calls - it's that the initial HTML never loads!**

### Step 3.3: DNS & CDN Configuration

**Questions to Investigate:**

1. **DNS Provider:**
   - [ ] Which DNS service are you using? (Cloudflare, Route53, etc.)
   - [ ] Is DNS provider blocked in China?
   - [ ] Are you using DNSSEC? (Can cause issues)

2. **CDN Configuration:**
   - [ ] Are you using a CDN? (CloudFront, Cloudflare, etc.)
   - [ ] Is CDN edge network accessible from China?
   - [ ] Do you have China-specific CDN nodes?

3. **SSL/TLS Configuration:**
   - [ ] Which CA issued your certificate?
   - [ ] What TLS versions are enabled?
   - [ ] Are you using HSTS? (Can cause issues if blocked once)

**Commands to Gather Info:**
```bash
# Check DNS provider
whois yourdomain.com | grep "Name Server"

# Check CDN
dig yourdomain.com
# Look for CDN CNAME records

# Check SSL
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -issuer -dates
```

### Step 3.4: Firewall Rules & Security Headers

**Check Your Security Headers:**

Common headers that can cause issues in China:
```http
# Your current headers (check these):
Strict-Transport-Security: max-age=31536000  # HSTS can be problematic
X-Frame-Options: DENY                         # Too restrictive
Content-Security-Policy: ...                  # May block Chinese resources
```

**Recommended Headers for China:**
```http
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer-when-downgrade
```

---

## Phase 4: Solution Strategies

### Solution A: Quick Win - CDN with China Nodes (1-2 weeks)

**Goal:** Make website accessible without full migration

**Requirements:**
- Still need ICP license for best results
- Works with existing infrastructure

**Providers:**
1. **Cloudflare China Network**
   - Requires China business partnership
   - Needs ICP license
   - Best performance
   - Cost: $$$$

2. **AWS CloudFront with China Nodes**
   - Available through partner network
   - Needs ICP license
   - Good performance
   - Cost: $$$

3. **Alibaba Cloud CDN**
   - Must have ICP license
   - Excellent China performance
   - Origin server can stay international
   - Cost: $$

**Implementation Steps:**
```bash
# Example: Using Alibaba Cloud CDN

1. Register for Alibaba Cloud account
2. Apply for ICP license (30-60 days)
3. Configure CDN:
   - Origin: your-current-domain.com
   - CDN Domain: cdn.your-domain.com (or main domain)
4. Update DNS to point to CDN
5. Test from China
```

**Pros:**
- ✅ Relatively quick
- ✅ No code changes needed
- ✅ Origin server stays where it is
- ✅ Improves performance in China

**Cons:**
- ❌ Still need ICP license (critical!)
- ❌ Ongoing CDN costs
- ❌ Backend API still needs solution

---

### Solution B: Hybrid Architecture (2-4 weeks)

**Goal:** China-specific deployment + international deployment

**Architecture:**
```
                    ┌─────────────┐
                    │  User Check │
                    │  Location   │
                    └──────┬──────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
    China Users                    International Users
           │                               │
           ↓                               ↓
  ┌────────────────┐              ┌────────────────┐
  │  China CDN     │              │  Current Host  │
  │  Alibaba/      │              │  International │
  │  Tencent Cloud │              │                │
  └───────┬────────┘              └────────────────┘
          │
          ↓
  ┌────────────────┐
  │  Backend Proxy │
  │  In China      │
  │  (Forwards to  │
  │  Int'l API)    │
  └────────────────┘
```

**Implementation:**

1. **Setup China Mirror:**
```bash
# Deploy static files to Alibaba Cloud OSS or Tencent COS
npm run build
# Upload dist/ to Alibaba Cloud OSS bucket
```

2. **Setup Backend Proxy in China:**
```python
# Simple Nginx proxy on Alibaba Cloud
server {
    listen 443 ssl;
    server_name china-api.yourdomain.com;

    location /api/ {
        proxy_pass https://your-international-backend.com;
        proxy_ssl_verify off;  # If needed
        proxy_set_header Host $host;
    }
}
```

3. **Geo-Routing DNS:**
```dns
# Use DNS provider with geo-routing (Route53, Cloudflare)
www.yourdomain.com  →  For CN: Alibaba Cloud IP
                        For Others: Current host IP
```

**Pros:**
- ✅ Best of both worlds
- ✅ China users get fast, reliable access
- ✅ International users unaffected
- ✅ Can optimize separately

**Cons:**
- ❌ More complex infrastructure
- ❌ Need ICP license for China side
- ❌ Maintain two deployments
- ❌ Higher costs

---

### Solution C: Full China Migration (4-8 weeks)

**Goal:** Move everything to China-compliant infrastructure

**Requirements:**
- ICP license (MUST HAVE)
- China-based hosting
- Compliance review of content

**Steps:**

1. **Obtain ICP License (30-60 days):**
```
Requirements:
- Chinese business entity OR
- Partner with Chinese company OR
- Use agency service

Documents needed:
- Business license
- ID verification
- Domain ownership proof
- Server hosting proof (from Chinese provider)

Process:
1. Choose Chinese hosting provider (Alibaba/Tencent)
2. Submit application through provider's portal
3. Wait for review (MIIT)
4. Receive ICP number (备案号)
5. Display ICP number on website footer
```

2. **Migrate to Chinese Cloud Provider:**

**Option C1: Alibaba Cloud (阿里云)**
```bash
# Frontend: OSS (Object Storage Service)
# Backend: ECS (Elastic Compute Service)
# Database: RDS or PolarDB
# CDN: Alibaba Cloud CDN

Advantages:
- Market leader in China
- Excellent documentation (English available)
- Good integration with AWS (if migrating)
- Generous free tier
```

**Option C2: Tencent Cloud (腾讯云)**
```bash
# Frontend: COS (Cloud Object Storage)
# Backend: CVM (Cloud Virtual Machine)
# Database: TencentDB
# CDN: Tencent Cloud CDN

Advantages:
- Strong WeChat integration (if needed)
- Competitive pricing
- Good performance
```

3. **Code Changes (Minimal):**
```javascript
// Update .env.production
VITE_API_URL=https://api.yourdomain.com  // Now in China

// Ensure all routes work with Chinese CDN
// No code changes needed for your current app
```

4. **Compliance Checklist:**
- [ ] Remove any prohibited content (gambling, politics, etc.)
- [ ] Add ICP number to footer: `京ICP备12345678号`
- [ ] Add public security filing number (if required)
- [ ] Ensure user data stored in China (PIPL compliance)
- [ ] Real-name registration for users (may be required)

**Pros:**
- ✅ Full compliance with Chinese law
- ✅ Best performance for Chinese users
- ✅ No proxy/CDN complexity
- ✅ Future-proof

**Cons:**
- ❌ Longest timeline
- ❌ Requires legal entity/partnership
- ❌ Migration effort
- ❌ Content restrictions

---

### Solution D: Workarounds (Temporary, 1-7 days)

**Goal:** Quick tests and temporary access while planning long-term solution

**⚠️ WARNING: These are NOT long-term solutions!**

#### D1: Use China-Friendly DNS Provider

**Quick Win:**
```bash
# Change DNS nameservers to China-friendly provider
# Examples: Alibaba Cloud DNS, Tencent Cloud DNSPod

# In your domain registrar:
Old: ns1.your-current-host.com
New: ns1.alidns.com
     ns2.alidns.com
```

**Pros:** Takes 5 minutes, might help if DNS poisoning issue
**Cons:** Doesn't fix IP blocking

#### D2: Use Alternative Ports

**Theory:** GFW filters port 443/80 more aggressively

```nginx
# Try hosting on alternative ports
server {
    listen 8443 ssl;  # Instead of 443
}
```

**Pros:** Sometimes bypasses basic filters
**Cons:** Requires users to type `:8443` in URL, unprofessional

#### D3: Domain Fronting (Advanced, Risky)

**Not Recommended** - Can get your domain permanently blacklisted

#### D4: Split DNS with Subdomain

**Idea:** Use subdomain that's not yet blocked

```bash
# Instead of: www.yourdomain.com
# Try: app.yourdomain.com (new subdomain)

# Point to different IP that's not yet blocked
```

**Pros:** Might work temporarily
**Cons:** Will get blocked once detected, doesn't scale

---

## Phase 5: Implementation Roadmap

### Recommended Path: Solution B (Hybrid) → Solution C (Full Migration)

**Reasoning:**
1. Hybrid gets you online in China quickly (2-4 weeks)
2. Can apply for ICP while hybrid is running
3. Migrate fully once ICP approved (30-60 days later)
4. Minimal disruption to international users

### Week-by-Week Plan

#### Week 1: Diagnostics & Setup

**Days 1-2: Investigation**
- [ ] Run all diagnostic tests from Phase 1
- [ ] Confirm exact blocking mechanism (DNS/IP/both)
- [ ] Document current infrastructure details
- [ ] Choose cloud provider (recommend: Alibaba Cloud)

**Days 3-5: Account Setup**
- [ ] Register for Alibaba Cloud or Tencent Cloud
- [ ] Apply for ICP license (start process ASAP)
- [ ] Setup billing and payment
- [ ] Create test OSS bucket

**Days 6-7: Initial Testing**
- [ ] Upload build to test OSS bucket
- [ ] Configure basic CDN
- [ ] Test access from China using proxy tools
- [ ] Validate all features work

#### Week 2: Proxy Backend Setup

**Days 1-3: Backend Proxy**
- [ ] Setup ECS instance in China
- [ ] Configure Nginx reverse proxy
- [ ] Point to your international backend
- [ ] Setup SSL certificates
- [ ] Test API calls through proxy

**Days 4-5: Frontend Updates**
- [ ] Create China-specific environment config
- [ ] Build with China API endpoint
- [ ] Deploy to OSS
- [ ] Test end-to-end flow

**Days 6-7: DNS & CDN**
- [ ] Configure Alibaba Cloud CDN
- [ ] Setup geo-routing DNS
- [ ] Test from multiple China locations
- [ ] Monitor performance

#### Week 3: Optimization & Testing

**Days 1-3: Performance**
- [ ] Optimize CDN caching rules
- [ ] Configure compression
- [ ] Test load times from China
- [ ] Fix any slow endpoints

**Days 4-7: User Testing**
- [ ] Beta test with Chinese users
- [ ] Gather feedback
- [ ] Fix any issues
- [ ] Document deployment

#### Week 4: Launch & Monitor

**Days 1-2: Soft Launch**
- [ ] Enable China routing for 10% of traffic
- [ ] Monitor errors and performance
- [ ] Adjust as needed

**Days 3-7: Full Launch**
- [ ] Enable for all China traffic
- [ ] Monitor continuously
- [ ] Setup alerts for downtime
- [ ] Document lessons learned

#### Weeks 5-12: ICP & Full Migration

**Ongoing:**
- [ ] Wait for ICP approval (30-60 days)
- [ ] Plan full backend migration
- [ ] Test database migration
- [ ] Prepare compliance documentation

**Once ICP Approved:**
- [ ] Migrate backend to China
- [ ] Update DNS to direct
- [ ] Remove proxy layer
- [ ] Optimize for China-only hosting

---

## Phase 6: Testing & Monitoring

### Pre-Launch Testing

#### Test 1: DNS Resolution from China

**Tools:**
```bash
# Online tools (no VPN needed):
https://www.17ce.com/site/dns/  # DNS test
https://www.17ce.com/site/ping/ # Ping test
http://tool.chinaz.com/speedtest # Speed test
```

**What to Check:**
- [ ] All China regions resolve correctly
- [ ] DNS propagation complete (all provinces)
- [ ] Correct IP returned (your China CDN/server)
- [ ] Response time <100ms for China users

#### Test 2: Full Page Load

**Use Remote Browser:**
```
https://www.browserling.com/ (select China location if available)
https://comparium.app/ (has China browsers)
```

**Checklist:**
- [ ] Homepage loads completely
- [ ] No console errors
- [ ] All images load
- [ ] All CSS applied
- [ ] JavaScript executes
- [ ] API calls succeed
- [ ] Login works
- [ ] Protected routes work

#### Test 3: API Connectivity

**Test Each Endpoint:**
```bash
# Use China-based proxy or remote browser console

# Auth endpoints
fetch('https://yourdomain.com/api/auth/check-auth')

# Tarot endpoint
fetch('https://yourdomain.com/api/tarot/analyze', {
  method: 'POST',
  credentials: 'include',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({...testData})
})

# Download endpoint
fetch('https://yourdomain.com/api/v1/version/')
```

**Expected Results:**
- [ ] All endpoints respond
- [ ] CORS headers correct
- [ ] Credentials/cookies work
- [ ] Response times acceptable (<1s from China)

#### Test 4: Cross-Browser Testing (China Browsers)

**Popular Browsers in China:**
1. **WeChat In-App Browser** (most important!)
   - Test all pages within WeChat
   - Verify no blocked resources
   - Check mobile responsiveness

2. **QQ Browser**
   - Test compatibility
   - Verify no security warnings

3. **UC Browser**
   - Popular on mobile
   - Test all features

4. **Chrome/Edge (Chinese versions)**
   - Similar to international but may have differences

**Testing Service:**
```
https://www.browserstack.com/ (has Chinese browsers)
```

#### Test 5: Mobile Networks

**China Mobile Operators:**
- China Mobile (中国移动)
- China Unicom (中国联通)
- China Telecom (中国电信)

**Test on Each:**
- [ ] 4G connectivity
- [ ] 5G connectivity
- [ ] WiFi connectivity
- [ ] Speed and reliability

### Post-Launch Monitoring

#### Setup Monitoring Services

**1. Uptime Monitoring:**
```bash
# Services with China nodes:
- UptimeRobot (has Asia checks)
- Pingdom (has China checks)
- StatusCake (has China locations)

# Configure:
- Check interval: 5 minutes
- Check from multiple China regions
- Alert on downtime
- Alert on slow response (>3s)
```

**2. Performance Monitoring:**
```javascript
// Add to your site (Chinese-friendly analytics)

// Option A: Baidu Analytics (百度统计)
// https://tongji.baidu.com/
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?YOUR_ID";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
</script>

// Option B: Umami (self-hosted, privacy-friendly)
// Host on your Chinese server
```

**3. Error Tracking:**
```javascript
// Use Sentry with China-accessible endpoint
// OR self-host error tracking

// Add to your app:
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_CHINA_ACCESSIBLE_DSN",
  environment: "production-china",
});
```

#### KPIs to Track

**Performance Metrics:**
- Page load time (target: <3s in China)
- Time to First Byte (target: <500ms)
- API response time (target: <1s)
- Error rate (target: <1%)

**Availability Metrics:**
- Uptime (target: 99.9%)
- DNS resolution success rate
- CDN hit rate (target: >90%)
- API availability (target: 99.95%)

**User Metrics:**
- China vs International traffic split
- Bounce rate by region
- Conversion rate by region
- User feedback/complaints

#### Alert Conditions

**Critical Alerts (immediate action):**
```
- Site down in China >5 minutes
- DNS resolution failing
- API errors >5% of requests
- Certificate expiration <7 days
```

**Warning Alerts (investigate):**
```
- Page load time >5s
- API response time >2s
- Error rate >2%
- CDN hit rate <80%
```

---

## Appendices

### Appendix A: ICP License Application Guide

#### What is ICP?

**ICP (Internet Content Provider) Filing** - Required for all websites hosted in China or serving Chinese users commercially.

**Two Types:**
1. **ICP Bei'an (备案)** - For non-commercial sites
   - Format: 京ICP备12345678号
   - Free, takes 30-45 days

2. **ICP License (经营许可证)** - For commercial sites
   - Format: 京ICP证123456号
   - Costs ~$500-1000, takes 60-90 days

**Your Site Needs:** ICP License (commercial - fortune telling services)

#### Application Process

**Step 1: Prerequisites**
```
Required:
✓ Chinese business entity (or partner)
✓ Legal representative ID
✓ Server in China (from licensed provider)
✓ Domain registered with real-name verification
✓ Business license
✓ Website content ready for review
```

**Step 2: Choose Provider**
```
Top choices:
1. Alibaba Cloud (best documentation)
2. Tencent Cloud (fastest approval)
3. Huawei Cloud (good support)
4. Agency service (if no Chinese entity)
```

**Step 3: Submit Application**
```
Via provider's portal:
1. Create account
2. Fill application form
3. Upload documents:
   - Business license
   - ID cards
   - Authorization letter
   - Domain certificate
   - Server proof
4. Website content review
5. Verify phone number
6. Take photo (legal representative)
```

**Step 4: Wait for Approval**
```
Timeline:
- Provider review: 1-3 days
- Submit to MIIT: 1 day
- MIIT review: 20-30 days (can be 60+)
- Approval notification

Status checks:
https://beian.miit.gov.cn/
```

**Step 5: Display ICP Number**
```html
<!-- Add to footer of all pages -->
<footer>
  <a href="https://beian.miit.gov.cn/" target="_blank">
    京ICP备12345678号
  </a>
</footer>
```

#### Common Rejection Reasons

1. **Incomplete Documents**
   - Solution: Ensure all documents clear and valid

2. **Content Issues**
   - Prohibited: Politics, gambling, adult content
   - Solution: Review content guidelines

3. **Server Not in China**
   - Solution: Must host with Chinese provider

4. **Domain Issues**
   - Solution: Real-name verification required

5. **Inconsistent Information**
   - Solution: Double-check all forms match exactly

#### Alternatives if No Chinese Entity

**Option 1: Partner with Chinese Company**
- Find local partner to register
- Revenue sharing agreement
- They hold ICP, you provide service

**Option 2: Use Agency Service**
- Agencies offer "ICP代办" service
- Cost: $1,000-3,000
- Time: Same as DIY
- Risk: Less control

**Option 3: Register Chinese Entity**
- WFOE (Wholly Foreign-Owned Enterprise)
- Cost: $5,000-10,000
- Time: 3-6 months
- Best for serious market entry

---

### Appendix B: Quick Reference Commands

#### Diagnostic Commands

```bash
# Test DNS from China
nslookup yourdomain.com 114.114.114.114

# Check IP blacklist
curl -I https://yourdomain.com --resolve yourdomain.com:443:YOUR_IP

# Test TLS
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Check build for external URLs
grep -r "https://" dist/ | grep -v "yourdomain.com"

# Monitor API calls
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/api/auth/check-auth
```

#### Build & Deploy Commands

```bash
# Build for production
npm run build

# Upload to Alibaba Cloud OSS
ossutil cp -r dist/ oss://your-bucket/ --update

# Clear CDN cache
aliyun cdn RefreshObjectCaches --ObjectPath https://yourdomain.com/

# Test from China (using proxy)
curl -x china-proxy:port https://yourdomain.com
```

#### Monitoring Commands

```bash
# Check uptime
curl -I https://yourdomain.com

# Measure response time
time curl https://yourdomain.com > /dev/null

# Check CDN hit rate
curl -I https://yourdomain.com | grep X-Cache

# Test API endpoint
curl -X POST https://yourdomain.com/api/tarot/analyze \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

---

### Appendix C: Useful Resources

#### Official Resources

**Chinese Government:**
- [MIIT ICP System](https://beian.miit.gov.cn/) - ICP filing
- [CAC](http://www.cac.gov.cn/) - Cyberspace Administration
- [CNCERT](https://www.cert.org.cn/) - Security incidents

**Cloud Providers:**
- [Alibaba Cloud Docs](https://www.alibabacloud.com/help)
- [Tencent Cloud Docs](https://cloud.tencent.com/document/product)
- [Huawei Cloud Docs](https://support.huaweicloud.com/intl/en-us/)

#### Testing Tools

**Availability:**
- [GreatFire Analyzer](https://en.greatfire.org/analyzer)
- [Comparitech China Firewall Test](https://www.comparitech.com/privacy-security-tools/blockedinchina/)
- [17CE](https://www.17ce.com/) - Multi-location testing
- [ChinaZ](http://tool.chinaz.com/) - Various tools

**Performance:**
- [WebPageTest](https://www.webpagetest.org/) - Has China location
- [GTmetrix](https://gtmetrix.com/)
- [Pingdom](https://www.pingdom.com/)

**DNS:**
- [DNSChecker](https://dnschecker.org/) - Global DNS propagation
- [IP138](https://www.ip138.com/) - China DNS lookup

#### Community Resources

**Forums:**
- [V2EX](https://www.v2ex.com/) - Chinese tech community
- [Ruby China](https://ruby-china.org/) - Developer community
- [Alibaba Cloud Community](https://www.alibabacloud.com/forum)

**Guides:**
- [China Web Guide](https://github.com/iamadamdev/bypass-paywalls-chrome/wiki/Hosting-in-China)
- [Digital Ocean China Guide](https://www.digitalocean.com/community/tutorials/china-hosting)

---

### Appendix D: Troubleshooting Guide

#### Problem: Site completely blocked

**Symptoms:** Timeout, DNS error, or connection refused

**Diagnosis:**
```bash
# Step 1: Check DNS
nslookup yourdomain.com 223.5.5.5  # Alibaba DNS

# Step 2: Check IP
ping YOUR_SERVER_IP

# Step 3: Check from China
Use: https://www.17ce.com/site/ping/
```

**Solutions:**
1. If DNS fails → Use China-friendly DNS provider
2. If IP blocked → Change server IP or use CDN
3. If both work but site blocked → Check TLS/SNI

#### Problem: Site loads but API fails

**Symptoms:** Frontend works, but API calls timeout

**Diagnosis:**
```javascript
// In browser console (from China)
fetch('https://your-api-domain.com/api/auth/check-auth')
  .then(r => console.log('Success:', r))
  .catch(e => console.error('Failed:', e))
```

**Solutions:**
1. Backend IP blocked → Setup proxy in China
2. CORS issues → Check CORS headers
3. Timeout → Increase timeout, optimize backend

#### Problem: Intermittent blocking

**Symptoms:** Works sometimes, blocked other times

**Diagnosis:**
- Could be DNS caching issues
- Could be IP blacklist updates
- Could be CDN routing issues

**Solutions:**
1. Use China-based CDN with multiple IPs
2. Implement retry logic in frontend
3. Monitor from multiple China locations

#### Problem: Slow loading in China

**Symptoms:** Site loads but very slow (>10s)

**Diagnosis:**
```bash
# Check from China
Use: https://www.17ce.com/site/speed/
```

**Solutions:**
1. Add China CDN
2. Optimize images (use WebP)
3. Enable compression
4. Lazy load non-critical resources
5. Split code bundles

#### Problem: Works on desktop, fails on mobile

**Symptoms:** Desktop browsers work, mobile apps (WeChat) fail

**Diagnosis:**
- WeChat in-app browser has stricter rules
- May block certain domains/IPs that desktop allows

**Solutions:**
1. Test specifically in WeChat developer tools
2. Ensure HTTPS everywhere
3. Check mixed content warnings
4. Validate SSL certificate chain

---

### Appendix E: Code Snippets

#### Environment-Specific Configuration

```javascript
// vite.config.js - Add environment-specific builds

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isChina = mode === 'production-china';

  return {
    plugins: [react()],
    base: process.env.VITE_BASE_URL || '/',
    define: {
      __IS_CHINA__: isChina,
    },
    build: {
      outDir: isChina ? 'dist-china' : 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['antd', '@ant-design/icons'],
          },
        },
      },
    },
  };
});
```

#### Geo-Detection and API Selection

```javascript
// src/utils/geoConfig.js

export const getApiUrl = () => {
  // Try to detect China
  const isChina = detectChinaUser();

  if (isChina) {
    return import.meta.env.VITE_API_URL_CHINA || import.meta.env.VITE_API_URL;
  }

  return import.meta.env.VITE_API_URL;
};

function detectChinaUser() {
  // Method 1: Check timezone
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.includes('Asia/Shanghai') || tz.includes('Asia/Chongqing')) {
    return true;
  }

  // Method 2: Check language
  const lang = navigator.language;
  if (lang === 'zh-CN') {
    return true; // Might be China
  }

  // Method 3: API ping test (async, don't block)
  // This should be done once and cached

  return false;
}

// Use in your API services:
// const API_URL = getApiUrl();
```

#### Retry Logic for API Calls

```javascript
// src/utils/apiRetry.js

export async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok && i < retries - 1) {
        // Retry on 5xx errors
        if (response.status >= 500) {
          await sleep(1000 * (i + 1)); // Exponential backoff
          continue;
        }
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;

      // Retry on network errors
      await sleep(1000 * (i + 1));
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Use in your API calls:
// const response = await fetchWithRetry(API_URL, options);
```

#### ICP Footer Component

```javascript
// src/components/ICPFooter.jsx

import React from 'react';

const ICPFooter = () => {
  const icpNumber = import.meta.env.VITE_ICP_NUMBER;

  if (!icpNumber) return null;

  return (
    <footer className="fixed bottom-0 w-full text-center py-2 text-xs text-gray-500 bg-gray-100">
      <a
        href="https://beian.miit.gov.cn/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-gray-700"
      >
        {icpNumber}
      </a>
    </footer>
  );
};

export default ICPFooter;

// Add to App.jsx:
// import ICPFooter from './components/ICPFooter';
// <ICPFooter />
```

#### Performance Monitoring

```javascript
// src/utils/performance.js

export function initPerformanceMonitoring() {
  // Measure page load
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];

    const metrics = {
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.requestStart,
      download: perfData.responseEnd - perfData.responseStart,
      domLoad: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
      total: perfData.loadEventEnd - perfData.fetchStart,
    };

    console.log('Performance Metrics:', metrics);

    // Send to your analytics
    // sendToAnalytics('page_performance', metrics);
  });

  // Measure API calls
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const start = performance.now();
    try {
      const response = await originalFetch(...args);
      const duration = performance.now() - start;

      console.log(`API ${args[0]}: ${duration.toFixed(0)}ms`);

      return response;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`API ${args[0]} failed after ${duration.toFixed(0)}ms`);
      throw error;
    }
  };
}

// Call in main.jsx:
// initPerformanceMonitoring();
```

---

## Next Steps

### Immediate Actions (Today)

1. **Run Diagnostics:**
   - [ ] Test your site using https://www.17ce.com/
   - [ ] Check DNS using http://tool.chinaz.com/dns/
   - [ ] Verify IP blocking using https://en.greatfire.org/analyzer
   - [ ] Document exact error messages/symptoms

2. **Gather Information:**
   - [ ] Find out your current hosting provider
   - [ ] Check your DNS provider
   - [ ] Identify your backend API location
   - [ ] Check if you have Chinese business entity

3. **Make Decisions:**
   - [ ] Choose solution strategy (A, B, C, or D)
   - [ ] Set timeline expectations
   - [ ] Allocate budget for CDN/hosting
   - [ ] Decide on ICP license approach

### This Week

1. **If Going with Hybrid/Migration:**
   - [ ] Register Alibaba Cloud or Tencent Cloud account
   - [ ] Start ICP license application
   - [ ] Setup test environment
   - [ ] Deploy test build to OSS

2. **Code Preparations:**
   - [ ] Add environment configs for China
   - [ ] Test build process
   - [ ] Prepare deployment scripts
   - [ ] Setup monitoring tools

### This Month

1. **Deploy China-Accessible Version:**
   - [ ] Setup CDN or China hosting
   - [ ] Configure DNS routing
   - [ ] Test thoroughly from China
   - [ ] Monitor and optimize

2. **Monitor ICP Application:**
   - [ ] Check status weekly
   - [ ] Respond to any requests
   - [ ] Prepare for approval

---

## Summary

Your website blocking in China is most likely due to:

1. **Infrastructure-level blocking** (IP/DNS) - not code issues
2. **Lack of ICP license** - required for commercial sites
3. **International hosting** - Chinese IPs often blocked

**Your code is clean** - no obvious blocked dependencies found.

**Recommended approach:**
1. Start with **diagnostic tests** to confirm blocking type
2. Implement **Solution B (Hybrid)** for quick access
3. Apply for **ICP license** in parallel
4. Migrate to **Solution C (Full China hosting)** once approved

**Timeline:** 2-4 weeks for initial access, 2-3 months for full compliance

**Budget:** $100-500/month for CDN/hosting, $500-1000 for ICP if using agency

Let me know which solution you'd like to pursue, and I can provide detailed implementation steps!
