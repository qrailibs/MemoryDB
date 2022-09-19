import { describe, expect, test } from '@jest/globals'

import { Analytics, ColumnQuery, MemoryDB } from '../src'

// Mock data
type Toy = { name: string, price: number }
let numbers: number[] = [
	1, 2, 3, 4, 5
]
let toys: Toy[] = [
	{ name: 'Toy Bear', price: 1000 },
	{ name: 'Toy Dog', price: 2000 },
	{ name: 'Toy Cat', price: 3000 },
	{ name: 'Toy Monkey', price: 4000 },
	{ name: 'Toy Wolf', price: 5000 }
]

describe('Testing analytics min() function', () => {
	test('Try to calculate minimum value from numbers', () => {
		// Create database with 5 number values
		let db: MemoryDB<number> = new MemoryDB('test')
		db.insert(numbers)

		// Prepare analytics
		let analytics: Analytics<number> = db.Analytics
		
		// Get min
		expect(analytics.min()).toEqual(1)
	})
	test('Try to calculate minimum value from rows', () => {
		// Create database with 5 toys
		let db: MemoryDB<Toy> = new MemoryDB('test')
		db.insert(toys)

		// Prepare analytics
		let analytics: Analytics<Toy> = db.Analytics
		
		// Get min
		expect(analytics.min(new ColumnQuery('price'))).toEqual(1000)
	})
})

describe('Testing analytics max() function', () => {
	test('Try to calculate minimum value from numbers', () => {
		// Create database with 5 number values
		let db: MemoryDB<number> = new MemoryDB('test')
		db.insert(numbers)

		// Prepare analytics
		let analytics: Analytics<number> = db.Analytics
		
		// Get max
		expect(analytics.max()).toEqual(5)
	})
	test('Try to calculate minimum value from rows', () => {
		// Create database with 5 toys
		let db: MemoryDB<Toy> = new MemoryDB('test')
		db.insert(toys)

		// Prepare analytics
		let analytics: Analytics<Toy> = db.Analytics
		
		// Get min
		expect(analytics.max(new ColumnQuery('price'))).toEqual(5000)
	})
})