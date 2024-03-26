import MemoryDB from "../core/MemoryDB";
import MemoryDBResult from "../core/MemoryDBResult";

type ChainOperation<T> = (db: MemoryDB<T>) => MemoryDBResult<T>;

export default ChainOperation;
