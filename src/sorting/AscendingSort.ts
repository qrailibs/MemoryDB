import SortPredicate from "../predicate/SortPredicate";

export default function AscendingSort<TRecord>(column: keyof TRecord): SortPredicate<TRecord> {
    return ((a: TRecord, b: TRecord) => {
        // A - B (Ascending)
        return (a as any)[column] ?? 0 - (b as any)[column] ?? 0;
    }) as SortPredicate<TRecord>;
}
