import csv from "csv-parser";
import { ReadStream } from "fs";

import ILoader from "./ILoader";

type CSVLoaderParams<TRecord> = {
    /**
     * Separator for the columns
     * @default ','
     */
    columnSeparator?: string;
    /**
     * Separator for the rows
     * @default '\n'
     */
    rowSeparator?: string;

    /**
     * Columns of table, that will be used to save CSV
     */
    columns: (keyof TRecord)[];
};

/**
 * Loader for CSV data format.
 * Warning: when loaded all columns will be of "string" type
 */
export default class CSVLoader<TRecord extends object> implements ILoader<TRecord, ReadStream, string> {
    private params: CSVLoaderParams<TRecord>;

    constructor(params: CSVLoaderParams<TRecord>) {
        this.params = params;
    }

    async load(stream: ReadStream) {
        return new Promise((resolve) => {
            const rows: unknown[] = [];

            stream
                .pipe(csv({ separator: this.params.rowSeparator ?? "\n" }))
                .on("data", (row) => rows.push(row))
                .on("end", () => resolve(rows as TRecord[]));
        }) as Promise<TRecord[]>;
    }

    async save(value: TRecord[]) {
        const columns = this.params.columns
            .map((column) => `"${column.toString()}"`)
            .join(this.params.columnSeparator ?? ",");
        const rows = value
            .map((row: TRecord) =>
                this.params.columns
                    .map((column) => `"${row[column] ? row[column] : ""}"`)
                    .join(this.params.columnSeparator ?? ",")
            )
            .join(this.params.rowSeparator ?? "\n");

        return columns + "\n" + rows;
    }
}
