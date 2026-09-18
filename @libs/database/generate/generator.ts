// Imports
import * as ts from "typescript/unstable/ast"
import { API } from "typescript/unstable/async"
import type { Project } from "typescript/unstable/async"
import { resolve } from "@std/path"
import { ddl } from "../schema/_ddl.ts"
import { metadata } from "../schema/_metadata.ts"
import { Type } from "../database.ts"
import type { is } from "@libs/is"

/** Compile annotated SQL sources into one typed Query class. */
export async function generate(sources: readonly string[]): Promise<string> {
  await using compiler = new Compiler()
  // Collect imports, query declarations, and hook registrations
  let unused = false
  const imports = new Set<string>()
  const models = new Set<string>()
  const methods = [] as string[]
  const signatures = [] as string[]
  const names = new Set<string>()
  const registrations = { pre: new Map<string, string[]>(), post: new Map<string, string[]>() }
  // Resolve type-only imports and runtime schema imports before compiling queries
  for (const source of sources) {
    for (const line of source.split(/\r?\n/)) {
      const directive = /^\s*--\s*@import\s+(.+?)\s*;?\s*$/.exec(line)
      if (!directive)
        continue
      const text = `import ${directive[1].replace(/;$/, "")}`
      const node = (await compiler.parse(text)).statements[0]
      if (!ts.isImportDeclaration(node) || !node.importClause)
        throw new SyntaxError(`Invalid import directive: ${line}`)
      imports.add(text)
      if (node.importClause.phaseModifier !== ts.SyntaxKind.TypeKeyword) {
        const bindings = node.importClause.namedBindings
        if (!bindings || !ts.isNamedImports(bindings) || node.importClause.name)
          throw new SyntaxError("Schema imports require named exports; use @import { Model } from ...")
        for (const binding of bindings.elements) {
          if (!binding.isTypeOnly)
            models.add(binding.name.text)
        }
      }
    }
  }
  for (const source of sources) {
    let signature = ""
    let typeonly = false
    let raw = false
    let sql = [] as string[]
    let hooks = [] as directive[]
    // Flush the preceding query when a new signature is encountered
    const flush = async () => {
      if (!signature)
        return
      const method = await compile(compiler, signature, sql.join("\n").trim(), hooks, models, typeonly, raw)
      if (names.has(method.name))
        throw new SyntaxError(`Duplicate query name "${method.name}"`)
      names.add(method.name)
      unused ||= method.unused
      methods.push(method.code)
      signatures.push(method.signature)
      // Accumulate compatible signatures for each registered hook
      for (const phase of ["pre", "post"] as const) {
        for (const [index, name] of method.hooks[phase].entries()) {
          const entries = registrations[phase].get(name) ?? []
          const tuple = `NonNullable<ReturnType<typeof Query.${method.name}>["hooks"]["${phase}"][${index}]["types"]>`
          const args = phase === "pre" ? `${tuple}[0]` : `[${tuple}[0]]`
          entries.push(`_Hook<${args}, ${tuple}[1], C>`)
          registrations[phase].set(name, entries)
        }
      }
      sql = []
      hooks = []
      typeonly = false
      raw = false
    }
    // Separate imports, signatures, hooks, and SQL lines
    for (const line of source.split(/\r?\n/)) {
      const directive = /^\s*--\s*@import\s+(.+?)\s*;?\s*$/.exec(line)
      const header = /^\s*--\s*([A-Za-z_$][\w$]*(?:\s*<.*>)?\s*\(.*)$/.exec(line)
      const hook = /^\s*--\s*([@#])([A-Za-z_$][\w$]*\s*\(.*)$/.exec(line)
      if (directive)
        continue
      else if (header) {
        await flush()
        signature = header[1]
      } else if (/^\s*--\s*\*typeonly\s*$/.test(line)) {
        if (!signature)
          throw new SyntaxError("The *typeonly directive must follow a query signature")
        typeonly = true
      } else if (/^\s*--\s*\*raw\s*$/.test(line)) {
        if (!signature)
          throw new SyntaxError("The *raw directive must follow a query signature")
        raw = true
      } else if (hook) {
        if (!signature)
          throw new SyntaxError("A hook must follow a query signature")
        hooks.push({ phase: hook[1] === "#" ? "pre" : "post", text: hook[2] })
      } else if (signature)
        sql.push(line)
      else if ((line.trim()) && (!line.trimStart().startsWith("--")))
        throw new SyntaxError("SQL must follow a query signature comment")
    }
    await flush()
  }
  // Resolve the supported automatic type imports
  if (!methods.length)
    throw new SyntaxError("No annotated SQL queries found")
  const code = methods.join("\n\n")
  const declarations = signatures.join("\n\n")
  const helpers = types.filter((name) => new RegExp(`\\b${name}\\b`).test(code + declarations) && ![...imports].some((line) => new RegExp(`\\b${name}\\b`).test(line)))
  const registered = registrations.pre.size + registrations.post.size > 0
  // Emit hook maps with optional context parameters
  const registry = (["pre", "post"] as const).map((phase) => {
    const entries = [...registrations[phase]].map(([name, types]) => `    \n    ${name}: ${types.join(" & ")}`).join("\n")
    return `  \n  ${phase}: ${entries ? `{\n${entries}\n  }` : "Record<never, never>"}`
  }).join("\n")
  // Assemble the module header, runtime imports, and declarations
  const generated = `// deno-coverage-ignore-file\n// deno-fmt-ignore-file\n/**\n * Generated by @libs/database/generate.\n * Do not edit.\n *\n * Last generated: ${new Date().toISOString()}\n */\n${unused ? "// deno-lint-ignore-file no-unused-vars\n" : ""}${
    models.size ? 'import * as _schema from "@libs/database/schema";\n' : ""
  }// Imports\nimport { Type as _Type } from "@libs/database"\nimport type { Query as _Query${registered ? ", Hook as _Hook, Invocation as _Invocation" : ""} } from "@libs/database"\n${helpers.length ? `import type { ${helpers.join(", ")} } from "@libs/typing"\n` : ""}${
    [...imports].join("\n")
  }\n\n\nexport default class Query {\n${code}\n}\n\n\nexport interface Hooks<${registered ? "C" : "_C"} extends Record<string, unknown> | undefined = undefined> {\n${registry}\n}\n\n${declarations}\n`
  // Compact executable code while retaining the header and SQL documentation
  return await compact(compiler, generated)
}

/** Compile exported table schemas into deferred creation queries. */
export async function generateTables(exports: Record<string, unknown>): Promise<string> {
  await using compiler = new Compiler()
  // Select table declarations and validate their exported names
  const tables = Object.entries(exports).filter(([, schema]) => schema && typeof schema === "object" && metadata.get(schema)?.table).map(([name, schema]) => ({ name, schema: schema as is.ZodObject }))
  if (!tables.length)
    throw new TypeError("No exported is.table() declarations found")
  const names = new Set<string>()
  for (const table of tables) {
    if (!/^[A-Za-z_$][\w$]*$/.test(table.name) || ["create", "constructor", "prototype"].includes(table.name))
      throw new SyntaxError(`Reserved or invalid table export name: ${table.name}`)
    const name = metadata.get(table.schema)!.table!
    if (names.has(name))
      throw new SyntaxError(`Duplicate table declaration: ${name}`)
    names.add(name)
  }
  // Order foreign-key dependencies before their referencing tables
  const ordered = [] as typeof tables
  const pending = new Set(tables)
  while (pending.size) {
    const ready = [...pending].filter((table) =>
      Object.values(table.schema.shape).every((column) => {
        const reference = metadata.get(column as object)?.references?.table
        return !reference || reference === metadata.get(table.schema)!.table || ![...pending].some((other) => metadata.get(other.schema)!.table === reference)
      })
    )
    if (!ready.length)
      throw new TypeError("Cyclic table references require explicit SQL migrations")
    for (const table of ready) {
      ordered.push(table)
      pending.delete(table)
    }
  }
  // Emit one method per exported table and a dependency-ordered create method
  const statements = ordered.map(({ name, schema }) => ({ name, sqlite: ddl(schema, Type.SQLite).join("\n"), postgres: ddl(schema, Type.PostgreSQL).join("\n") }))
  statements.push({ name: "create", sqlite: statements.map(({ sqlite }) => sqlite).join("\n"), postgres: statements.map(({ postgres }) => postgres).join("\n") })
  const methods = statements.map(({ name, sqlite, postgres }) => {
    const documentation = postgres.replaceAll("*/", "*\\/").split("\n").map((line) => ` * ${line}`).join("\n")
    return `/**\n * \u0060\u0060\u0060sql\n${documentation}\n * \u0060\u0060\u0060\n */\nstatic ${name}(): _Query<void, void, []> { return { inputs: [], bind() {return Table.${name}()}, async execute(database) {await database.run(database.type === _Type.SQLite ? ${
      JSON.stringify(sqlite)
    } : ${JSON.stringify(postgres)})} } }`
  })
  return await compact(compiler,
    `// deno-coverage-ignore-file\n// deno-fmt-ignore-file\n/**\n * Generated by @libs/database/generate.\n * Do not edit.\n *\n * Last generated: ${
      new Date().toISOString()
    }\n */\nimport {Type as _Type} from "@libs/database"; import type {Query as _Query} from "@libs/database"; export default class Table {${methods.join("\n")}}`,
  )
}

/** Compile one TypeScript signature and its SQL body. */
async function compile(compiler: Compiler, signature: string, statement: string, hooks: directive[], models: ReadonlySet<string>, typeonly: boolean, raw: boolean): Promise<{ name: string; code: string; signature: string; hooks: { pre: string[]; post: string[] }; unused: boolean }> {
  // Validate the query signature and select collision-free internal names
  const source = await compiler.parse(`function ${signature} {}`)
  const declaration = source.statements[0]
  if ((!ts.isFunctionDeclaration(declaration)) || (!declaration.name) || (!declaration.type) || (source.statements.length !== 1))
    throw new SyntaxError(`Expected a named, typed query signature: ${signature}`)
  if (!statement)
    throw new SyntaxError(`Query ${declaration.name.text} has no SQL`)
  const name = declaration.name.text
  if (["constructor", "prototype"].includes(name))
    throw new SyntaxError(`Query name "${name}" is reserved`)
  let prefix = "_database"
  while (signature.includes(prefix))
    prefix += "_"
  const identifiers = new Set<string>()
  // Collect names introduced by nested binding patterns.
  const collect = (name: ts.BindingName): void => {
    if (ts.isIdentifier(name))
      identifiers.add(name.text)
    else {
      for (const element of name.elements) {
        if (ts.isBindingElement(element) && element.name)
          collect(element.name)
      }
    }
  }
  declaration.parameters.forEach((parameter) => collect(parameter.name))
  // Resolve generic model bounds while retaining their extra application properties
  const bounds = new Map<string, ts.TypeNode>()
  const runtime = new Set(models)
  for (const parameter of declaration.typeParameters ?? []) {
    if (parameter.constraint && uses(parameter.constraint, runtime)) {
      bounds.set(parameter.name.text, parameter.constraint)
      runtime.add(parameter.name.text)
    }
  }
  // Associate declared parameters and destructured names with their schemas
  const schemas = declaration.parameters.map((parameter) => parameter.type && uses(parameter.type, runtime) ? expression(parameter.type, models, bounds) : undefined)
  const bindings = new Map<string, string>()
  const assign = (name: ts.BindingName, schema: string): void => {
    if (ts.isIdentifier(name)) {
      bindings.set(name.text, schema)
      return
    }
    name.elements.forEach((element, index) => {
      if (!ts.isBindingElement(element) || !element.name)
        return
      if (element.dotDotDotToken) {
        if (ts.isArrayBindingPattern(name))
          assign(element.name, `_schema.field(${schema},${index}).array()`)
        else {
          const keys = name.elements.filter((part) => ts.isBindingElement(part) && !part.dotDotDotToken).map((part) => {
            const property = (part as ts.BindingElement).propertyName ?? (part as ts.BindingElement).name!
            if (ts.isComputedPropertyName(property))
              return property.expression.getText()
            return JSON.stringify(ts.isIdentifier(property) || ts.isStringLiteral(property) ? property.text : property.getText())
          })
          assign(element.name, `_schema.project(${schema},"omit",[${keys.join(",")}])`)
        }
        return
      }
      const key = ts.isArrayBindingPattern(name)
        ? String(index)
        : element.propertyName
        ? (ts.isIdentifier(element.propertyName) || ts.isStringLiteral(element.propertyName) ? JSON.stringify(element.propertyName.text) : element.propertyName.getText())
        : JSON.stringify(element.name.getText())
      assign(element.name, `_schema.field(${schema},${key})`)
    })
  }
  declaration.parameters.forEach((parameter, index) => {
    if (schemas[index])
      assign(parameter.name, schemas[index]!)
  })
  // Capture positional arguments while preserving defaults and destructuring
  const captures = [] as string[]
  const parameters = declaration.parameters.map((parameter, index) => {
    if (parameter.name.getText(source) === "this")
      throw new SyntaxError("Query signatures cannot declare a this parameter")
    const value = parameter.dotDotDotToken ? `${prefix}args.slice(${index}) as ${annotation(parameter.type!, models, "input")}` : `${prefix}args[${index}]`
    const resolved = parameter.initializer ? `${value} === undefined ? (${parameter.initializer.getText(source)}) : ${value}` : value
    const variable = ts.isIdentifier(parameter.name) ? parameter.name.text : `${prefix}${index}`
    if (schemas[index])
      bindings.set(variable, schemas[index]!)
    captures.push(`const ${variable} = ${resolved}`)
    if (!ts.isIdentifier(parameter.name))
      captures.push(`const ${parameter.name.getText(source)} = ${variable}`)
    return variable
  })
  // Resolve positional, named, and context bindings to safe property accesses
  const sql = await bind(statement, async (expression) => {
    const positional = /^(\d+)(?=\.|\[|$)/.exec(expression)
    if (positional) {
      const index = Number(positional[1])
      if ((!Number.isInteger(index)) || (index < 0) || (index > parameters.length))
        throw new SyntaxError(`Invalid argument index in binding "${expression}"`)
      expression = (index === 0 ? `${prefix}context` : parameters[index - 1]) + expression.slice(positional[1].length)
    }
    // Reject expressions other than declared inputs and property paths
    const node = (await compiler.parse(`const value = ${expression}`)).statements[0] as ts.VariableStatement
    const value = node.declarationList.declarations[0].initializer!
    // Validate property-only access without executing arbitrary expressions
    const validate = (value: ts.Expression): boolean => {
      if (ts.isIdentifier(value))
        return (value.text === `${prefix}context`) || identifiers.has(value.text) || parameters.includes(value.text)
      if (ts.isPropertyAccessExpression(value))
        return validate(value.expression)
      if (ts.isElementAccessExpression(value))
        return validate(value.expression) && (ts.isStringLiteral(value.argumentExpression) || ts.isNumericLiteral(value.argumentExpression) || validate(value.argumentExpression))
      return false
    }
    if ((!validate(value)) || (value.getText() !== expression))
      throw new SyntaxError(`Invalid parameter path "${expression}"`)
    if (positional && Number(positional[1]) === 0) {
      // Resolve context paths while preserving null for an absent context
      const access = (value: ts.Expression): string => {
        if (ts.isPropertyAccessExpression(value))
          return `(${access(value.expression)} as Record<PropertyKey, unknown> | null)?.[${JSON.stringify(value.name.text)}]`
        if (ts.isElementAccessExpression(value))
          return `(${access(value.expression)} as Record<PropertyKey, unknown> | null)?.[${value.argumentExpression.getText()}]`
        return `${prefix}context`
      }
      return `(${access(value)} ?? null)`
    }
    // Derive the encoder from the input schema and the exact binding path
    const schema = (value: ts.Expression): string | undefined => {
      if (ts.isIdentifier(value))
        return bindings.get(value.text)
      if (ts.isPropertyAccessExpression(value) || ts.isElementAccessExpression(value)) {
        const parent = schema(value.expression)
        const key = ts.isPropertyAccessExpression(value) ? JSON.stringify(value.name.text) : value.argumentExpression.getText()
        return parent ? `_schema.field(${parent},${key})` : undefined
      }
    }
    const resolved = schema(value)
    return !raw && resolved ? `_schema.encode(${resolved},${expression},${prefix}.type)` : expression
  })
  // Preserve generic parameters and the declared input tuple
  const type = annotation(declaration.type, models, "output")
  let checked = schemas.some(Boolean) || uses(declaration.type, runtime)
  const decoding = !raw && uses(declaration.type, runtime) ? expression(declaration.type, models, bounds) : undefined
  let checking = expression(declaration.type, models, bounds)
  const generics = declaration.typeParameters ? `<${declaration.typeParameters.map((parameter) => annotation(parameter, models, "input")).join(", ")}>` : ""
  const arguments_ = declaration.typeParameters ? `<${declaration.typeParameters.map((parameter) => parameter.name.text).join(", ")}>` : ""
  const inputs = `Parameters<typeof _signature_${name}${arguments_}>`
  let output = type
  const transitions = { pre: [] as string[], post: [] as string[] }
  const invocations = { pre: [] as string[], post: [] as string[] }
  const names = { pre: [] as string[], post: [] as string[] }
  // Parse hook calls and propagate declared post-hook result types
  for (const { phase, text: hook } of hooks) {
    const text = `const value = ${hook}`
    const source = await compiler.parse(text, false)
    const node = (source.statements[0] as ts.VariableStatement).declarationList.declarations[0].initializer!
    if ((!ts.isCallExpression(node)) || (!ts.isIdentifier(node.expression)))
      throw new SyntaxError(`Invalid ${phase}-hook ${hook}`)
    await compiler.parse(`const value = ${node.getText(source)}`)
    // Accept result annotations only for post-hooks
    const tail = text.slice(node.end).trim()
    const previous = output
    if (tail) {
      if ((phase === "pre") || (!tail.startsWith(":")))
        throw new SyntaxError(`Invalid ${phase}-hook return type: ${hook}`)
      const declaration = await compiler.parse(`type Output = ${tail.slice(1)}`)
      if (declaration.statements.length !== 1)
        throw new SyntaxError(`Invalid post-hook return type: ${hook}`)
      const type = (declaration.statements[0] as ts.TypeAliasDeclaration).type
      output = annotation(type, models, "output")
      checked ||= uses(type, runtime)
      checking = expression(type, models, bounds)
    }
    // Record hook arguments and type transitions for the generated registry
    transitions[phase].push(phase === "pre" ? `_Invocation<${inputs}, ${inputs}>` : `_Invocation<Awaited<${previous}>, Awaited<${output}>>`)
    invocations[phase].push(`{ name: ${JSON.stringify(node.expression.text)}, args: [${node.arguments.map((argument) => argument.getText(source)).join(", ")}] }`)
    names[phase].push(node.expression.text)
  }
  // Select row cardinality and rebuild normalized arguments
  const mode = shape(declaration.type)
  const result = mode === "array" ? `${prefix}rows` : mode === "void" ? "undefined" : mode === "nullable" ? `${prefix}rows[0] ?? null` : `${prefix}rows[0]`
  const normalized = parameters.map((parameter, index) => declaration.parameters[index].dotDotDotToken ? `...${parameter}` : parameter).join(", ")
  // Parse final inputs only after all user pre-hooks have completed
  const parsed = declaration.parameters.map((parameter, index) => {
    const value = parameter.dotDotDotToken ? `${prefix}args.slice(${index})` : parameters[index]
    const parsed = schemas[index] ? `await _schema.validate(${schemas[index]},${value})` : value
    return parameter.dotDotDotToken ? `...(${parsed} as ${annotation(parameter.type!, models, "input")})` : parsed
  }).join(",")
  const precheck = !typeonly && schemas.some(Boolean) ? `async precheck() { return Query.${name}${arguments_}(...[${parsed}] as ${inputs}) },` : ""
  const postcheck = !typeonly && checked ? `async postcheck(value): Promise<Awaited<${output}>> { return await _schema.validate(${checking},value) as Awaited<${output}> },` : ""
  // Document the annotated query using PostgreSQL parameter placeholders
  const documentation = [`-- ${signature}`, ...(typeonly ? ["-- *typeonly"] : []), ...(raw ? ["-- *raw"] : []), ...hooks.map(({ phase, text }) => `-- ${phase === "pre" ? "#" : "@"}${text}`), sql.postgres].join("\n").replaceAll("*/", "*\\/")
  return {
    name,
    unused: [...identifiers].some((name) => !name.startsWith("_")) || (mode === "void"),
    signature: `\nfunction _signature_${name}${generics}(${declaration.parameters.map((parameter) => annotation(parameter, models, "input")).join(", ")}): void {}`,
    hooks: names,
    code: `  /**\n * \`\`\`sql\n${documentation.split("\n").map((line) => ` * ${line}`).join("\n")}\n * \`\`\`\n */\n  static ${name}${generics}(...${prefix}args: ${inputs}): _Query<Awaited<${output}>, Awaited<${type}>, ${inputs}>${
      hooks.length ? ` & { hooks: { pre: [${transitions.pre.join(", ")}]; post: [${transitions.post.join(", ")}] } }` : ""
    } {\n    ${captures.join("\n    ")}\n    return {\n      ${precheck}${postcheck}\n      inputs: [${normalized}] as ${inputs},\n      \n      bind(inputs) { return Query.${name}${arguments_}(...inputs) },\n      hooks: { pre: [${invocations.pre.join(", ")}], post: [${
      invocations.post.join(", ")
    }] },\n      \n      async execute(${prefix}, ${prefix}context): Promise<Awaited<${type}>> {\n        const ${prefix}rows = await ${prefix}.prepare(${prefix}.type === _Type.SQLite ? ${JSON.stringify(sql.sqlite)} : ${JSON.stringify(sql.postgres)}).run(${
      sql.parameters.join(", ")
    })\n        ${mode === "one" ? `if (!${prefix}rows.length) throw new ReferenceError(${JSON.stringify(`Query ${name} returned no rows`)})` : ""}\n        return (${
      decoding ? `_schema.decode(${decoding},${result},${prefix}.type)` : result
    }) as unknown as Awaited<${type}>\n      },\n    }\n  }`,
  }
}

/** Infer row cardinality from explicit array, optional, and nullable annotations. */
function shape(type: ts.TypeNode): "array" | "one" | "optional" | "nullable" | "void" {
  // Unwrap type operators and identify explicit nullable or optional results
  if ((ts.isParenthesizedTypeNode(type)) || (ts.isTypeOperatorNode(type)))
    return shape(type.type)
  if (ts.isUnionTypeNode(type)) {
    if (type.types.some((type) => type.kind === ts.SyntaxKind.UndefinedKeyword))
      return "optional"
    if (type.types.some((type) => type.kind === ts.SyntaxKind.LiteralType && (type as ts.LiteralTypeNode).literal.kind === ts.SyntaxKind.NullKeyword))
      return "nullable"
    return shape(type.types[0])
  }
  // Recognize arrays, empty results, and supported type wrappers
  if ((ts.isArrayTypeNode(type)) || ts.isTupleTypeNode(type))
    return "array"
  if ((type.kind === ts.SyntaxKind.VoidKeyword) || (type.kind === ts.SyntaxKind.UndefinedKeyword))
    return "void"
  if (ts.isTypeReferenceNode(type)) {
    const name = type.typeName.getText()
    if (["Array", "ReadonlyArray", "NonEmptyArray", "Arrayable"].includes(name))
      return "array"
    if (["Optional", "Voidable"].includes(name))
      return type.typeArguments?.length && shape(type.typeArguments[0]) === "array" ? "array" : "optional"
    if (name === "Nullable")
      return type.typeArguments?.length && shape(type.typeArguments[0]) === "array" ? "array" : "nullable"
    if (["Promise", "Promisable", "Awaited", "NonVoid", "Readonly"].includes(name) && type.typeArguments?.length)
      return shape(type.typeArguments[0])
  }
  return "one"
}

/** Replace template bindings outside SQL strings, identifiers, and comments. */
async function bind(source: string, resolve: (expression: string) => Promise<string>): Promise<{ sqlite: string; postgres: string; parameters: string[] }> {
  // Track SQL for each backend and its ordered binding expressions
  const parameters = [] as string[]
  let sqlite = ""
  let postgres = ""
  let index = 0
  // Scan SQL without interpreting bindings inside quoted or commented text
  while (index < source.length) {
    const rest = source.slice(index)
    const delimiter = /^(?:\$[A-Za-z_][\w]*\$|\$\$)/.exec(rest)?.[0]
    let end = index + 1
    // Preserve line comments and nested block comments
    if (rest.startsWith("--")) {
      const newline = source.indexOf("\n", index)
      end = newline < 0 ? source.length : newline
    } else if (rest.startsWith("/*")) {
      let depth = 1
      end = index + 2
      while ((end < source.length) && depth) {
        if (source.slice(end, end + 2) === "/*") {
          depth++
          end += 2
        } else if (source.slice(end, end + 2) === "*/") {
          depth--
          end += 2
        } else {
          end++
        }
      }
      if (depth)
        throw new SyntaxError("Unterminated SQL block comment")
    } else if (delimiter) {
      // Preserve PostgreSQL dollar-quoted strings
      const closing = source.indexOf(delimiter, index + delimiter.length)
      if (closing < 0)
        throw new SyntaxError(`Unterminated SQL dollar quote ${delimiter}`)
      end = closing + delimiter.length
    } else if (["'", '"', "`", "["].includes(source[index])) {
      // Consume SQL strings and quoted identifiers with their escape rules
      const quote = source[index] === "[" ? "]" : source[index]
      let closed = false
      const escape = (quote === "'") && /(?:^|[^\w$])[eE]$/.test(source.slice(0, index))
      while (end < source.length) {
        if (escape && source[end] === "\\") {
          end += 2
          continue
        }
        if (source[end++] === quote) {
          if (source[end] === quote)
            end++
          else {
            closed = true
            break
          }
        }
      }
      if (!closed)
        throw new SyntaxError(`Unterminated SQL quote ${source[index]}`)
    } else if (rest.startsWith("${")) {
      // Extract a binding while respecting quoted property names
      const start = index + 2
      let quote = ""
      end = start
      for (; end < source.length; end++) {
        const char = source[end]
        if (quote) {
          if (char === "\\")
            end++
          else if (char === quote)
            quote = ""
        } else if ((char === "'") || (char === '"'))
          quote = char
        else if (char === "}")
          break
      }
      if (end === source.length)
        throw new SyntaxError("Unterminated SQL parameter binding")
      // Emit backend-specific placeholders in binding order
      const expression = await resolve(source.slice(start, end).trim())
      parameters.push(expression)
      sqlite += "?"
      postgres += `$${parameters.length}`
      index = end + 1
      continue
    }
    // Copy untouched SQL to both backend statements
    sqlite += source.slice(index, end)
    postgres += source.slice(index, end)
    index = end
  }
  return { sqlite, postgres, parameters }
}

const types = ["Optional", "Voidable", "Nullable", "Arrayable", "Promisable", "NonEmptyArray", "NonVoid"]

/** Compact TypeScript tokens without changing literals or automatic semicolon insertion. */
async function compact(compiler: Compiler, text: string): Promise<string> {
  // Insert statement separators using the native printer
  const printed = await compiler.print(await compiler.parse(text))
  const source = await compiler.parse(printed)
  const literals = new Map<number, ts.Node>()
  // Preserve regex and template expressions as complete tokens
  const collect = (node: ts.Node): void => {
    if (ts.isTemplateExpression(node) || node.kind === ts.SyntaxKind.RegularExpressionLiteral) {
      literals.set(node.getStart(source), node)
      return
    }
    node.forEachChild(collect)
  }
  collect(source)
  const scanner = ts.createScanner(false, ts.LanguageVariant.Standard, printed)
  let output = ""
  let previous = ""
  // Retain documentation while dropping unnecessary whitespace
  for (let kind = scanner.scan(); kind !== ts.SyntaxKind.EndOfFile; kind = scanner.scan()) {
    if (kind === ts.SyntaxKind.WhitespaceTrivia || kind === ts.SyntaxKind.NewLineTrivia)
      continue
    let token = scanner.getTokenText()
    if (kind === ts.SyntaxKind.SingleLineCommentTrivia || kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      if (token.includes("deno-") || token.includes("Generated by") || token.includes("```sql"))
        output += (output.endsWith("\n") || !output ? "" : "\n") + token + "\n"
      continue
    }
    const literal = literals.get(scanner.getTokenStart())
    if (literal) {
      token = literal.getText(source)
      scanner.resetTokenState(literal.end)
    }
    // Separate identifiers and operators that would otherwise merge
    if (!output.endsWith("\n") && ((/[\p{ID_Continue}$]$/u.test(previous) && /^[\p{ID_Continue}$]/u.test(token)) || (/[+\-*/<>=!&|?%^~]$/.test(previous) && /^[+\-*/<>=!&|?%^~]/.test(token)) || (previous.endsWith("/") && /^[\p{ID_Continue}$]/u.test(token)) || (/\d$/.test(previous) && token.startsWith("."))))
      output += " "
    output += token
    previous = token
  }
  return output.trim() + "\n"
}

/** Detect annotations that refer to imported runtime models. */
function uses(node: ts.Node, models: ReadonlySet<string>): boolean {
  if (ts.isTypeReferenceNode(node) && models.has(node.typeName.getText()))
    return true
  let found = false
  node.forEachChild((child) => {
    found ||= uses(child, models)
  })
  return found
}

/** Replace model type references with Zod input or output types. */
function annotation(node: ts.Node, models: ReadonlySet<string>, mode: "input" | "output"): string {
  // Replace model type references without modifying user value expressions
  const source = node.getSourceFile()
  const start = node.getStart(source)
  let output = node.getText(source)
  const replacements = [] as { start: number; end: number; text: string }[]
  const visit = (node: ts.Node): void => {
    if (ts.isTypeReferenceNode(node) && models.has(node.typeName.getText(source))) {
      replacements.push({ start: node.getStart(source) - start, end: node.end - start, text: `_schema.is.${mode}<typeof ${node.typeName.getText(source)}>` })
      return
    }
    node.forEachChild(visit)
  }
  visit(node)
  for (const replacement of replacements.sort((a, b) => b.start - a.start))
    output = output.slice(0, replacement.start) + replacement.text + output.slice(replacement.end)
  return output
}

/** Compile a supported TypeScript type expression into a runtime schema. */
function expression(node: ts.TypeNode, models: ReadonlySet<string>, bounds: ReadonlyMap<string, ts.TypeNode> = new Map()): string {
  // Preserve wrappers and primitive members of schema-backed compound types
  if (ts.isParenthesizedTypeNode(node) || ts.isTypeOperatorNode(node))
    return expression(node.type, models, bounds)
  if (ts.isArrayTypeNode(node))
    return `_schema.is.array(${expression(node.elementType, models, bounds)})`
  if (ts.isLiteralTypeNode(node)) {
    if (node.literal.kind === ts.SyntaxKind.NullKeyword)
      return "_schema.is.null()"
    return `_schema.is.literal(${node.literal.getText()})`
  }
  const primitive = new Map([[ts.SyntaxKind.StringKeyword, "string"], [ts.SyntaxKind.NumberKeyword, "number"], [ts.SyntaxKind.BooleanKeyword, "boolean"], [ts.SyntaxKind.BigIntKeyword, "bigint"]])
  if (primitive.has(node.kind))
    return `_schema.is.${primitive.get(node.kind)}()`
  if ([ts.SyntaxKind.VoidKeyword, ts.SyntaxKind.UndefinedKeyword].includes(node.kind))
    return "_schema.absent()"
  if (ts.isUnionTypeNode(node))
    return `_schema.union([${node.types.map((type) => expression(type, models, bounds)).join(",")}])`
  if (ts.isIntersectionTypeNode(node))
    return node.types.map((type) => expression(type, models, bounds)).reduce((left, right) => `_schema.intersect(${left},${right})`)
  // Resolve properties and object literals without inspecting SQL
  if (ts.isIndexedAccessTypeNode(node)) {
    if (!ts.isLiteralTypeNode(node.indexType) || (!ts.isStringLiteral(node.indexType.literal) && !ts.isNumericLiteral(node.indexType.literal)))
      throw new SyntaxError(`Schema indexing requires a literal property: ${node.getText()}`)
    return `_schema.field(${expression(node.objectType, models, bounds)},${node.indexType.literal.getText()})`
  }
  if (ts.isTypeLiteralNode(node)) {
    const properties = node.members.map((member) => {
      if (!ts.isPropertySignatureDeclaration(member) || !member.type || !member.name || ts.isComputedPropertyName(member.name))
        throw new SyntaxError(`Unsupported schema property: ${member.getText()}`)
      const name = ts.isIdentifier(member.name) || ts.isStringLiteral(member.name) ? member.name.text : member.name.getText()
      return `${JSON.stringify(name)}: ${expression(member.type, models, bounds)}${member.questionToken ? ".optional()" : ""}`
    })
    return `_schema.is.object({${properties.join(",")}})`
  }
  // Map explicitly supported TypeScript combinators to schema operations
  if (ts.isTypeReferenceNode(node)) {
    const name = node.typeName.getText()
    if (bounds.has(name))
      return `_schema.loose(${expression(bounds.get(name)!, models, bounds)})`
    if (models.has(name))
      return name
    const args = node.typeArguments ?? []
    if (name === "Date")
      return "_schema.is.date()"
    if (name === "Readonly" && args.length)
      return `${expression(args[0], models, bounds)}.readonly()`
    if (["Pick", "Omit", "Partial"].includes(name) && args.length) {
      const keys = args[1] ? literals(args[1]) : []
      return `_schema.project(${expression(args[0], models, bounds)},${JSON.stringify(name.toLowerCase())},${JSON.stringify(keys)})`
    }
    if (["Optional", "Voidable", "Nullable", "Array", "ReadonlyArray", "NonEmptyArray", "Arrayable", "Promise", "Promisable", "Awaited", "NonVoid"].includes(name) && args.length) {
      const inner = expression(args[0], models, bounds)
      if (["Optional", "Voidable"].includes(name))
        return `${inner}.optional()`
      if (name === "Nullable")
        return `${inner}.nullable()`
      if (["Array", "ReadonlyArray", "NonEmptyArray"].includes(name))
        return `${inner}.array()${name === "NonEmptyArray" ? ".min(1)" : ""}`
      if (name === "Arrayable")
        return `_schema.union([${inner},${inner}.array()])`
      return inner
    }
  }
  if (uses(node, new Set([...models, ...bounds.keys()])))
    throw new SyntaxError(`Unsupported schema type expression: ${node.getText()}`)
  return "_schema.unchecked()"
}

/** Read a literal key union used by Pick and Omit. */
function literals(node: ts.TypeNode): string[] {
  if (ts.isUnionTypeNode(node))
    return node.types.flatMap(literals)
  if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal))
    return [node.literal.text]
  throw new SyntaxError(`Schema Pick/Omit keys must be string literals: ${node.getText()}`)
}

/** A hook directive parsed from a SQL comment. */
type directive = { phase: "pre" | "post"; text: string }

/** Own one native compiler session and its virtual sources. */
class Compiler implements AsyncDisposable {
  /** Virtual source path. */
  #path = resolve(".database-generator/query.ts")
  /** Current source contents. */
  #text = ""
  /** Current native project. */
  #project?: Project
  /** Native compiler restricted to an in-memory filesystem. */
  #api = new API({ cwd: resolve(".database-generator"), fs: {
    readFile: (path) => path === this.#path ? this.#text : null,
    fileExists: (path) => path === this.#path,
    directoryExists: () => true,
    getAccessibleEntries: () => ({ files: [], directories: [] }),
  } })

  /** Parse virtual TypeScript and optionally report syntax errors. */
  async parse(text: string, check = true): Promise<ts.SourceFile> {
    this.#text = text
    const snapshot = await this.#api.updateSnapshot({ openFiles: [this.#path], fileChanges: { changed: [this.#path] } })
    this.#project = (await snapshot.getDefaultProjectForFile(this.#path))!
    const source = (await this.#project.program.getSourceFile(this.#path))!
    if (check) {
      const diagnostics = await this.#project.program.getSyntacticDiagnostics(this.#path)
      if (diagnostics.length)
        throw new SyntaxError(diagnostics[0].text)
    }
    return source
  }

  /** Print a module using the native compiler. */
  async print(source: ts.SourceFile): Promise<string> {
    return await this.#project!.emitter.printNode(source)
  }

  /** Release snapshots and the native compiler process. */
  async [Symbol.asyncDispose](): Promise<void> {
    await this.#api.close()
  }
}
