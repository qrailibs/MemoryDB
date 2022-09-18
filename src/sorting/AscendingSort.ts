import SortPredicate from "../predicate/SortPredicate";

function AscendingSort<T>(column: string): SortPredicate<T> {
    // Create predicate
    const predicate: SortPredicate<T> = (a: T, b: T) => {
        // A - B (Ascending)
        return (a as any)[column] ?? 0 - (b as any)[column] ?? 0
    }
    
    return predicate
}

export default AscendingSort