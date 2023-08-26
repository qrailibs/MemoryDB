# MemoryDB
In-memory database with Queries, Event-handling, Analytics written in TypeScript

# Installation
```bash
npm i memorydb
```

# Usage
You can use MemoryDB for creating in-memory database with any type of data.

### Storing primitives
```typescript
// Create database
let db: MemoryDB<string> = new MemoryDB('primitives')
db.insert('Hello')
db.insert('World')
console.log(db.raw) // [ 'Hello', 'World' ]
```

### Storing typed data
```typescript
type Toy = { name: string, price: number }
const toys: Toy[] = [
	{ name: 'Toy Bear', price: 1000 },
	{ name: 'Toy Dog', price: 2000 },
	{ name: 'Toy Cat', price: 3000 },
	{ name: 'Doll Monkey', price: 4000 },
	{ name: 'Doll Wolf', price: 5000 }
]

// Create database
let db: MemoryDB<Toy> = new MemoryDB('toys')
// Batch insert (insert array of toys)
db.insert(toys)
// Find Monkey toy
const monkeyToy = db.find((row) => row.name.includes('Monkey')).data
console.log(monkeyToy) // { name: 'Doll Monkey', price: 4000 }
```

### Finding data
```typescript
// Create database
let db: MemoryDB<Toy> = new MemoryDB('toys')
db.insert('monkey')
db.insert('cow')
db.insert('bear')
db.insert('dog')

// Find by predicate
console.log(db.find(row => row.startsWith('c')).data) // "cow"
```

# Dependencies
- `alasql` - used for querying MemoryDB using SQL queries
- `compress-json` – used for JSONCLoader (JSON Compressed)
- `csv-parser` - used for CSVLoader