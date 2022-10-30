import { describe, expect, test } from '@jest/globals'

import { ColumnQuery, MemoryDB, MemoryDBResult } from '../src'

// Mock data
let numbers: number[] = [
	100, 100, 100
]

type Book = { name: string, text: string }
let books: Book[] = [
	{ name: 'Harry poter', text: 'Some book about poter (1)' },
	{ name: 'Harry poter', text: 'Some book about poter (2)' },
	{ name: 'Harry poter', text: 'Some book about poter (3)' },
	{ name: 'Harry poter: magic gem', text: 'Some book about magic gem' },
]

describe('Testing database duplicates removing (removeDuplicates())', () => {
	test('Try to remove duplicates (simple)', () => {
		// Create database
		let db: MemoryDB<number> = new MemoryDB('test')
		db.insert(numbers)

		// Remove duplicates
		let result: MemoryDBResult<number> = db.removeDuplicates()

		// Test
		expect(result.success).toEqual(true)
		expect(result.data).toEqual([ 100 ])
	})
	test('Try to remove duplicates by predicate (-> keep first) (objects)', () => {
		// Create database
		let db: MemoryDB<Book> = new MemoryDB('test')
		db.insert(books)

		// Remove duplicates
		let result: MemoryDBResult<Book> = db.removeDuplicatesByPredicate((rows: Book[]) => [ rows[0] ], new ColumnQuery('name'))

		// Test
		expect(result.success).toEqual(true)
		expect(result.data).toEqual([ books[0], books[3] ]) // 1,2 - duplicate
	})
})