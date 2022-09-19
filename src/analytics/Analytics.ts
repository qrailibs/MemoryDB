import MemoryDB from "../core/MemoryDB"
import MemoryDBResult from "../core/MemoryDBResult"
import SortPredicate from "../predicate/SortPredicate"
import ColumnQuery from "./ColumnQuery"

export default class Analytics<T> {
    private db: MemoryDB<T>

    constructor(database: MemoryDB<T>) {
        this.db = database
    }
    
    // Get rows
    private rows(): T[] {
        // Get rows from database
        let result: MemoryDBResult<T> = this.db.list()

        // Check if operation failed
        if(result.success === false) {
            throw new Error('Failed to do analytics, database list() failed')
        }
        // Check if operation returned not array
        if(!Array.isArray(result.data)) {
            throw new Error('Failed to do analytics, database list() returned not array')
        }

        return result.data
    }

    // Get rows sorted
    private sort(sorter: SortPredicate<T>): T[] {
        // Get rows from database
        let result: MemoryDBResult<T> = this.db.sort(sorter, false)

        // Check if operation failed
        if(result.success === false) {
            throw new Error('Failed to do analytics, database sort() failed')
        }
        // Check if operation returned not array
        if(!Array.isArray(result.data)) {
            throw new Error('Failed to do analytics, database sort() returned not array')
        }

        return result.data
    }

    // Get rows numbers
    private rowsNumbers(column?: ColumnQuery): number[] {
        // Get database rows
        let data: T[] = this.rows()

        // Get numbers from rows
        let numbers: number[] = data.map((row: T) => {
            if(typeof row === 'number') {
                return row
            }
            else if(column) {
                let val = column.use(row as any)
                return typeof val === 'number' ? val : NaN
            }
            else {
                return NaN
            }
        })

        return numbers
    }

    //#region Mathematical
    public min(column?: ColumnQuery): number {
        // Known value without calculating
        if(this.db.length === 0) {
            return NaN
        }

        // Get database rows as numbers
        let data: number[] = this.rowsNumbers(column)

        // Get min value
        return Math.min(...data)
    }
    public max(column?: ColumnQuery): number {
        // Known value without calculating
        if(this.db.length === 0) {
            return NaN
        }

        // Get database rows as numbers
        let data: number[] = this.rowsNumbers(column)

        // Get min value
        return Math.max(...data)
    }

    // Get length of rows with this column
    public len(column?: ColumnQuery): number {
        // Known value without calculating
        if(this.db.length === 0) {
            return 0
        }

        // Get database rows as numbers
        let data: number[] = this.rowsNumbers(column)

        // Accumulate and return
        return data.reduce((accum: number, row: number) => 
            accum + (row != NaN ? 1 : 0), 0
        )
    }

    // Get sum of number values (by column in database)
    public sum(column: string): number {
        // Cannot calculate without rows
        if(this.db.length === 0) {
            return NaN
        }

        // Get database rows
        let rows: T[] = this.rows()

        // Accumulate and return
        return rows.reduce((accum: number, row: T) =>
            accum + (row as any)[column] ?? 0, 0
        )
    }

    // Get median value of number values (by column in database)
    public median(column: string): number {
        // Cannot calculate without rows
        if(this.db.length === 0) {
            return NaN
        }

        // Sort rows
        let rows: T[] = this.sort((a: T, b: T) => {
            return (a as any)[column] ?? 0 - (b as any)[column] ?? 0
        })

        // Get median index
        let halfIndex: number = Math.floor(this.db.length / 2)

        // Is fully median?
        if (this.db.length % 2) {
            return (rows[halfIndex] as any)[column]
        }
        else {
            return (
                // ((Half - 1) + Half) / 2.0
                (rows[halfIndex - 1] as any)[column]
                + (rows[halfIndex] as any)[column]
            ) / 2.0
        }
    }

    // Get average value of number values (by column in database)
    public average(column: string): number {
        let sum: number = this.sum(column)

        // Avg = Sum / Len
        return sum / this.db.length
    }
    //#endregion

    //#region Finding
    // Find rows where values of column are missing (null or undefined)
    public missing(column: string): T[] {
        // Get database rows
        let rows: T[] = this.rows()

        // Find rows where value of column is null
        return rows.filter((row: T) => (row as any)[column] == null)
    }
    // Find rows where values of column are duplicates
    public duplicates(column?: ColumnQuery): T[] {
        // Get database rows
        let rows: T[] = this.rows()

        // Find values that are duplicate
        const duplicateValues: any[] = rows
            .map((row: T) => column?.use(row as any))
            .filter((val: any, index: number, arr: any[]) => arr.indexOf(val) !== index)

        // Find rows of values that duplicate
        const duplicates: T[] = rows
            .filter((row: T) => duplicateValues.includes(column?.use(row as any)))

        return duplicates
    }
    //#endregion
}