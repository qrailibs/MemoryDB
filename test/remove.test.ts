import { describe, expect, test } from '@jest/globals'

import { ColumnQuery, MemoryDB, MemoryDBResult } from '../src'

// Mock data
let numbers: number[] = [
	100, 200, 300, 400, 500, 600
]

type Book = { name: string, text: string, id: number }
let books: Book[] = [
	{ name: 'Harry poter', text: 'Some book about poter (1)', id: 1 },
	{ name: 'Harry poter', text: 'Some book about poter (2)', id: 2 },
	{ name: 'Harry poter', text: 'Some book about poter (3)', id: 3 },
	{ name: 'Harry poter: magic gem', text: 'Some book about magic gem', id: 4 },
]

describe('Testing database duplicates removing (remove())', () => {
	test('Try to remove (primitives)', () => {
		// Create database
		let db: MemoryDB<number> = new MemoryDB('test')
		db.insert(numbers)

		// Remove numbers that % 3 === 0
		let result: MemoryDBResult<number> = db.remove((row) => row % 3 === 0)

		// Test
		expect(result.success).toEqual(true)
		expect(result.data).toEqual(numbers.filter((number) => number % 3 !== 0))
	})
	test('Try to remove (objects)', () => {
		// Create database
		let db: MemoryDB<Book> = new MemoryDB('test')
		db.insert(books)

		// Remove books that id % 2 === 0
		let result: MemoryDBResult<Book> = db.remove((row) => row.id % 2 === 0)

		// Test
		expect(result.success).toEqual(true)
		expect(result.data).toEqual(books.filter((book) => book.id % 2 !== 0))
	})
	test('Try to clear', () => {
		// Create database
		let db: MemoryDB<number> = new MemoryDB('test')
		db.insert(numbers)

		// Remove books that id % 2 === 0
		let result: MemoryDBResult<number> = db.clear()

		// Test
		expect(result.success).toEqual(true)
		expect(result.data).toEqual([])
	})
})