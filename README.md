# babel-plugin-module-resolver-loader

Webpack loader for the plugin: [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver) by [@Tommy](Tommy)

##### PRs are welcome!

---

1. [Installation](#installation)
2. [Who Needs It](#who-needs-it)
3. [How To Use](#how-to-use)
4. [Typescript Won't Fix It (Soon)](#installation)
5. [Alternative solutions](#alternative-solutions)
6. [Implementation Notes](#implementation-notes)

### Installation

webpack 4+

There shouldn't be any reason to lock you on specific versions on the following packages.
As a result, you must have:

```
"babel-plugin-module-resolver": "^3.2.0",
"@babel/core": "^7.4.4",
"@babel/parser": "^7.4.4"
```

There shouldn't be any problem to have them in older versions. (I didn't verified it).

After that, install: `yarn add --dev @stavalfi/babel-plugin-module-resolver-loader`

---

### Who Needs It

Library creators who uses Typescript will probably want to generate `*.d.ts` files. Incase you are using absolute paths in your code like this:

```typescript
// src/some-file-under-src-folder.ts
export { myType } from 'file-under-src'
```

```typescript
// src/file-under-src.ts
export const myType = number
```

Will encounter a serious problem when they will use 'ts-loader' to generate the `*.d.ts` files because typescript won't transform back those absolute paths to relative paths when generating all the `d.ts` files.

The genrated `*.d.ts` files will be:

```typescript
// dist/file-under-src.d.ts
export declare type myType = number
```

```typescript
// dist/some-file-under-src-folder.d.ts
export { myType } from 'file-under-src'
```

Instead of

```typescript
// dist/some-file-under-src-folder.d.ts
export { myType } from './file-under-src'
```

Q: Why is this a problem?
<br/>
A: Your library consumers can't resolve the given absolute path: `file-under-src` because when typescript compiler will load the file `dist/some-file-under-src-folder.d.ts`, he won't be able to find the module `file-under-src`. Error!

---

### How To Use

You have two options:

1. You can use the example-project folder in this reporisotry to see a real-minimal project use it.
2. Lerna project with lib that produces `*.d.ts` files and a consumer who uses them: https://github.com/stavalfi/lerna-starter
3. Add thiss loader beofre ts-loader:

```javascript
module: {
rules: [
  {
    test: /\.(ts|js)x?$/,
    exclude: /(node_module|dist)/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        loader: 'ts-loader',
      },
      {
        loader: '@stavalfi/babel-plugin-module-resolver-loader',
        options: {
          // all those options will go directly to babel-plugin-module-resolver plugin.
          // Read babel-plugin-module-resolver DOCS to see all options:
          // https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md
          root: ["./src","./node_modules"],
          extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],
        },
      },
    ],
  },
],
}
```

Note1: You want to pass all the options that you passed to tsconfig.json:

```javascript
"baseUrl": ".",
"paths": {
  "*": ["src","node_modules"]
},
```

Note2: The default `extensions` doesn't ionclude typescript extentions so we overrire them.

---

### Typescript Won't Fix It (Soon)

From [https://github.com/Microsoft/TypeScript/issues/15479](https://github.com/Microsoft/TypeScript/issues/15479):

[@RyanCavanaugh](https://github.com/RyanCavanaugh)

> Our general take on this is that you should write the import path that works at runtime, and set your TS flags to satisfy the compiler's module resolution step, rather than writing the import that works out-of-the-box for TS and then trying to have some other step "fix" the paths to what works at runtime.
>
> We have about a billion flags that affect module resolutions already (baseUrl, path mapping, rootDir, outDir, etc). Trying to rewrite import paths "correctly" under all these schemes would be an endless nightmare.

---

### Alternative solutions

1. You can use `ttypescript` transformers so the paths will be converted when typescript compiles the code (before generating the `*.d.ts` files): There are some libraries for that. you can look at here: https://github.com/Microsoft/TypeScript/issues/15479

2. generate one big `*.d.ts` file. There won't be any imports there so all will be good. I couldn't find a working library that does that.

3. Writing multiple/single `*.d.ts` files by your self and copy them to the dist folder after every webpack build. You can use plugins to run some cli commands after every build. it's easy.

4. Use relative imports when you import types in your `*.ts` files under `src` folder.

### Implementation Notes

1. I couldn't use `babel-loader` becuause it uses `@babel/core`'s _transform_ function.

Q: Why is it a problem?
<br/>
A: _transform_ function accepts a code and return the transpiled code. This function create AST from the code, change the AST and then create code from the new AST.
To create the first AST, it needs to recognize typescript code. I couldn't teach him typescript code without also changing the typescript code to js code at the end.
so If you run ts-loader after that, ts-loader will get ts files with pure-js code and complain that everything has any type.

So that leaved me with out much options. I couldn't use `@babel/core`'s _transform_ function also. I must create the AST by my self and do th

The solution is to first create an AST from the code webpack gave me:

```javascript
const ast = parser.parse(source, {
  // source ==== code of a file
  sourceFilename: this.resourcePath, // webpack gives me absolute path of the source file. Maybe I don't need to set this param here.
  babelrc: false,
  sourceType: 'module',
  plugins: ['jsx', 'typescript'], // these plugins are not available in @babel/core.transform function
})
```

so there won't be any transpilation involved.

Then I send this AST directly to the transpilation fucntion (without any extra plugins to transpile anything else bu twhat I want):

```javascript
const coreResult = core.transformFromAstSync(ast, source, {
  filename: this.resourcePath,
  babelrc: false,
  plugins: [['module-resolver', options]],
})
```

The result (the original source code of this loader):

```javascript
const { getOptions } = require('loader-utils')
const core = require('@babel/core')
const parser = require('@babel/parser')

module.exports = function(source) {
  const options = getOptions(this)

  const ast = parser.parse(source, {
    sourceFilename: this.resourcePath,
    babelrc: false,
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const coreResult = core.transformFromAstSync(ast, source, {
    filename: this.resourcePath,
    babelrc: false,
    plugins: [['module-resolver', options]],
  })

  return coreResult.code
}
```
