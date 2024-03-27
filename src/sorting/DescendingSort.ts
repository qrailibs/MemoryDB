import SortPredicate from "../predicate/SortPredicate";

export default function DescendingSort<TRecord>(column: keyof TRecord): SortPredicate<TRecord> {
    return ((a: TRecord, b: TRecord) => {
        // B - A (Descending)
        return (b as any)[column] ?? 0 - (a as any)[column] ?? 0;
    }) as SortPredicate<TRecord>;
}
