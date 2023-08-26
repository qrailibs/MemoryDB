import { ReadStream } from "fs";

export default interface ILoader<
	TRecord extends object,
	TInput = ReadStream,
	TOutput = string
> {
	load(stream: TInput): Promise<TRecord[]>;
	save(value: TRecord[]): Promise<TOutput | null>;
}