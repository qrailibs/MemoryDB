import MemoryDB from "../core/MemoryDB"

import CommandsAgent from "./agents/CommandsAgent"

export default class AI<T> {
    private db: MemoryDB<T>

    constructor(database: MemoryDB<T>) {
        this.db = database
    }

	public createCommandsAgent() {
		return new CommandsAgent(this.db)
	}
}