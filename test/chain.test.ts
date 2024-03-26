import { describe, expect, test } from "@jest/globals";

import { MemoryDB } from "../src";

// Mock data
const words: string[] = ["Hello", "World", "and", "Planet"];

describe("Testing database chaining (chain())", () => {
    test("Try to chain multiple insertions", () => {
        // Create database
        const db: MemoryDB<string> = new MemoryDB("test");
        // Test chain (two insert)
        expect(db.chain([(_) => _.insert(words[0]), (_) => _.insert(words[1])]).success).toBe(true);
        // Test values
        expect(db.raw).toEqual(words.slice(0, 2));
    });

    //TODO: add tests with chaining map() & remove(), deep chain()
});
