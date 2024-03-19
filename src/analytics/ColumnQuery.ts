export default class ColumnQuery {
    public value: string;

    constructor(query: string) {
        this.value = query;

        // Check that query is valid
        let formula: RegExp = /^(?:\w+)(?:(?:\.\w+)+)?$/;
        if (!formula.test(query)) {
            throw new Error("Invalid format of column query (Example: a.b.c)");
        }
    }

    // Extract value from row by query
    public use(row: object): any {
        // 'a.b.c' -> ['a', 'b', 'c']
        let fields: string[] = this.value.split(".");

        // Get values of field in a row
        let result: any = row;
        for (let field of fields) {
            result = result?.[field];
        }
        return result;
    }
}
