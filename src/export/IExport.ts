import MemoryDB from "../core/MemoryDB"

export default interface IExport<T> {
	(db: MemoryDB<T>): string
}