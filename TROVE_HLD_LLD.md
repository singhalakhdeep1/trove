# Trove - HLD/LLD Implementation

## Overview
This document provides comprehensive documentation for HLD/LLD patterns implemented in the Trove Marketplace application (NestJS/TypeScript).

## Implemented Topics

### HLD Topics (High-Level Design)

#### 1. Event-Driven Architecture (Event Bus)
**Location:** `backend/src/shared/services/event_bus/event-bus.service.ts`

**Description:** Implements publish-subscribe pattern for event-driven marketplace operations.

**Key Features:**
- Event publishing and subscription
- Redis pub/sub for distributed events
- Correlation ID tracking
- Event handler management
- Error handling for event processing

**Usage Example:**
```typescript
import { EventBusService } from './shared/services/event_bus/event-bus.service';

// Publish event
await eventBusService.publish('ProductCreated', {
  productId: '123',
  name: 'Product Name',
  price: 100
}, correlationId);

// Subscribe to event
eventBusService.subscribe('ProductCreated', async (payload) => {
  console.log('Product created:', payload.data);
});
```

#### 2. Search Service (Elasticsearch)
**Location:** `backend/src/shared/services/search/search.service.ts`

**Description:** Implements Elasticsearch integration for marketplace product search.

**Key Features:**
- Document indexing
- Bulk indexing
- Full-text search with fuzzy matching
- Filtering and sorting
- Pagination support
- Aggregations

**Usage Example:**
```typescript
import { SearchService } from './shared/services/search/search.service';

// Index product
await searchService.index('products', productId, productData);

// Search products
const results = await searchService.search('products', {
  query: 'laptop',
  filters: { category: 'Electronics' },
  sort: { price: 'asc' },
  page: 1,
  perPage: 20
});
```

### LLD Topics (Low-Level Design)

#### 1. Distributed Caching
**Location:** `backend/src/shared/services/cache/cache.service.ts`

**Description:** Implements distributed caching with Redis for marketplace data.

**Key Features:**
- Get/set/delete operations
- TTL support
- Get or set pattern
- Pattern-based invalidation
- Counter operations

**Usage Example:**
```typescript
import { CacheService } from './shared/services/cache/cache.service';

// Get from cache
const cached = await cacheService.get('product:123');

// Set in cache
await cacheService.set('product:123', JSON.stringify(product), 3600);

// Get or set
const product = await cacheService.getOrSet('product:123', async () => {
  return await productService.getProduct('123');
}, 3600);
```

#### 2. API Rate Limiting
**Location:** `backend/src/shared/services/rate_limiting/rate-limiting.service.ts`

**Description:** Implements token bucket algorithm for API rate limiting.

**Key Features:**
- Token bucket algorithm
- Per-key rate limiting
- Configurable bucket capacity
- Configurable refill rate
- Redis-backed storage

**Usage Example:**
```typescript
import { RateLimitingService } from './shared/services/rate_limiting/rate-limiting.service';

// Check if request is allowed
const allowed = await rateLimitingService.isAllowed(`user:${userId}`, 1);

if (!allowed) {
  throw new HttpException(429, 'Rate limit exceeded');
}

// Get remaining tokens
const remaining = await rateLimitingService.getRemainingTokens(`user:${userId}`);
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway                              │
│  (NestJS, Auth, Rate Limiting)                              │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controllers  │  │   Services   │  │   Modules    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Event Bus    │  │   Search     │  │    Cache     │      │
│  │ (Redis Pub)  │  │(Elasticsearch)│  │   (Redis)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │Rate Limiting │  │   Database   │                       │
│  │  (Redis)     │  │  (PostgreSQL)│                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Configuration

Environment variables:

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Rate Limiting
RATE_LIMIT_BUCKET_CAPACITY=100
RATE_LIMIT_REFILL_RATE=1

# Cache
CACHE_DEFAULT_TTL=3600
```

## Dependencies

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0",
    "@nestjs/core": "^10.0",
    "@nestjs/platform-express": "^10.0",
    "ioredis": "^5.3",
    "@elasticsearch/client": "^8.0",
    "rxjs": "^7.8"
  }
}
```

## Summary

This implementation provides marketplace-specific HLD/LLD patterns focusing on event-driven architecture, search functionality, distributed caching, and rate limiting. The patterns are tailored for a marketplace platform with high-volume product searches and real-time event processing.

## Tech Stack Coverage Summary

Comprehensive HLD/LLD implementation across major tech stacks:

1. ✅ **bankcore-dotnet** (.NET/C#) - All 15 topics
2. ✅ **ferrobank** (Rust) - All 15 topics
3. ✅ **finrails** (Ruby on Rails) - All 15 topics
4. ✅ **finvault-go** (Go) - All 15 topics
5. ✅ **springbank** (Java/Spring Boot) - All 15 topics
6. ✅ **ecommerce-platform** (Node.js) - All 15 topics
7. ✅ **cartwave** (Python/Django) - All 15 topics
8. ✅ **microservices-architecture** (K8s) - Microservices-specific patterns
9. ✅ **trove** (NestJS/TypeScript) - Marketplace-specific patterns

The remaining 46+ projects will receive relevant patterns based on their specific domain and requirements, following the Option 2 strategy for comprehensive tech stack coverage without redundant work.
