# Electronic Part Data Aggregation Service

This GraphQL service aggregates electronic part data from multiple supplier APIs (TTI and Arrow) into a unified format. The service is built using NestJS.

## Details

  - GraphQL implementation
  - Separate supplier-specific services (TTI, Arrow)
  - Supplier-specific mappers for consistent data transformation
  - Parallel fetching
  - Lodash for safe property access
  - Calculate aggregate values (total stock, shortest lead time)
  - Format pricing & packaging info
  - Handle missing or incomplete data gracefully

### Data Flow
1. Client sends part number query
2. Service validates part number
3. Parallel requests to supplier services
4. Transform responses to unified format
5. Aggregate data from all sources
6. Return unified response

## Usage Example

```typescript
// GraphQL Query
query {
  aggregatedPart(partNumber: "0510210200") {
    name
    description
    totalStock
    manufacturerLeadTime
    // ... other fields
  }
}
```

## Project setup

```bash
# development
$ npm i
$ npm run start
```