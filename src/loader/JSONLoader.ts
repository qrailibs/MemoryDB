import { ReadStream } from "fs"

import ILoader from "./ILoader"
import streamToString from "../helpers/streamToString"

/*
 * Loader for JSON data format. Uses JSON.parse/stringify built-in mechanism.
 */
export default class JSONLoader<TRecord extends object> implements ILoader<
	TRecord,
	string | ReadStream,
	string
> {
	async load(data: string | ReadStream) {
		if(typeof data !== 'string') data = await streamToString(data)
		
		return JSON.parse(data) as TRecord[]
	}
	async save(value: []) {
		return JSON.stringify(value)
	}
}