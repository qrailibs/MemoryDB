import { ReadStream } from "fs";

/**
 * Read entire `ReadStream` and get string
 * @param stream the stream itself
 * @param encoding encoding that will be used to read stream
 */
export default async function streamToString(stream: ReadStream, encoding: BufferEncoding = "utf-8") {
    const buffers = [];
    for await (const chunk of stream) {
        buffers.push(Buffer.from(chunk));
    }
    return Buffer.concat(buffers).toString(encoding);
}
