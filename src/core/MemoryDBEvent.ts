enum MemoryDBEvent {
    // Change operations
    Insert = 'insert',
    Remove = 'remove',
    RemoveDuplicates = 'removeDuplicates',
    Sort = 'sort',
    Merge = 'merge',

    // Get operations
    List = 'list',
    ListPaginated = 'listPaginated',
    Search = 'search',
    Find = 'find'
}

export default MemoryDBEvent