// Result
import MemoryDBResult from "./MemoryDBResult"

// Predicates
import SortPredicate from "../predicate/SortPredicate"
import MatchPredicate from "../predicate/MatchPredicate"
import ChoosePredicate from "../predicate/ChoosePredicate"

// Analytics
import Analytics from "../analytics/Analytics"
import MemoryDBEvent from "./MemoryDBEvent"

export default class MemoryDB<T> {
    // Unique name of the database
    public name: string

    // Debugging manipulations with database
    public debug: boolean = false
    private debugLog(action: string) {
        if(this.debug) {
            console.log(`[MemoryDB] Executed "${action}"`)
        }
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

    //#region Events
    private eventListeners: { [event: string]: Function[] } = {}
    public when(event: MemoryDBEvent, listener: (e: any) => void) {
        // No key for event? Create and make array
        if(!this.eventListeners[event]) {
            this.eventListeners[event] = []
        }

        // Add to array of event listeners
        this.eventListeners[event].push(listener)
    }
    private emit(event: MemoryDBEvent, e: any = null) {
        // Event listeners for this event is defined?
        if(this.eventListeners[event]) {
            for(let listener of this.eventListeners[event]) {
                listener(e)
            }
        }
    }

    //#endregion

    // Insert value to database
    public insert(value: T | T[]): MemoryDBResult<T> {
        // Batch insert
        if(Array.isArray(value)) {
            this.data = this.data.concat(value)

            // Log, Emit event
            this.debugLog('insert')
            this.emit(MemoryDBEvent.Insert, { value })

            // Success
            return new MemoryDBResult(true)
        }
        // Single insert
        else {
            this.data.push(value)

            // Log, Emit event
            this.debugLog('insert')
            this.emit(MemoryDBEvent.Insert, { value })

            // Success
            return new MemoryDBResult(true)
        }
    }

    //#region Finding
    // Get list of values from database
    public list(): MemoryDBResult<T> {
        let data: T[] = this.data

        // Log, Emit event
        this.debugLog('list')
        this.emit(MemoryDBEvent.List, { data })

        // Success
        return new MemoryDBResult(true, data)
    }
    //TODO: find, search
    //#endregion

    //#region Manipulations
    // Sort rows by predicate
    public sort(predicate: SortPredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Sort with predicate
        let data: T[] = this.data.sort(predicate)

        // Save
        if(save) {
            this.data = data

            // Log, Emit event
            this.debugLog('sort')
            this.emit(MemoryDBEvent.Sort, { data })
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
            
            // Log, Emit event
            this.debugLog('remove')
            this.emit(MemoryDBEvent.Remove, { data })
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