// Core
import MemoryDBResult from "./MemoryDBResult";
import MemoryDBEvent from "./MemoryDBEvent";
import MemoryDBEventListener from "./MemoryDBEventListener";
import ColumnQuery from "../analytics/ColumnQuery";
import ILoader from "../loaders/ILoader";

// Predicates
import SortPredicate from "../predicate/SortPredicate";
import MatchPredicate from "../predicate/MatchPredicate";
import ChoosePredicate from "../predicate/ChoosePredicate";
import UpdatePredicate from "../predicate/UpdatePredicate";
import MergePredicate from "../predicate/MergePredicate";

// Analytics
import Analytics from "../analytics/Analytics";

// Helpers
import prettifyTable from "../helpers/prettifyTable";
import ChainOperation from "../predicate/ChainOperation";

/**
 * Class used to instantiate database.
 * @template T type of the rows
 */
export default class MemoryDB<T> {
    /**
     * Unique name of the database
     */
    public name: string;

    /**
     * Do debug manipulations with database
     */
    public debug: boolean = false;
    private debugLog(action: string) {
        if (this.debug) {
            console.log(`[MemoryDB] Executed "${action}"`);
        }
    }
    private debugError(action: string, error: string) {
        if (this.debug) {
            console.log(`[MemoryDB] Executed "${action}", but failed: ${error}`);
        }
    }

    // Storing all data as raw array
    private data: T[] = [];

    /**
     * All rows of database
     */
    public get raw() {
        return this.data;
    }

    /**
     * Amount of rows in database
     */
    public get length(): number {
        return this.data.length;
    }

    /**
     * Display columns and first rows of the table
     * @param amountOfRows how many first rows will be displayed (default is 10)
     */
    public head(amountOfRows: number = 10): string {
        return prettifyTable<T>(this.data.slice(0, amountOfRows));
    }

    /**
     * Chain multiple database operations into one
     * @param operations operations that will be chained and executed
     */
    public chain(operations: ChainOperation<T>[], save: boolean = true): MemoryDBResult<T> {
        let currentDB: MemoryDB<T> = this;

        // Chain operations
        for (const operation of operations) {
            const { success, data } = operation(currentDB);

            // Failed
            if (!success || !data || !Array.isArray(data)) {
                if (!data) {
                    this.debugError(
                        "chain",
                        `result of operation in chain was not of type T[], but falsetive instead (${data})`
                    );
                } else if (!Array.isArray(data)) {
                    this.debugError(
                        "chain",
                        `result of operation in chain was not of type T[], but T instead (${data})`
                    );
                }

                return new MemoryDBResult(false);
            }
            // Success
            else {
                // Create new instance of database with changed data
                currentDB = new MemoryDB<T>(this.name, data);
            }
        }

        // Save
        if (save) {
            this.data = currentDB.raw;

            // Log, Emit event
            this.debugLog("chain");
            this.emit(MemoryDBEvent.Chain, { data: currentDB.raw });
        }

        return new MemoryDBResult(true, currentDB.raw);
    }

    /**
     * Analytics for this database
     */
    public get Analytics(): Analytics<T> {
        return new Analytics(this);
    }

    /**
     * Instantiate an database
     * @param name unique name of database
     * @param data data to be stored in database
     * @constructor
     */
    constructor(name: string, data: T[] = []) {
        this.name = name;
        this.data = data;
    }

    //#region Events
    private eventListeners: Partial<Record<MemoryDBEvent, MemoryDBEventListener<any>[]>> = {};

    /**
     * Add event listener for particular event
     * @param event event to subscribe
     * @param listener callback to listen on event
     */
    public when(event: MemoryDBEvent, listener: MemoryDBEventListener<any>) {
        // No key for an event? -> Create it
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }

