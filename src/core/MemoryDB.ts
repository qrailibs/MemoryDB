// Core
import MemoryDBResult from "./MemoryDBResult"
import MemoryDBEvent from "./MemoryDBEvent"
import ILoader from "../loaders/ILoader"

// Predicates
import SortPredicate from "../predicate/SortPredicate"
import MatchPredicate from "../predicate/MatchPredicate"
import ChoosePredicate from "../predicate/ChoosePredicate"

// Analytics
import Analytics from "../analytics/Analytics"

// AI
import AI from "../ai/AI"
import ColumnMetadata from "../ai/ColumnMetadata"

// Predicates
import ColumnQuery from "../analytics/ColumnQuery"
import MergePredicate from "../predicate/MergePredicate"
import UpdatePredicate from "../predicate/UpdatePredicate"

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

    //#region Metadata
    // Storing columns metadata
    private metadata: ColumnMetadata<T>[] = []
    // Describe head (columns metadata)
    public describe(columns: Record<keyof T,Omit<ColumnMetadata<T>, 'name'>>) {
        for(const columnName in columns) {
            this.metadata.push({
                name: columnName,
                ...columns[columnName]
            })
        }
    }
    // Get head (columns metadata)
    public head(): ColumnMetadata<T>[] | null {
        return this.metadata.length > 0
            ? this.metadata
            : null
    }
    public headColumn(columnName: keyof T): ColumnMetadata<T> | null {
        return this.metadata.length > 0
            ? this.metadata.find((column) => column.name === columnName) ?? null
            : null
    }
    //#endregion

    // Length of database (number of rows)
    public get length(): number {
        return this.data.length
    }

    // Analytics
    public get Analytics(): Analytics<T> {
        return new Analytics(this)
    }

    // AI
    public get AI(): AI<T> {
        return new AI(this)
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
    // Get list of values (paginated) from database
    public listPaginated(page: number, perPage: number = 50): MemoryDBResult<T> {
        let data: T[] = this.data.slice((page - 1) * perPage, page * perPage)

        // Log, Emit event
        this.debugLog('listPaginated')
        this.emit(MemoryDBEvent.ListPaginated, { data })

        // Success
        return new MemoryDBResult(true, data)
    }
    // Find value in database
    public find(predicate: MatchPredicate<T>): MemoryDBResult<T> {
        let data: T[] = this.data
        
        // Find
        let result: T | null = data.find(predicate) ?? null

        // Log, Emit event
        this.debugLog('find')
        this.emit(MemoryDBEvent.Find, { data: result })

        // Success
        return new MemoryDBResult(true, result)
    }
    // Search for values in database
    public search(predicate: MatchPredicate<T>): MemoryDBResult<T> {
        let data: T[] = this.data
        
        // Find
        let result: T[] = data.filter(predicate)

        // Log, Emit event
        this.debugLog('search')
        this.emit(MemoryDBEvent.Search, { data: result })

        // Success
        return new MemoryDBResult(true, result)
    }
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

    // Update rows
    public update(predicate: UpdatePredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Remove unecessary data
        let data: T[] = this.data.map((row: T) => predicate(row))

        // Save
        if(save) {
            this.data = data
            
            // Log, Emit event
            this.debugLog('update')
            this.emit(MemoryDBEvent.Update, { data })
        }

        // Success
        return new MemoryDBResult(true, data)
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

    // Remove column
    public removeColumn(column: keyof T, save: boolean = true): MemoryDBResult<T> {
        // Remove column from rows
        let data: T[] = this.data.map((row: T) => {
            delete row[column]
            return row
        })

        // Save
        if(save) {
            // Remove column from rows
            this.data = data

            // Remove column from metadata
            this.metadata = this.metadata.filter(columnMetadata => columnMetadata.name !== column)
            
            // Log, Emit event
            this.debugLog('removeColumn')
            this.emit(MemoryDBEvent.RemoveColumn, { data })
        }

        // Success
        return new MemoryDBResult(true, data)
    }

    // Remove all rows
    public clear(save: boolean = true): MemoryDBResult<T> {
        // Save
        if(save) {
            this.data = []
            
            // Log, Emit event
            this.debugLog('clear')
            this.emit(MemoryDBEvent.Remove, { data: [] })
        }

        // Success
        return new MemoryDBResult(true, [])
    }

    // Remove duplicates
    public removeDuplicates(save: boolean = true): MemoryDBResult<T> {
        // Make values unique
        let data: T[] = [ ...new Set(this.data) ]

        // Save
        if(save) {
            this.data = data
            
            // Log, Emit event
            this.debugLog('removeDuplicates')
            this.emit(MemoryDBEvent.RemoveDuplicates, { data })
        }

        // Success
        return new MemoryDBResult(true, data)
    }

    // Remove duplicates by predicate (choosing one of duplicates)
    public removeDuplicatesByPredicate(predicate: ChoosePredicate<T>, column: ColumnQuery, save: boolean = true): MemoryDBResult<T> {
        // Get duplicates
        let duplicates: T[] = this.Analytics.duplicates(column)

        // Choose duplicate to keep (with predicate)
        let predicateResult: T | T[] = predicate(duplicates)
        let keepDuplicates: T[] = Array.isArray(predicateResult) ? predicateResult : [ predicateResult ]

        // Remove duplicates
        let data: T[] = column
            ? this.data.filter((row: T) => duplicates.includes(row) ? keepDuplicates.includes(row) : true)
            : [ ...new Set(this.data) ]

        // Save
        if(save) {
            this.data = data
            
            // Log, Emit event
            this.debugLog('removeDuplicates')
            this.emit(MemoryDBEvent.RemoveDuplicates, { data })
        }

        // Success
        return new MemoryDBResult(true, data)
    }

    // Merge another database into current
    public merge(db: MemoryDB<T>, predicate: MergePredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Try to get data from another database
        let result: MemoryDBResult<T> = db.list()
        if(!result.success) { return new MemoryDBResult(false) }

        // What data should be merged?
        let mergingData: T[] = (result.data as T[]).filter((row: T) => predicate(this.raw, row))

        // Merge data
        let data: T[] = this.data.concat(mergingData)

        // Save
        if(save) {
            this.data = data

            // Log, Emit event
            this.debugLog('merge')
            this.emit(MemoryDBEvent.Merge, { data })
        }

        // Success
        return new MemoryDBResult(true, data)
    }
    //#endregion

    //#region Load/Save
    //TODO: do not use ILoader<object>, use T instead and do smth if T isnt a object
    public async load(loader: ILoader<object>, data: unknown): Promise<MemoryDBResult<T>> {
        return this.insert(
            await loader.load(data as any) as T[]
        )
    }
    public async save(loader: ILoader<object>): Promise<string | null> {
        return await loader.save(this.raw as object[])
    }
    //#endregion
}