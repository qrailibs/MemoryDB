import { ReadStream } from "fs";

/**
 * Read entire `ReadStream` with an encoding as string
 */
export default async function streamToString(stream: ReadStream, encoding: BufferEncoding = "utf-8") {
    const buffers = [];
    for await (const chunk of stream) {
        buffers.push(Buffer.from(chunk));
    }
    return Buffer.concat(buffers).toString(encoding);
}
