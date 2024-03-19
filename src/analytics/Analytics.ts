import MemoryDB from "../core/MemoryDB";
import MemoryDBResult from "../core/MemoryDBResult";
import MatchPredicate from "../predicate/MatchPredicate";
import SortPredicate from "../predicate/SortPredicate";
import ColumnQuery from "./ColumnQuery";

export default class Analytics<T> {
    private db: MemoryDB<T>;

    constructor(database: MemoryDB<T>) {
        this.db = database;
    }

    // Calculate percentage
    private percentage(partialValue: number, totalValue: number) {
        return (100 * partialValue) / totalValue;
    }

    // Get rows
    private rows(): T[] {
        // Get rows from database
        let result: MemoryDBResult<T> = this.db.list();

        // Check if operation failed
        if (result.success === false) {
            throw new Error("Failed to do analytics, database list() failed");
        }
        // Check if operation returned not array
        if (!Array.isArray(result.data)) {
            throw new Error("Failed to do analytics, database list() returned not array");
        }

        return result.data;
    }

    // Get rows sorted
    private sort(sorter: SortPredicate<T>): T[] {
        // Get rows from database
        let result: MemoryDBResult<T> = this.db.sort(sorter, false);

        // Check if operation failed
        if (result.success === false) {
            throw new Error("Failed to do analytics, database sort() failed");
        }
        // Check if operation returned not array
        if (!Array.isArray(result.data)) {
            throw new Error("Failed to do analytics, database sort() returned not array");
        }

        return result.data;
    }

    // Get values of column
    private values(column?: ColumnQuery): any[] {
        // Get database rows
        let data: T[] = this.rows();

        // From column
        if (column) {
            return data.map((row: T) => {
                return column.use(row as any);
            });
        }
        // As row
        else {
            return data;
        }
    }
    private value(row: T, column?: ColumnQuery) {
        return column ? column.use(row as any) : row;
    }
    // Get values of column as number
    private rowsNumbers(column?: ColumnQuery): number[] {
        // Get database rows
        let data: T[] = this.rows();

        // Get numbers from rows
        let numbers: number[] = data.map((row: T) => {
            if (typeof row === "number") {
                return row;
            } else if (column) {
                let val = column.use(row as any);
                return typeof val === "number" ? val : NaN;
            } else {
                return NaN;
            }
        });

        return numbers;
    }

    //#region Graphs
    // Get occurrences in column and amount of them
    public occurrences(column: ColumnQuery, percentage: boolean = false): Record<string, number> {
        let values: any[] = this.values(column);

        // 1. Count amount of occurrences of each value
        let _occurrences: Record<string, number> = {};
        for (let value of values) {
            if (value.toString() in _occurrences) {
                _occurrences[value]++;
            } else {
                _occurrences[value] = 1;
            }
        }

        // 2. Calculate percentage
        if (percentage === true) {
            let amountOfValues = this.db.length;

            for (let value in _occurrences) {
                let amount = _occurrences[value];

                _occurrences[value] = this.percentage(amount, amountOfValues);
            }
        }

        return _occurrences;
    }
    //#endregion

    //#region Mathematical
    public min(column?: ColumnQuery): number {
        // Known value without calculating
        if (this.db.length === 0) {
            return NaN;
        }

        // Get database rows as numbers
        let data: number[] = this.rowsNumbers(column);

        // Get min value
        return Math.min(...data);
    }
    public max(column?: ColumnQuery): number {
        // Known value without calculating
        if (this.db.length === 0) {
            return NaN;
        }

        // Get database rows as numbers
        let data: number[] = this.rowsNumbers(column);

        // Get min value
        return Math.max(...data);
    }

    // Get amount of rows that met predicate
    public count(predicate: MatchPredicate<any>, column?: ColumnQuery): number {
        // Known value without calculating
        if (this.db.length === 0) {
            return 0;
        }

        // Get values
        let data: T[] = this.values(column);

        // Accumulate count and return
        return data.reduce((accum: number, val: any) => accum + (predicate(val) ? 1 : 0), 0);
    }

    // Get length of rows with this column
    public len(column?: ColumnQuery): number {
        // Known value without calculating
        if (this.db.length === 0) {
            return 0;
        }

        // Get database rows as numbers
        let data: number[] = this.values(column);

        // Accumulate and return
        return data.reduce((accum: number, row: any) => accum + (row ? 1 : 0), 0);
    }

    // Get sum of number values (by column in database)
    public sum(column?: ColumnQuery): number {
        // Cannot calculate without rows
        if (this.db.length === 0) {
            return NaN;
        }

        // Get database rows
        let values: T[] = this.values(column);

        // Accumulate and return
        return values.reduce((accum: number, value: T) => accum + (typeof value === "number" ? value : 0), 0);
    }

    // Get median value of number values (by column in database)
    public median(column?: ColumnQuery): number {
        // Cannot calculate without rows
        if (this.db.length === 0) {
            return NaN;
        }

        // Sort rows
        let rows: T[] = this.sort((a: T, b: T) => {
            return this.value(a, column) ?? 0 - this.value(b, column) ?? 0;
        });

        // Get median index
        let halfIndex: number = Math.floor(this.db.length / 2);

        // Is fully median?
        if (this.db.length % 2) {
            return this.value(rows[halfIndex], column);
        } else {
            return (
                // ((Half - 1) + Half) / 2.0
                (this.value(rows[halfIndex - 1], column) + this.value(rows[halfIndex], column)) /
                2.0
            );
        }
    }

    // Get average value of number values (by column in database)
    public average(column?: ColumnQuery): number {
        let sum: number = this.sum(column);

        // Avg = Sum / Len
        return sum / this.db.length;
    }
    //#endregion

    //#region Finding
    // Find rows where values of column are missing (null or undefined)
    public missing(column: string): T[] {
        // Get database rows
        let rows: T[] = this.rows();

        // Find rows where value of column is null
        return rows.filter((row: T) => (row as any)[column] == null);
    }
    // Find rows where values of column are duplicates
    public duplicates(column?: ColumnQuery): T[] {
        // Get database rows
        let rows: T[] = this.rows();

        // Find values that are duplicate
        const duplicateValues: any[] = rows
            .map((row: T) => column?.use(row as any))
            .filter((val: any, index: number, arr: any[]) => arr.indexOf(val) !== index);

        // Find rows of values that duplicate
        const duplicates: T[] = rows.filter((row: T) => duplicateValues.includes(column?.use(row as any)));

        return duplicates;
    }
    //#endregion
}
