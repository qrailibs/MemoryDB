export const VALID_COLUMN_QUERY = /^(?:\w+)(?:(?:\.\w+)+)?$/;

/**
 * Class used to query (deep) column in a record
 * @example new ColumnQuery("a.b").use({ a: { b: 100 } }) // 100
 */
export default class ColumnQuery {
    private _value: string = "";

    /**
     * Column query value
     */
    public get value(): string {
        return this._value;
    }
    /**
     * Change column query value.
     * Value will be validated.
     */
    public set value(query: string) {
        // Check that query is valid
        if (!VALID_COLUMN_QUERY.test(query)) {
            throw new Error(`Invalid format of column query (Example: "a.b.c", Got: "${query}")`);
        }

        this._value = query;
    }

    constructor(query: string) {
        this.value = query;
    }

    /**
     * Use this query on a record to get its column value
     * @param record record to query inside of it
     * @returns value of a column in a record
     */
    public use<TRecord>(record: TRecord): any {
        // Record is not object, we cannot access column
        if (typeof record !== "object") return undefined;

        // 'a.b.c' -> ['a', 'b', 'c']
        const fields: string[] = this._value.split(".");

        // Get values of field in a record
        let currentValue: any = record;
        for (const field of fields) {
            currentValue = currentValue?.[field];
        }
        return currentValue;
    }

    /**
     * Use query on a record to get its column value
     * @param query query to be used
     * @param record record to query inside of it
     * @returns value of a column in a record
     */
    public static use<TRecord>(query: string, record: TRecord): any {
        return new ColumnQuery(query).use(record);
    }
}
