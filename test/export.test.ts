import { describe, expect, test } from '@jest/globals'

import { CSVExporter, MemoryDB } from '../src'

// Mock data
type Toy = { name: string, price: number }
let toys: Toy[] = [
	{ name: 'Toy Bear', price: 1000 },
	{ name: 'Toy Dog', price: 2000 },
	{ name: 'Toy Cat', price: 3000 },
	{ name: 'Doll Monkey', price: 4000 },
	{ name: 'Doll Wolf', price: 5000 }
]

describe('Testing database exporting', () => {
	test('Try to export as CSV', () => {
		// Create database
		let db: MemoryDB<Toy> = new MemoryDB('test')
		db.insert(toys)

		// Export
		const csv = CSVExporter(db)

		// Check amount of rows (rows + header(1))
		expect(csv.split('\n').length).toBe(toys.length + 1)
	})
})