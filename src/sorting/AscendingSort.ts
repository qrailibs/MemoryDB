import SortPredicate from "../predicate/SortPredicate";

function AscendingSort<T>(column: string): SortPredicate<T> {
    return ((a: T, b: T) => {
        // A - B (Ascending)
        return (a as any)[column] ?? 0 - (b as any)[column] ?? 0;
    }) as SortPredicate<T>;
}

export default AscendingSort;
