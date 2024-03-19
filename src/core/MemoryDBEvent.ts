enum MemoryDBEvent {
    // Change operations
    Insert = "insert",
    Update = "update",
    Remove = "remove",
    RemoveColumn = "removeColumn",
    RemoveDuplicates = "removeDuplicates",
    Sort = "sort",
    Merge = "merge",

    // Get operations
    List = "list",
    ListPaginated = "listPaginated",
    Search = "search",
    Find = "find",
}

export default MemoryDBEvent;
