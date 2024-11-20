// deno-lint-ignore-file no-console no-external-import
// Example module with minifiable code
import foo from "data:text/javascript;base64,ZXhwb3J0IGRlZmF1bHQgImhlbGxvIHdvcmxkIg=="

function example() {
  return foo
}

console.log(example())
