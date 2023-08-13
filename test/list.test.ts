import { describe, expect, test } from '@jest/globals'

import { MemoryDB, MemoryDBResult } from '../src'

// Mock data
const words: string[] = [
	'Hello', 'World'
]
const animals: string[] = [
	'Cat', 'Dog', 'Panda',
	'Lion', 'Bear', 'Bird',
]

describe('Testing database listing (list())', () => {
	test('Try to get values from list()', () => {
		// Create database with 2 values
		let db: MemoryDB<string> = new MemoryDB('test')
		db.insert(words)

		// Test values
		let result: MemoryDBResult<string> = db.list()
		expect(result.success).toBe(true)
		expect(result.data).toEqual(words)
	})
	test('Try to get values from raw', () => {
		// Create database with 2 values
		let db: MemoryDB<string> = new MemoryDB('test')
		db.insert(words)

		// Test values
		expect(db.raw).toEqual(words)
	})
})

describe('Testing database paginated listing (list())', () => {
	test('Try to get values from first page)', () => {
		// Create database with 6 values
		let db: MemoryDB<string> = new MemoryDB('test')
		db.insert(animals)

		// Test values (Page 1)
		let resultPageOne: MemoryDBResult<string> = db.listPaginated(1, 3)
		expect(resultPageOne.success).toBe(true)
		expect(resultPageOne.data).toEqual(animals.slice(0, 3))

		// Test values (Page 2)
		let resultPageTwo: MemoryDBResult<string> = db.listPaginated(2, 3)
		expect(resultPageTwo.success).toBe(true)
		expect(resultPageTwo.data).toEqual(animals.slice(3, 6))
	})
})