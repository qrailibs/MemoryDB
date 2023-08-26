import MemoryDB from "../../core/MemoryDB"

export enum AICommandType {
	getColumns = "getColumns",
	deleteColumn = "deleteColumn",
	changeColumn = "changeColumn",

	getRows = "getRows",
	deleteRows = "deleteRows",
	changeRows = "changeRows"
}

export interface AICommand {
	name: AICommandType
	description: string
	input?: string
	output: string
}

export default class CommandsAgent<T> {
    private db: MemoryDB<T>

    constructor(database: MemoryDB<T>) {
        this.db = database
    }

	public listCommands(): AICommand[] {
		return [
			{
				name: AICommandType.getColumns,
				description: "Get columns in table",
				output: "Array of columns: \"id\": number, \"name\": string"
			},
			{
				name: AICommandType.deleteColumn,
				description: "Delete particular column in table",
				input: "Name of column to delete",
				output: "Result of action: \"Success\" or \"Column not found\" }"
			},
			{
				name: AICommandType.changeColumn,
				description: "Change particular column's name/type in table",
				input: "{ \"name\": \"columnName\", \"newName\": \"newColumnName\" } or { \"name\": \"columnName\", \"newType\": \"number\" }",
				output: "Result of action: \"Success\" or \"Column not found\" }"
			}
		]
	}

	public executeCommand(commandName: AICommandType, commandInput: string) {
		switch(commandName) {
			//#region Columns
			case AICommandType.getColumns: {
				const head = this.db.head()

				return head
					? head.map((meta) => `"${String(meta.name)}": ${meta.type}`).join(', ')
					: ""
			}
			case AICommandType.deleteColumn: {
				const column = this.db.headColumn(commandInput as keyof T)
				
				if(column) {
					this.db.removeColumn(commandInput as keyof T)
				}

				return column
					? "Success"
					: "Column not found"
			}
			//#endregion
			//#region Rows
			//#endregion
			default:
				return "Command unknown"
		}
	}
}