import MemoryDB from "../core/MemoryDB"

type Exporter<T> = (db: MemoryDB<T>) => string

export default Exporter