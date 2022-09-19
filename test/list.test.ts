import { describe, expect, test } from '@jest/globals'

import { MemoryDB, MemoryDBResult } from '../src'

// Mock data
let words: string[] = [
	'Hello', 'World'
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