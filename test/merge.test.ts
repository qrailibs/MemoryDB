import { describe, expect, test } from '@jest/globals'

import { MemoryDB, MemoryDBResult } from '../src'

// Mock data
type Toy = { name: string, price: number }
let toys_1: Toy[] = [
	{ name: 'Toy Bear', price: 1000 },
	{ name: 'Toy Dog', price: 2000 },
	{ name: 'Toy Cat', price: 3000 },
	{ name: 'Doll Monkey', price: 4000 },
	{ name: 'Doll Wolf', price: 5000 }
]
let toys_2: Toy[] = [
	{ name: 'Toy Bear', price: 1001 },
	{ name: 'Toy Dog', price: 2002 },
	{ name: 'Toy Cat', price: 3003 },
	{ name: 'Doll Monkey', price: 4004 },
	{ name: 'Doll Wolf', price: 5005 },
	{ name: 'Doll Tiger', price: 6006 }
]

describe('Testing merge() function', () => {
	test('Try to merge one database into another', () => {
		// Create database (1) with 5 toys
		let db_1: MemoryDB<Toy> = new MemoryDB('test')
		db_1.insert(toys_1)
		// Create database (2) with 5 toys
		let db_2: MemoryDB<Toy> = new MemoryDB('test')
		db_2.insert(toys_2)

		// Merge database (2) into database (1)
		let result: MemoryDBResult<Toy> = db_1.merge(db_2, () => true)
		
		// Test that operation was successfull
		expect(result.success).toBe(true)
		expect((result.data as Toy[]).length).toBe(6)
	})
	test('Try to merge one database into another with merge predicate', () => {
		// Create database (1) with 5 toys
		let db_1: MemoryDB<Toy> = new MemoryDB('test')
		db_1.insert(toys_1)
		// Create database (2) with 5 toys
		let db_2: MemoryDB<Toy> = new MemoryDB('test')
		db_2.insert(toys_2)

		// Merge database (2) into database (1)
		let result: MemoryDBResult<Toy> = db_1.merge(db_2,
			// Predicate to include what rows will be added
			(rows: Toy[], row: Toy) => 
				// Include only rows that not presented in db yet (by name)
				!rows.find(
					(currRow: Toy) => 
						currRow.name == row.name
				)
		)
		
		// Test that operation was successfull
		expect(result.success).toBe(true)
		expect((result.data as Toy[]).length).toBe(6)
	})
})