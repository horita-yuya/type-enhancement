type Path = "/users" | "/users/:userId" | "/users/:userId/items/:itemId";
type PathParams<PATH extends string> = PATH extends `${string}:${infer Param}/${infer Rest}`
  ? Param | PathParams<`/${Rest}`>
  : PATH extends `${string}:${infer Param}`
    ? Param
    : never;

function createPath0(path: string, param?: Record<string, string>): string {
  let p: string = path;
  for (const key in param) {
    const value = param[key];
    p = p.replace(`:${key}`, value);
  }

  return p;
}

console.assert(createPath0("/users") === "/users");
console.assert(createPath0("/users/:userId", { userId: "user1" }) === "/users/user1");
console.assert(
  createPath0("/users/:userId/items/:itemId", { userId: "user1", itemId: "1" }) === "/users/user1/items/1",
);
// Unexpected
console.assert(createPath0("/users", { userId: "user0" }) === "/users");
console.assert(createPath0("/users/:userId/items/:itemId", { userId: "user1" }) === "/users/user1/items/:itemId");

function createPath<PATH extends Path>(
  path: PATH,
  ...params: [PathParams<PATH>] extends [never] ? [] : [{ [key in PathParams<PATH>]: string }]
): string {
  let p: string = path;
  let param = params[0] ?? ({} as { [key: string]: string });

  for (const key in param) {
    const value = param[key];
    p = p.replace(`:${key}`, value);
  }

  return p;
}

console.assert(createPath("/users") === "/users");
console.assert(createPath("/users/:userId", { userId: "user1" }) === "/users/user1");
console.assert(createPath("/users/:userId/items/:itemId", { userId: "user1", itemId: "1" }) === "/users/user1/items/1");
// Unexpected
// console.assert(createPath("/users", { userId: "user0" }) === "/users") // Error;
// console.assert(createPath("/users/:userId/items/:itemId", { userId: "user1" }) === "/users/user1/items/:itemId") // Error;

console.info("createPath check completed");
