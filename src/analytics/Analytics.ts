import MemoryDB from "../core/MemoryDB";
import MemoryDBResult from "../core/MemoryDBResult";
import MatchPredicate from "../predicate/MatchPredicate";
import SortPredicate from "../predicate/SortPredicate";
import ColumnQuery from "./ColumnQuery";

/**
 * Class that provides API for doing math and analytics with database
 * @template T type of a rows
 */
export default class Analytics<T> {
    private db: MemoryDB<T>;

    constructor(database: MemoryDB<T>) {
        this.db = database;
    }

    //#region Private methods
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
    // Get a column in a row or whole row
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
    //#endregion

    //#region Graphs
    /**
     * Get occurrences in column and amount of them
     * @param column column to use for counting
     * @param percentage calculate a amount (if `false`) or percentage (if `true`) of values
     * @returns `{ [value]: amount or percentage }`
     */
    public occurrences(column: ColumnQuery, percentage: boolean = false): Record<string, number> {
        let values: any[] = this.values(column);

        // 1. Count amount of occurrences of each value
        const _occurrences: Record<string, number> = {};
        for (const value of values) {
            if (value.toString() in _occurrences) {
                _occurrences[value]++;
            } else {
                _occurrences[value] = 1;
            }
        }

        // 2. Calculate percentage
        if (percentage) {
            let amountOfValues = this.db.length;

            for (const value in _occurrences) {
                const amount = _occurrences[value];

                _occurrences[value] = this.percentage(amount, amountOfValues);
            }
        }

        return _occurrences;
    }
    //#endregion

    //#region Mathematical
    /**
     * Find a minimal number value in a column
     * @param column column to use
     * @returns `number | NaN` (`NaN` if rows < 1)
     */
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
    /**
     * Find a maximum number value in a column
     * @param column column to use
     * @returns `number | NaN` (`NaN` if rows < 1)
     */
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

    /**
     * Count a number of rows that matched condition
     * @param predicate predicate function that returns `true` to count or `false` to not count
     * @param column pass this column to predicate, if `false` whole row will be passed
     * @returns amount of rows that matched condition (predicate)
     */
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

    /**
     * Count a number of rows that has column (or just count rows)
     * @param column count rows that has this column, if not passed – total amount of rows will be counted
     * @returns amount of rows that has column (or total amount of rows)
     */
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

    /**
     * Count a sum of numbers (in a column, or a primitive rows)
     * @param column count numbers from that column, if not passed – rows will be counted
     * @returns total sum of numbers in a column (or a values of primitive rows)
     */
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

    /**
     * Count a median value of numbers (in a column, or a primitive rows)
     * @param column count numbers from that column, if not passed – rows will be counted
     * @returns median value of numbers in a column (or a values of primitive rows)
     */
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
                (this.value(rows[halfIndex - 1], column) + this.value(rows[halfIndex], column)) / 2.0
            );
        }
    }

    /**
     * Count a average value of numbers (in a column, or a primitive rows)
     * @param column count numbers from that column, if not passed – rows will be counted
     * @returns average value of numbers in a column (or a values of primitive rows)
     */
    public average(column?: ColumnQuery): number {
        let sum: number = this.sum(column);

        // Avg = Sum / Len
        return sum / this.db.length;
    }
    //#endregion

    //#region Finding
    /**
     * Find rows where values of column are missing (null or undefined)
     * @param column column to find a rows with value missing in it
     * @returns rows that have missing value in a column
     */
    public missing(column: ColumnQuery): T[] {
        // Get database rows
        const rows: T[] = this.rows();

        // Find rows where value of column is null
        return rows.filter((row: T) => column.use(row) == null);
    }

    /**
     * Find rows where values of column are duplicates
     * @param column column to find a rows with value is duplicate in it, if not passed – whole row will be used
     * @returns rows that have duplicate value in a column (or duplicate rows, if column not specified)
     */
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
