// Result
import MemoryDBResult from "./MemoryDBResult"

// Predicates
import SortPredicate from "../predicate/SortPredicate"
import MatchPredicate from "../predicate/MatchPredicate"
import ChoosePredicate from "../predicate/ChoosePredicate"

// Analytics
import Analytics from "../analytics/Analytics"

export default class MemoryDB<T> {
    // Unique name of the database
    public name: string

    // Debugging manipulations with database
    public debug: boolean = false
    private debugLog(action: string) {
        console.log(`[MemoryDB] Executed "${action}"`)
    }

    // Storing all data as raw array
    private data: T[] = []
    public get raw() {
        return this.data
    }

    // Length of database (number of rows)
    public get length(): number {
        return this.data.length
    }

    // Analytics
    public get Analytics(): Analytics<T> {
        return new Analytics(this)
    }

    constructor(name: string) {
        this.name = name
    }

    // Insert value to database
    public insert(value: T | T[]): MemoryDBResult<T> {
        // Batch insert
        if(Array.isArray(value)) {
            this.data = this.data.concat(value)

            // Success
            this.debugLog('insert')
            return new MemoryDBResult(true)
        }
        // Single insert
        else {
            this.data.push(value)

            // Success
            this.debugLog('insert')
            return new MemoryDBResult(true)
        }
    }

    // Get list of values from database
    public list(): MemoryDBResult<T> {
        let data: T[] = this.data

        // Success
        this.debugLog('list')
        return new MemoryDBResult(true, data)
    }

    //#region Manipulations
    // Sort rows by predicate
    public sort(predicate: SortPredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Sort with predicate
        let data: T[] = this.data.sort(predicate)

        // Save
        if(save) {
            this.data = data
            this.debugLog('sort')
        }

        // Success
        return new MemoryDBResult(true)
    }

    // Remove rows by predicate
    public remove(predicate: MatchPredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Remove unecessary data
        let data: T[] = this.data.filter((row: T) => !predicate(row))

        // Save
        if(save) {
            this.data = data
            this.debugLog('remove')
        }

        // Success
        return new MemoryDBResult(true, data)
    }

    // Remove duplicates by predicate (choosing one of duplicates)
    public removeDuplicates(predicate: ChoosePredicate<T>, save: boolean = true): MemoryDBResult<T> {

        // Success
        return new MemoryDBResult(true)
    }
    //#endregion
}