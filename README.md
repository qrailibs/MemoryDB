# MemoryDB

In-memory typesafe database with Queries, Events, Analytics.

# Installation

```bash
npm i @datasco/memorydb # pnpm add @datasco/memorydb
```

# Usage

You can use MemoryDB for creating in-memory database with any type of data.

### Creating instance of database

Primitive database:

```typescript
const db = new MemoryDB<string>("primitives_database")
```

Typed object-based database:

```typescript
const db = new MemoryDB<{
    name: string;
    price: number;
}>("complex_database")
```

### Insert row

```typescript
db.insert({ name: "Bear toy", price: 1000 })
```

### Insert multiple rows

```typescript
db.insert([
    { name: "Cat toy", price: 2000 },
    { name: "Dog toy", price: 3000 },
])
```

### Mapping rows

```typescript
db.map(
    row => ({ ...row, price: price + 100 })
)
```

### Remove rows

```typescript
db.remove(
    row => row.price > 1000
)
```

### Remove all rows

```typescript
db.clear()
```

### Remove duplicates with predicate

```typescript
// remove rows, where value of "price" is same
db.removeDuplicatesByPredicate(
    (duplicateRows) => [ duplicateRows[0] ],
    "price"
)
```

### Remove duplicates (primitive)

```typescript
db.removeDuplicates()
```

### Remove column

```typescript
db.removeColumn("price")
```

### Splitting into chunks

```typescript
// split database into chunks of size 5
db.chunks(5)
```

### Merge with another database

```typescript
db.merge(new MemoryDB("another_db"))
```

### Listing rows

```typescript
const { data } = db.list()
```

### Listing rows, but paginated

```typescript
// 1 page, 50 rows per page
const { data } = db.listPaginated(1, 50)
```

### Find row

```typescript
const { data } = db.find(
    row => row.name === "Bear toy"
)
```

### Search row

```typescript
const { data } = db.search(
    row => row.name.includes("toy")
)
```

### Chain multiple operations

```typescript
db.chain([
    _ => _.insert({ name: "Test", price: 7500 }),
    _ => _.map(row => {...row, price: price + 500 }),
    _ => _.map(row => {...row, name: name + " toy" })
])
```

### (Analytics) Use Analytics API
```typescript
const {analytics} = db
```

### (Analytics) Display contents of table
```typescript
analytics.head()
```