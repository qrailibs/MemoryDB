import { describe, expect, test } from '@jest/globals'

import { JSONCLoader, JSONLoader, MemoryDB } from '../src'

// Mock data
type Toy = { name: string, price: number }
let toys: Toy[] = [
	{ name: 'Toy Bear', price: 1000 },
	{ name: 'Toy Dog', price: 2000 },
	{ name: 'Toy Cat', price: 3000 },
	{ name: 'Doll Monkey', price: 4000 },
	{ name: 'Doll Wolf', price: 5000 }
]

// Loaders setup
const jsonLoader = new JSONLoader<Toy>()
const jsoncLoader = new JSONCLoader<Toy>()

describe('Testing database loaders (load() & save())', () => {
	test('Try to use JSON loader', async () => {
		// Create database
		let db: MemoryDB<Toy> = new MemoryDB('test')
		// Test insert
		expect(db.insert(toys).success).toBe(true)
		// Test values
		expect(db.raw).toEqual(toys)

		// Save to JSON
		const raw = await db.save(jsonLoader)
		// Test json
		expect(raw).toEqual(JSON.stringify(db.raw))

		// Erase DB
		expect(db.clear().success).toEqual(true)

		// Load JSON
		expect((await db.load(jsonLoader, raw)).success).toBe(true)
		// Test values to be same
		expect(db.raw).toEqual(toys)
	})
	test('Try to use JSONC loader', async () => {
		// Create database
		let db: MemoryDB<Toy> = new MemoryDB('test')
		// Test insert
		expect(db.insert(toys).success).toBe(true)
		// Test values
		expect(db.raw).toEqual(toys)

		// Save to JSONC
		const raw = await db.save(jsoncLoader)

		// Erase DB
		expect(db.clear().success).toEqual(true)

		// Load JSON
		expect((await db.load(jsoncLoader, raw)).success).toBe(true)
		// Test values to be same
		expect(db.raw).toEqual(toys)
	})
	//TODO: test for CSV loader
})