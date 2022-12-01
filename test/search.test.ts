import { describe, expect, test } from '@jest/globals'

import { MemoryDB, MemoryDBResult } from '../src'

// Mock data
let words: string[] = [
	'Hello', 'World'
]

describe('Testing database finding (find())', () => {
	test('Try to get values from find()', () => {
		// Create database with 2 values
		let db: MemoryDB<string> = new MemoryDB('test')
		db.insert(words)

		// Find value starts with 'Wo'
		let result: MemoryDBResult<string> = db.search((row: string) => row.includes('l'))
		expect(result.success).toBe(true)
		expect(result.data).toEqual(words)
	})
})