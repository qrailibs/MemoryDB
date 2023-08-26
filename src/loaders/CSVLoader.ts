import csv from 'csv-parser'
import { ReadStream } from 'fs'

import ILoader from "./ILoader"

type CSVLoaderParams<TRecord> = {
	columnSeparator?: string
	rowSeparator?: string
	columns: (keyof TRecord)[]
}

/*
 * Loader for CSV data format.
 * Warning: when loaded all columns will be of "string" type
 */
export default class CSVLoader<TRecord extends object> implements ILoader<
	TRecord,
	ReadStream,
	string
> {
	private params: CSVLoaderParams<TRecord>

	constructor(_params: CSVLoaderParams<TRecord>) {
		this.params = _params
	}

	async load(stream: ReadStream) {
		return new Promise((resolve) => {
			const rows: unknown[] = []

			stream.pipe(csv({ separator: this.params.rowSeparator ?? '\n' }))
				.on('data', (row) => rows.push(row))
				.on('end', () => resolve(rows as TRecord[]));
		}) as Promise<TRecord[]>
	}

	async save(value: TRecord[]) {
		const columns = this.params.columns.map(column => `"${column.toString()}"`).join(this.params.columnSeparator ?? ',')
		const rows = value.map((row: TRecord) =>
			this.params.columns.map(column =>
				`"${row[column] ? row[column] : ''}"`
			).join(this.params.columnSeparator ?? ',')
		).join(this.params.rowSeparator ?? '\n')

		return columns + '\n' + rows
	}
}