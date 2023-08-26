import alasql from "alasql"

import MemoryDB from "./MemoryDB"
import { ColumnType } from "../ai/ColumnMetadata"

const COLUMN_TYPES: Record<ColumnType, string> = {
	"number": "NUMBER",
	"string": "VARCHAR",
	"date": "DATE",
	"boolean": "BOOLEAN",
	"json": "JSON"
}

export default class MemoryDBCollection<T extends object = any> {
    private tables: MemoryDB<T>[]

    constructor(tables: MemoryDB<T>[]) {
        this.tables = tables
    }

    public debug: boolean = false
	private debugLog(action: string) {
		if(this.debug) {
			console.log(`[MemoryDBCollection] Executed "${action}"`)
		}
	}

	private initialized: boolean = false
	public async init() {
		return await Promise.all(this.tables.map(table => {
			// Create table
			return new Promise((resolve, reject) => {
				const head = table.head()
				if(!head) return reject(`Table "${table.name}" didn't contained metadata to be able create a sql table`)

				const createCommand = `CREATE TABLE ${table.name} (${head.map(col => `${String(col.name)} ${COLUMN_TYPES[col.type]}`).join(',')})`
				this.debugLog(createCommand)

				alasql(
					createCommand,
					[],
					() => {
						Promise.all(table.raw.map(row => {
							return new Promise(resolve => {
								const vals: string[] = '?'.repeat(head.length).split('')

								const insertCommand = `INSERT INTO ${table.name} VALUES (${vals.join(',')})`
								this.debugLog(insertCommand)

								alasql(
									insertCommand,
									Object.values(row),
									resolve
								)
							})
						})).then(resolve)
					}
				)
			})
		})).then(() => this.initialized = true)
	}

	public async query(sql: string, prepare: any = []): Promise<any> {
		if(!this.initialized) throw new Error('MemoryDBCollection should be initialized first (using .init())')

		return new Promise((resolve) => {
			alasql(sql, prepare, (data) => resolve(data))
		})
	}	
}