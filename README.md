# 🍱 Libraries

[![JSR Scope](https://jsr.io/badges/@libs)](https://jsr.io/@libs)

This is a collection of carefully crafted _TypeScript_ libraries. These try to be minimal, unbloated and convenient.

Most of them are written with [deno](https://deno.com) in mind, but most packages in this repository honors [web standards](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/The_web_and_web_standards) which means they can be used with other runtimes such
as [Node.js](https://nodejs.org), [bun](https://bun.sh) and even browsers.

<table>
  <tr>
    <th>
      Package
    </th>
    <th>
      Compatibility
    </th>
    <th>
      Features
    </th>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/bundle"><code>📦 @libs/bundle</code></a><br>
      <a href="https://jsr.io/@libs/bundle"><img src="https://jsr.io/badges/@libs/bundle"></a>
      <a href="https://libs-coverage.lecoq.io/bundle"><img src="https://libs-coverage.lecoq.io/bundle/badge.svg"></a>
      <a href="https://dash.deno.com/playground/libs-bundle"><img src="https://img.shields.io/badge/Playground--black?style=flat&logo=deno&labelColor=black"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg">
    </td>
    <td>
      <ul>
        <li>
          Lint, minify and add a banner to CSS code
          <ul>
            <li>Generate CSS features compatibility report against MDN data for selected browsers</li>
          </ul>
        </li>
        <li>
          Bundle, minify, anonymize local file paths and a banner to TypeScript code
          <ul>
            <li>Improve coverage reports generated with <code>deno coverage</code> with syntax highlightinh and better styling thanks to <a href="https://github.com/lowlighter/matcha">matcha.css</a></li>
          </ul>
        </li>
        <li>
          Compile rust project to Web assembly using <code>wasm-pack</code> and hot-patch source in base64 to avoid <code>--allow-read</code> permissions and minify output
        </li>
        <li>Also provide <a href="#-cli-utilities">CLI utilities</a></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/crypto"><code>🧮 @libs/crypto</code></a><br>
      <a href="https://jsr.io/@libs/crypto"><img src="https://jsr.io/badges/@libs/crypto"></a>
      <a href="https://libs-coverage.lecoq.io/crypto"><img src="https://libs-coverage.lecoq.io/crypto/badge.svg"></a>
      <a href="https://dash.deno.com/playground/libs-crypto"><img src="https://img.shields.io/badge/Playground--black?style=flat&logo=deno&labelColor=black"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg"><img height="18px" src="https://jsr.io/logos/node.svg"><img height="18px" src="https://jsr.io/logos/cloudflare-workers.svg"><img height="18px" src="https://jsr.io/logos/bun.svg"><img height="18px" src="https://jsr.io/logos/browsers.svg">
    </td>
    <td>
      <ul>
        <li>
          Encrypt and decrypt data using a seed-salt derived private key
        </li>
        <li>
          Generate time-based OTP secret key and verify tokens validity
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/diff"><code>➕ @libs/diff</code></a><br>
      <a href="https://jsr.io/@libs/diff"><img src="https://jsr.io/badges/@libs/diff"></a>
      <a href="https://libs-coverage.lecoq.io/diff"><img src="https://libs-coverage.lecoq.io/diff/badge.svg"></a>
      <a href="https://dash.deno.com/playground/libs-diff"><img src="https://img.shields.io/badge/Playground--black?style=flat&logo=deno&labelColor=black"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg"><img height="18px" src="https://jsr.io/logos/node.svg"><img height="18px" src="https://jsr.io/logos/cloudflare-workers.svg"><img height="18px" src="https://jsr.io/logos/bun.svg"><img height="18px" src="https://jsr.io/logos/browsers.svg">
    </td>
    <td>
      <ul>
        <li>
          Compute unified patch between two string
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/logger"><code>📰 @libs/logger</code></a><br>
      <a href="https://jsr.io/@libs/logger"><img src="https://jsr.io/badges/@libs/logger"></a>
      <a href="https://libs-coverage.lecoq.io/logger"><img src="https://libs-coverage.lecoq.io/logger/badge.svg"></a>
      <a href="https://dash.deno.com/playground/libs-logger"><img src="https://img.shields.io/badge/Playground--black?style=flat&logo=deno&labelColor=black"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg"><img height="18px" src="https://jsr.io/logos/node.svg"><img height="18px" src="https://jsr.io/logos/cloudflare-workers.svg"><img height="18px" src="https://jsr.io/logos/bun.svg"><img height="18px" src="https://jsr.io/logos/browsers.svg">
    </td>
    <td>
      <ul>
        <li>
          Simple logger library with configurable log level
          <ul>
            <li>Support date, time and delta stamps</li>
            <li>Support caller info (file, name, line) using internal V8's <code>Error.prepareStackTrace</code> API</li>
          </ul>
        </li>
        <li>
          Automatically reads <code>LOG_LEVEL</code> environment variable (if available)
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/qrcode"><code>🔳 @libs/qrcode</code></a><br>
      <a href="https://jsr.io/@libs/qrcode"><img src="https://jsr.io/badges/@libs/qrcode"></a>
      <a href="https://libs-coverage.lecoq.io/qrcode"><img src="https://libs-coverage.lecoq.io/qrcode/badge.svg"></a>
      <a href="https://dash.deno.com/playground/libs-qrcode"><img src="https://img.shields.io/badge/Playground--black?style=flat&logo=deno&labelColor=black"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg"><img height="18px" src="https://jsr.io/logos/node.svg"><img height="18px" src="https://jsr.io/logos/cloudflare-workers.svg"><img height="18px" src="https://jsr.io/logos/bun.svg"><img height="18px" src="https://jsr.io/logos/browsers.svg">
    </td>
    <td>
      <ul>
        <li>
          Generate QR codes without external dependencies
        </li>
        <li>
          Support console, array and SVG output (with customizable colors)
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/reactive"><code>🎯 @libs/reactive</code></a><br>
      <a href="https://jsr.io/@libs/reactive"><img src="https://jsr.io/badges/@libs/reactive"></a>
      <a href="https://libs-coverage.lecoq.io/reactive"><img src="https://libs-coverage.lecoq.io/reactive/badge.svg"></a>
      <a href="https://dash.deno.com/playground/libs-reactive"><img src="https://img.shields.io/badge/Playground--black?style=flat&logo=deno&labelColor=black"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg"><img height="18px" src="https://jsr.io/logos/node.svg"><img height="18px" src="https://jsr.io/logos/cloudflare-workers.svg"><img height="18px" src="https://jsr.io/logos/bun.svg"><img height="18px" src="https://jsr.io/logos/browsers.svg">
    </td>
    <td>
      <ul>
        <li>
          Create observable contexts to track get, set, delete and call operations
        </li>
        <li>
          Support inherited contexts
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/testing"><code>🧪 @libs/testing</code></a><br>
      <a href="https://jsr.io/@libs/testing"><img src="https://jsr.io/badges/@libs/testing"></a>
      <a href="https://libs-coverage.lecoq.io/testing"><img src="https://libs-coverage.lecoq.io/testing/badge.svg"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg">
    </td>
    <td>
      <ul>
        <li>
          Cross-runtime testing framework
          <ul>
            <li>Support <a href="https://deno.com">deno</a> natively</li>
            <li>Support <a href="https://nodejs.org">Node.js</a> through <code>npx tsx --test</code></li>
            <li>Support <a href="https://bun.sh">bun</a> through <code>bun test</code></li>
          </ul>
        </li>
        <li>
          Automatically skip test cases when runtime is not available on current platform
        </li>
      </ul>
      <i>Note: although tests are run on multiple runtimes, this library <b>must</b> be run on deno</i>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://jsr.io/@libs/typing"><code>🧰 @libs/typing</code></a><br>
      <a href="https://jsr.io/@libs/typing"><img src="https://jsr.io/badges/@libs/typing"></a>
      <a href="https://libs-coverage.lecoq.io/typing"><img src="https://libs-coverage.lecoq.io/typing/badge.svg"></a>
    </td>
    <td>
      <img height="18px" src="https://jsr.io/logos/deno.svg"><img height="18px" src="https://jsr.io/logos/node.svg"><img height="18px" src="https://jsr.io/logos/cloudflare-workers.svg"><img height="18px" src="https://jsr.io/logos/bun.svg"><img height="18px" src="https://jsr.io/logos/browsers.svg">
    </td>
    <td>
      <ul>
        <li>
          Utility types such as <code>Promisable</code>, <code>Nullable</code>, <code>MapKey</code>, <code>MapValue</code>, <code>SetValue</code>, etc.
        </li>
      </ul>
    </td>
  </tr>
</table>

> [!TIP]\
> You can click on a JSR badge to access the package page and on a coverage badge to access the coverage report.

## 🧑‍💻 Cli utilities

A set of useful CLI scripts are also provided. Please note that these can only be run on deno runtime.

### TypeScript code coverage enhancer

Enhance coverage reports generated with `deno coverage` by adding syntax highlighting and better styling thanks to [matcha.css](https://github.com/lowlighter/matcha).

```sh
deno run jsr:@libs/bundle/ts/cli/coverage --help
```

### CSS formatter

Format CSS code similarly to `prettier` or `deno fmt`. Can be used with `--check` to validate that CSS code is correctly formatted.

```sh
deno run jsr:@libs/bundle/css/cli/fmt --help
```

### CSS features compatibility checker

Print compatibility report for CSS features against MDN data for selected browsers.

```sh
deno run jsr:@libs/bundle/css/cli/check --help
```

### Web assembly builder

Compile a rust project to Web assembly and minify output.

```sh
deno run jsr:@libs/bundle/wasm/cli/build --help
```

## 📜 License

This work is licensed under the [MIT License](./LICENSE).

If you include a significant part of it in your own project, _**you should keep the license notice**_ with it, including the mention of the additional original authors if any.

> [!IMPORTANT]\
> Love these bytes ? Consider [`💝 sponsoring me`](https://github.com/sponsors/lowlighter), even one-time contributions are greatly appreciated !
