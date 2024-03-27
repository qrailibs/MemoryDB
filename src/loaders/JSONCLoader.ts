import { compress, decompress } from "compress-json";
import { ReadStream } from "fs";

import ILoader from "./ILoader";
import streamToString from "../helpers/streamToString";

/**
 * Loader for JSON Compressed data format. Uses same JSON.parse/stringify built-in mechanism,
 * but adds additional step of data compressing using "compress-json" package.
 */
export default class JSONCLoader<TRecord extends object> implements ILoader<TRecord, string | ReadStream, string> {
    async load(data: string | ReadStream) {
        if (typeof data !== "string") data = await streamToString(data);

        const dataCompressed = JSON.parse(data);

        return decompress(dataCompressed) as TRecord[];
    }

    async save(value: TRecord[]) {
        const dataCompressed = compress(value);

        return JSON.stringify(dataCompressed);
    }
}
