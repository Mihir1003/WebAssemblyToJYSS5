jyss = require("./jyss")

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
  });


test("add ", async () => {
expect(await jyss("(AppC + 7 8)")).toBe(15);
});


test("add recur", async () => {
    expect(await jyss("(AppC + (AppC + 8 8) 8)")).toBe(24);
    });
