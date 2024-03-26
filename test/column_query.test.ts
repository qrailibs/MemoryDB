import { describe, expect, test } from "@jest/globals";

import { ColumnQuery } from "../src";

// Mock data
const object_simple: object = {
    a: 100,
    b: 200,
    c: 300,
};
const object_deep: object = {
    a: {
        b: 100,
        c: {
            d: 200,
        },
    },
};

describe("Testing ColumnQuery functionality", () => {
    test("Try use simple ColumnQuery", () => {
        // Make queries for columns a, b, c
        let queryA: ColumnQuery = new ColumnQuery("a");
        let queryB: ColumnQuery = new ColumnQuery("b");
        let queryC: ColumnQuery = new ColumnQuery("c");
        let queryFake: ColumnQuery = new ColumnQuery("a.b.c");

        // Use queries
        expect(queryA.use(object_simple)).toEqual(100);
        expect(queryB.use(object_simple)).toEqual(200);
        expect(queryC.use(object_simple)).toEqual(300);
        expect(queryFake.use(object_simple)).toEqual(undefined);
    });
    test("Try use deep ColumnQuery", () => {
        // Make queries for columns a, b, c
        let queryB: ColumnQuery = new ColumnQuery("a.b");
        let queryD: ColumnQuery = new ColumnQuery("a.c.d");
        let queryFake: ColumnQuery = new ColumnQuery("a.b.g");

        // Use queries
        expect(queryB.use(object_deep)).toEqual(100);
        expect(queryD.use(object_deep)).toEqual(200);
        expect(queryFake.use(object_deep)).toEqual(undefined);
    });
});
