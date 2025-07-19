# Product Search Service

A high-performance, scalable product search service built with NestJS, implementing modern architectural patterns for maintainability and scalability.

## 🏗️ Architecture Overview

This service is built using several architectural patterns that work together to create a robust and maintainable system:

### 🎯 Domain-Driven Design (DDD)

DDD is at the heart of this application, ensuring that the domain model reflects the business requirements:

- **Bounded Contexts**: Clear separation of concerns with well-defined boundaries
- **Ubiquitous Language**: Shared language between developers and domain experts
- **Rich Domain Model**: Business logic is encapsulated within domain entities and value objects
- **Aggregates**: Transactional consistency boundaries around domain objects

### 🔄 CQRS (Command Query Responsibility Segregation)

The application implements CQRS to separate read and write operations, optimizing each for their specific purposes:

#### Commands (Write Operations)
Commands are used to mutate state and implement business logic:
- `CreateListingChannelCommand`: Creates a new listing channel with validation
- `DeleteListingVariantFromChannelCommand`: Removes a variant from a channel
- `TransformAndIndexListingChannelCommand`: Handles transformation and indexing of listing channels
- `UpdateListingVariantNameCommand`: Updates variant names across channels

#### Queries (Read Operations)
Queries are optimized for reading data without side effects:
- `SearchListingChannelQuery`: Performs full-text search across listing channels with pagination

#### Implementation Details
- **Command Handlers**: Implement business logic and validation
  - Example: `CreateListingChannelCommandHandler` validates and persists new channels
  - Uses repositories for data access
  - Publishes domain events when state changes

- **Query Handlers**: Optimized for read performance
  - Example: `SearchListingChannelQueryHandler` uses Elasticsearch for fast searches
  - Returns DTOs tailored for specific views

#### Benefits in This Project
- **Separation of Concerns**: Clear distinction between commands and queries
- **Optimized Read Models**: Elasticsearch powers fast, scalable searches
- **Domain Events**: Commands publish events for eventual consistency
- **Scalability**: Read and write paths can scale independently

### ⚡ Event-Driven Architecture

Events are used to communicate changes across the system:

- **Domain Events**: Represent something important that happened in the domain
- **Event Handlers**: React to events and trigger appropriate actions
- **Decoupled Components**: Services communicate asynchronously through events

### 🔄 Saga Pattern

For managing distributed transactions and maintaining data consistency:

- **Long-Running Transactions**: Break complex operations into a series of local transactions
- **Compensating Actions**: Handle failures by executing compensating transactions
- **Event Choreography**: Services collaborate through events without central coordination

## 🚀 Features

- Full-text search capabilities using Elasticsearch
- Real-time product indexing and updates
- Scalable architecture for high throughput
- Comprehensive API documentation with Swagger
- Health checks and monitoring endpoints

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Search**: Elasticsearch
- **CQRS**: @nestjs/cqrs
- **Containerization**: Docker

## 🚦 Getting Started

### Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables (copy `.env.example` to `.env`)
4. Start the development environment:
   ```bash
   $ pwd # You are here, at README
   $ cd ../dev-stack
   $ docker-compose up -d
   $ cd ../product-search-service-v2
   ```
5. Run the migration to create the database schema:
   ```bash
   $ pnpm migration:run
   ```
6. You might want to seed some data for start playing:
   ```bash
   $ pnpm cli seed-listings
   $ pnpm cli seed-batches
   ```
7. Run the application:
   ```bash
   $ pnpm start
   ```
8. To create a channel
```bash
curl -X POST "http://localhost:3000/listing-channels" -H "Content-Type: application/json" -d '{"name": "Gemini Chan", "salesChannel": "MARKETPLACE", "lmsCompanyId": "999908fe-4db7-46dc-bd8c-9251935130d8", "listingVariantIds": ["96c8060e-19cc-4c75-b436-6029495e9e1f", "64516b47-0195-4a44-afe4-10f22c61d85f", "1775e7ec-e211-4cdb-9f1c-5f44f21ed665", "16387c90-4c0a-4eb5-878f-79f39be668f1"]}'
```

9. To search a channel (by channel's name, variant name or batch_no)
```bash
curl -X GET "http://localhost:3000/listing-channels/search?q=coat&page=1&limit=10" -H "Content-Type: application/json"
```
10. You can also update variant name
```bash
curl -X PATCH "http://localhost:3000/listing-variants/ad2dfb48-bd07-46a3-ad0f-bd3121b34eb5/name" -H "Content-Type: application/json" -d '{ "name": "Casual Coat - S" }'
```

## 🧪 Testing

### Test Suite Note
*Note: Due to time constraints, I've implemented a focused integration test suite that covers the core functionality. The test suite demonstrates the testing approach and can be expanded to cover additional scenarios as needed, please find it at `create-listing-channel.integration` directory.*

Run the test suite with:
```bash
# Run integration tests
pnpm test
```

## 📦 Deployment

### Database Migrations
```bash
# Generate new migration
pnpm migration:generate "./src/migrations/<migration-name>"

# for example:
pnpm migration:generate "./src/migrations/add-listing-table"

# Run migrations
pnpm migration:run

# Revert last migration
pnpm migration:revert
```

## 📄 License

This project is licensed under the UNLICENSED License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- CQRS pattern for scalable architecture
- All contributors who have helped improve this project