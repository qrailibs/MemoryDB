enum MemoryDBEvent {
    // Change operations
    Insert = 'insert',
    Remove = 'remove',
    Sort = 'sort',

    // Get operations
    List = 'list',
    Search = 'search',
    Find = 'find'
}

export default MemoryDBEvent