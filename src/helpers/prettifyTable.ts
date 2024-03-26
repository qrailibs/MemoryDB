/**
 * Prettify print table as string
 * @template T type for the rows
 * @param rows rows that will be displayed in table
 * @param cellSize width of cells, in amount of characters (by default 16)
 */
export default function prettifyTable<T>(rows: T[], cellSize: number = 16): string {
    const baseRow = rows[0];
    const keys: string[] = typeof baseRow === "object" ? Object.keys(baseRow ?? {}) : ["value"];

    const dividerOpts = {
        cellSize,
        columnAmount: keys.length,
    };

    return ""
        .concat(createTableDivider({ ...dividerOpts, char: "=" }))
        .concat(createTableRow(keys.map((_) => `"${_}"`)))
        .concat(createTableDivider({ ...dividerOpts, char: "=" }))
        .concat(
            rows
                .map(
                    (row) =>
                        createTableRow(
                            typeof row === "object" ? Object.values(row ?? {}).map((_) => String(_)) : [String(row)]
                        ) + createTableDivider(dividerOpts)
                )
                .join("")
        );
}

function createTableDivider(opts: { cellSize: number; columnAmount?: number; char?: string }): string {
    return "|" + `${(opts.char ?? "-").repeat(opts.cellSize ?? 16)}|`.repeat(opts.columnAmount ?? 1) + "\n";
}

function createTableRow(values: string[], size: number = 16): string {
    return "| ".concat(values.map((value) => createTableCell(value, size)).join(" | ")).concat(" |\n");
}

function createTableCell(value: string, size: number = 16): string {
    return `${value.slice(0, size - 1)}${" ".repeat(size - 2 - value.length)}`;
}
