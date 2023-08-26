export type ColumnType = "number"
	| "string"
	| "boolean"
	| "json"
	| "date"

export default interface ColumnMetadata<T> {
	name: keyof T
	type: ColumnType
	nullable: boolean
	description: string
}