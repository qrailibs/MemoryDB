export type MemoryDBResultData<T> = T[] | T;
export type MemoryDBResultError = string;

/**
 * Class used to show result of database action
 * @template T type of the rows in database
 */
export default class MemoryDBResult<T> {
    /**
     * Is action was success
     */
    public success: boolean;

    /**
     * Dump of database data after action
     */
    public data?: MemoryDBResultData<T>;

    /**
     * Error that ocurred (if it is)
     */
    public error?: MemoryDBResultError;

    /**
     * Create result of database action
     * @constructor
     */
    constructor(success: boolean, data?: MemoryDBResultData<T>, error?: MemoryDBResultError) {
        this.success = success;
        this.data = data;
        this.error = error;
    }
}
