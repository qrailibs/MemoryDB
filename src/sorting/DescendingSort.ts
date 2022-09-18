import SortPredicate from "../predicate/SortPredicate";

function DescendingSort<T>(column: string): SortPredicate<T> {
    // Create predicate
    const predicate: SortPredicate<T> = (a: T, b: T) => {
        // B - A (Descending)
        return (b as any)[column] ?? 0 - (a as any)[column] ?? 0
    }
    
    return predicate
}

export default DescendingSort