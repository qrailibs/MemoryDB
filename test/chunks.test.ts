import { describe, expect, test } from "@jest/globals";

import { MemoryDB } from "../src";

// Mock data
const chunkOne: string[] = ["Row data 1", "Row data 2", "Row data 3"];
const chunkTwo: string[] = ["Row data 4", "Row data 5", "Row data 6"];

describe("Testing database chunking (chunks())", () => {
    test("Try to split into chunks", () => {
        // Create database
        const db: MemoryDB<string> = new MemoryDB("test", [...chunkOne, ...chunkTwo]);

        // Make chunks
        const [dbOne, dbTwo] = db.chunks(3);

        // Test length of chunks
        expect(dbOne.length).toBe(3);
        expect(dbTwo.length).toBe(3);

        // Test data of chunks
        expect(dbOne.raw).toEqual(chunkOne);
        expect(dbTwo.raw).toEqual(chunkTwo);
    });
});
