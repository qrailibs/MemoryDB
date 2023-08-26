import { describe, expect, test } from '@jest/globals'

import { MemoryDB, MemoryDBCollection } from '../src'

// Mock data
type Toy = { name: string, price: number }
let toys_1: Toy[] = [
	{ name: 'Toy Bear', price: 1000 },
	{ name: 'Toy Dog', price: 2000 },
	{ name: 'Toy Cat', price: 3000 },
	{ name: 'Doll Monkey', price: 4000 },
	{ name: 'Doll Wolf', price: 5000 }
]

describe('Testing SQL queries (MemoryDBCollection)', () => {
	test('Try to SELECT', async () => {
		// Create database with 5 toys
		let db: MemoryDB<Toy> = new MemoryDB('toys')
		db.describe({
			'name': {
				type: 'string',
				description: 'Names of toys',
				nullable: false
			},
			'price': {
				type: 'number',
				description: 'Prices of toys',
				nullable: false
			}
		})
		db.insert(toys_1)

		// Create database collection for queries
		let dbc: MemoryDBCollection = new MemoryDBCollection([
			db
		])
		await dbc.init()

		// Query toys
		const result = await dbc.query('SELECT * FROM toys')
		
		// Test values
		expect(result.length).toEqual(toys_1.length)
		expect(result).toEqual(toys_1)
	})
})