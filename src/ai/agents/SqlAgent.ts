import alasql from "alasql"

import MemoryDB from "../../core/MemoryDB"
import { ColumnType } from "../ColumnMetadata"

const DATA_TYPE: Record<ColumnType, string> = {
	"number": "NUMBER",
	"string": "VARCHAR",
	"date": "DATE",
	"boolean": "BOOLEAN",
	"json": "JSON"
}

export default class SqlAgent {
    private tables: MemoryDB<unknown>[]

    constructor(tables: MemoryDB<unknown>[]) {
        this.tables = tables

		for(const table of this.tables) {
			const head = table.head()
			if(!head) continue

			// Create table
			alasql(
				`CREATE TABLE ${table.name} (${head.map(col => `${col.name} ${DATA_TYPE[col.type]}`).join(', ')})`
			)
		}
    }

	public async query(sql: string, prepare: any): Promise<any> {
		return new Promise((resolve) => {
			alasql(sql, prepare, (data) => resolve(data))
		})
	}	
}