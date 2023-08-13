import Exporter from "./Exporter";

const wrapValue = (val: string) => '"' + val + '"'

const CSVExporter: Exporter<any> = (db) => {
	if(db.raw.length < 1) {
		throw new Error('Failed to export as CSV: cannot generate headers because no data was found in database.')
	}

	let headers = ''
	let body = ''

	// Create headers
	for(let column in db.raw[0]) {
		headers += wrapValue(column) + ','
	}
	headers += '\n'

	// Create body
	const rowsAmount = db.raw.length
	let rowIndex = 0
	for(let row of db.raw) {
		for(let columnData of Object.values(row)) {
			body += wrapValue((columnData as any).toString()) + ','
		}

		if(rowIndex + 1 < rowsAmount) {
			body += '\n'
		}

		rowIndex++
	}

	return headers + body
}

export default CSVExporter