import { describe, expect, test } from '@jest/globals'

import { MemoryDB } from '../src'

describe('Testing database insertion (insert())', () => {
	test('Try to insert single value', () => {
		// Create database
		let db: MemoryDB<string> = new MemoryDB('test')
		// Test insert
		expect(db.insert('Hello').success).toBe(true)
		// Test values
		expect(db.raw).toEqual(['Hello'])
	})
	test('Try to insert multiple values', () => {
		// Create database
		let db: MemoryDB<string> = new MemoryDB('test')
		// Test insert
		expect(db.insert(['Hello', 'World']).success).toBe(true)
		// Test values
		expect(db.raw).toEqual(['Hello', 'World'])
	})
})