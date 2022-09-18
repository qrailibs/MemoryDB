type MemoryDBResultData<T> = T[] | T
type MemoryDBResultError = string | null

export default class MemoryDBResult<T> {
    public success: boolean
    public data: MemoryDBResultData<T>
    public error: MemoryDBResultError

    constructor(success: boolean, data: MemoryDBResultData<T> = [], error: MemoryDBResultError = null) {
        this.success = success
        this.data = data
        this.error = error
    }
}