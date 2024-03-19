import SortPredicate from "../predicate/SortPredicate";

function DescendingSort<T>(column: string): SortPredicate<T> {
    return ((a: T, b: T) => {
        // B - A (Descending)
        return (b as any)[column] ?? 0 - (a as any)[column] ?? 0;
    }) as SortPredicate<T>;
}

export default DescendingSort;
