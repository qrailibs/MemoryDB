enum MemoryDBEvent {
    // Change operations
    Insert = 'insert',
    Remove = 'remove',
    RemoveDuplicates = 'removeDuplicates',
    Sort = 'sort',

    // Get operations
    List = 'list',
    Search = 'search',
    Find = 'find'
}

export default MemoryDBEvent