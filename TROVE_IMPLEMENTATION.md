# Trove - Implementation

## Overview
This document describes the API integrations added to Trove.

## Technologies Added

### 1. GraphQL
- Type definitions for Item, Category
- Queries for items, categories
- Mutations for CRUD operations
- Subscriptions for real-time events (item created/updated/deleted)
- PubSub for event publishing

### 2. tRPC
- Item procedures (byId, create, update, delete, list)
- Search procedures (items)
- Category procedures (list)
- Zod input validation
- Type-safe API endpoints

### 3. Typesense
- Document indexing and updates
- Search with query_by
- Filter by category
- Filter by tag
- Collection management
- Schema configuration

### 4. Algolia
- Document indexing and updates
- Search with highlighting
- Filter by category
- Filter by tag
- Index configuration
- Batch operations
- Custom ranking

### 5. Kafka
- Producer for item events
- Producer for search events
- Producer for view events
- Consumer for item events
- Consumer for search events
- Consumer for view events
- Event-driven architecture

### 6. GraphQL Subscriptions
- Real-time item events
- PubSub-based event system
- Subscription resolvers

## Files Created

### GraphQL
- `backend/src/modules/graphql/schema.ts` - GraphQL schema
- `backend/src/modules/graphql/resolvers.ts` - GraphQL resolvers with PubSub

### tRPC
- `backend/src/modules/trpc/router.ts` - tRPC router

### Typesense
- `backend/src/modules/typesense/client.ts` - Typesense client

### Algolia
- `backend/src/modules/algolia/client.ts` - Algolia client

### Kafka
- `backend/src/modules/kafka/producer.ts` - Kafka producer
- `backend/src/modules/kafka/consumer.ts` - Kafka consumer

## Installation Required

Add to `package.json`:
```json
{
  "dependencies": {
    "apollo-server-express": "^3.12.0",
    "@trpc/server": "^10.38.0",
    "zod": "^3.22.0",
    "typesense": "^1.8.0",
    "algoliasearch": "^4.22.0",
    "kafkajs": "^2.2.4"
  }
}
```

Run:
```bash
npm install
```

## Environment Variables

```env
# Typesense
TYPESENSE_NODES=[{"host":"localhost","port":"8108","protocol":"http"}]
TYPESENSE_API_KEY=xyz

# Algolia
ALGOLIA_APP_ID=your_app_id
ALGOLIA_API_KEY=your_api_key

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_GROUP_ID=trove-consumer-group
```

## Notes
- All code is written but packages are not installed (per user request)
- GraphQL provides flexible API with subscriptions
- tRPC provides end-to-end type safety
- Typesense provides fast, relevant search
- Algolia provides powerful search with analytics
- Kafka enables event-driven architecture
