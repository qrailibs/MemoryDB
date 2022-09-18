import { describe, expect, test } from '@jest/globals'

import { MemoryDB, MemoryDBResult } from '../src'

describe('Testing database listing (list())', () => {
	test('Try to get values from list()', () => {
		// Create database with 2 values
		let db: MemoryDB<string> = new MemoryDB('test')
		db.insert('Hello')
		db.insert('World')

		// Test values
		let result: MemoryDBResult<string> = db.list()
		expect(result.success).toBe(true)
		expect(result.data).toEqual([ 'Hello', 'World' ])
	})
})