        // Add to array of event listeners
        this.eventListeners[event]?.push(listener);
    }
    private emit(event: MemoryDBEvent, e: any = null) {
        // Event listeners for this event is defined?
        if (event in this.eventListeners) {
            for (let listener of Object.values(this.eventListeners[event] ?? [])) {
                listener(e);
            }
        }
    }
    //#endregion

    /**
     * Insert row or rows
     * @param value row or array of rows to insert into database
     * @param save save changes of this action in database
     */
    public insert(value: T | T[], save: boolean = true): MemoryDBResult<T> {
        // Insert new row(s)
        const data: T[] = this.data.concat(Array.isArray(value) ? value : [value]);

        // Save
        if (save) {
            this.data = data;

            // Log, Emit event
            this.debugLog("insert");
            this.emit(MemoryDBEvent.Insert, { data });
        }

        // Success
        return new MemoryDBResult(true, data);
    }

    //#region Listing & Finding
    /**
     * Get list of values, same as `.raw`, but `MemoryDBEvent.List` will be emitted
     */
    public list(): MemoryDBResult<T> {
        const data: T[] = this.data;

        // Log, Emit event
        this.debugLog("list");
        this.emit(MemoryDBEvent.List, { data });

        // Success
        return new MemoryDBResult(true, data);
    }

    /**
     * Get list of values paginated
     * @param page page to get
     * @param perPage how many rows will be listed per page
     */
    public listPaginated(page: number, perPage: number = 50): MemoryDBResult<T> {
        const data: T[] = this.data.slice((page - 1) * perPage, page * perPage);

        // Log, Emit event
        this.debugLog("listPaginated");
        this.emit(MemoryDBEvent.ListPaginated, { data });

        // Success
        return new MemoryDBResult(true, data);
    }

    /**
     * Find row, works like `[].find`
     * @param predicate predicate function that will be used to find row
     */
    public find(predicate: MatchPredicate<T>): MemoryDBResult<T> {
        const data: T[] = this.data;

        // Find
        const result = data.find(predicate);

        // Log, Emit event
        this.debugLog("find");
        this.emit(MemoryDBEvent.Find, { data: result });

        // Success
        return new MemoryDBResult(true, result);
    }
    /**
     * Find multiple rows, works like `[].filter`
     * @param predicate predicate function that will be used to find row
     */
    public search(predicate: MatchPredicate<T>): MemoryDBResult<T> {
        const data: T[] = this.data;

        // Find
        const result: T[] = data.filter(predicate);

        // Log, Emit event
        this.debugLog("search");
        this.emit(MemoryDBEvent.Search, { data: result });

        // Success
        return new MemoryDBResult(true, result);
    }
    //#endregion

    //#region Manipulations
    /**
     * Sort rows, by predicate
     * @param predicate predicate function to sort, similar to [].sort(predicate)
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public sort(predicate: SortPredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Sort with predicate
        let data: T[] = this.data.sort(predicate);

        // Save
        if (save) {
            this.data = data;

            // Log, Emit event
            this.debugLog("sort");
            this.emit(MemoryDBEvent.Sort, { data });
        }

        // Success
        return new MemoryDBResult(true);
    }

    /**
     * Update rows, by predicate
     * @param predicate predicate function to update rows, similar to [].map(predicate)
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public map(predicate: UpdatePredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Remove unecessary data
        const data: T[] = this.data.map((row: T) => predicate(row));

        // Save
        if (save) {
            this.data = data;

            // Log, Emit event
            this.debugLog("update");
            this.emit(MemoryDBEvent.Update, { data });
        }

        // Success
        return new MemoryDBResult(true, data);
    }

    /**
     * Remove rows, by predicate
     * @param predicate predicate function, returns `true` if row should be removed
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public remove(predicate: MatchPredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Remove unecessary data
        let data: T[] = this.data.filter((row: T) => !predicate(row));

        // Save
        if (save) {
            this.data = data;

            // Log, Emit event
            this.debugLog("remove");
            this.emit(MemoryDBEvent.Remove, { data });
        }

        // Success
        return new MemoryDBResult(true, data);
    }

    /**
     * Remove column. Works only of rows is object-based
     * @param column column that should be removed
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public removeColumn(column: keyof T, save: boolean = true): MemoryDBResult<T> {
        // Remove column from rows
        let data: T[] = this.data.map((row: T) => {
            delete row[column];
            return row;
        });

        // Save
        if (save) {
            // Remove column from rows
            this.data = data;

            // Log, Emit event
            this.debugLog("removeColumn");
            this.emit(MemoryDBEvent.RemoveColumn, { data });
        }

        // Success
        return new MemoryDBResult(true, data);
    }

    /**
     * Split current database into smaller chunks (databases also)
     * @param chunkSize size of smaller chunks (amount of rows in them)
     * @returns chunks, as databases
     */
    public chunks(chunkSize: number): MemoryDB<T>[] {
        const chunks: MemoryDB<T>[] = [];

        // Split data into chunks
        for (let i = 0; i < this.data.length; i += chunkSize) {
            const chunk = this.data.slice(i, i + chunkSize);

            // Create database for chunk
            chunks.push(new MemoryDB<T>(`${this.name}_${chunks.length}`, chunk));
        }

        return chunks;
    }

    /**
     * Wipe out all rows
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public clear(save: boolean = true): MemoryDBResult<T> {
        // Save
        if (save) {
            this.data = [];

            // Log, Emit event
            this.debugLog("clear");
            this.emit(MemoryDBEvent.Remove, { data: [] });
        }

        // Success
        return new MemoryDBResult(true, []);
    }

    /**
     * Remove duplicates of rows, keeps only unique values (values removed by `Set`)
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public removeDuplicates(save: boolean = true): MemoryDBResult<T> {
        // Make values unique
        let data: T[] = [...new Set(this.data)];

        // Save
        if (save) {
            this.data = data;

            // Log, Emit event
            this.debugLog("removeDuplicates");
            this.emit(MemoryDBEvent.RemoveDuplicates, { data });
        }

        // Success
        return new MemoryDBResult(true, data);
    }

    /**
     * Remove duplicates by predicate (predicate should choose one row to keep)
     * @param predicate predicate function to choose one of multiple duplicate rows
     * @param column column to check for duplicate values
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public removeDuplicatesByPredicate(
        predicate: ChoosePredicate<T>,
        column: ColumnQuery,
        save: boolean = true
    ): MemoryDBResult<T> {
        // Get duplicates
        let duplicates: T[] = this.Analytics.duplicates(column);

        // Choose duplicate to keep (with predicate)
        let predicateResult: T | T[] = predicate(duplicates);
        let keepDuplicates: T[] = Array.isArray(predicateResult) ? predicateResult : [predicateResult];

        // Remove duplicates
        let data: T[] = column
            ? this.data.filter((row: T) => (duplicates.includes(row) ? keepDuplicates.includes(row) : true))
            : [...new Set(this.data)];

        // Save
        if (save) {
            this.data = data;

            // Log, Emit event
            this.debugLog("removeDuplicates");
            this.emit(MemoryDBEvent.RemoveDuplicates, { data });
        }

        // Success
        return new MemoryDBResult(true, data);
    }

    /**
     * Merge rows of another database with this database rows
     * @param db database to merge with
     * @param predicate predicate function to decide row should be added or not
     * @param save save changes of this action in database
     * @returns result of changes, including modified data
     */
    public merge(db: MemoryDB<T>, predicate: MergePredicate<T>, save: boolean = true): MemoryDBResult<T> {
        // Try to get data from another database
        let result: MemoryDBResult<T> = db.list();
        if (!result.success) {
            return new MemoryDBResult(false);
        }

        // What data should be merged?
        let mergingData: T[] = (result.data as T[]).filter((row: T) => predicate(this.raw, row));

        // Merge data
        let data: T[] = this.data.concat(mergingData);

        // Save
        if (save) {
            this.data = data;

            // Log, Emit event
            this.debugLog("merge");
            this.emit(MemoryDBEvent.Merge, { data });
        }

        // Success
        return new MemoryDBResult(true, data);
    }
    //#endregion

    //#region Load/Save
    /**
     * Load rows from raw dump
     * @param loader serializer class to be used
     * @param data raw dump of data
     */
    public async load(loader: ILoader<object>, data: unknown): Promise<MemoryDBResult<T>> {
        return this.insert((await loader.load(data as any)) as T[]);
    }

    /**
     * Save rows as raw dump
     * @param loader serializer class to be used
     * @returns raw dump of data
     */
    public async save(loader: ILoader<object>): Promise<string | null> {
        return await loader.save(this.raw as object[]);
    }
    //#endregion
}
