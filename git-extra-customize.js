// This are the customization rules for use by the jlyonsmith/git-extra tool

var params = await ui.prompts([
  {
    name: "projectName",
    message: "Project name?",
    regex: "[a-z-][a-z0-9-]*",
    error: "Name must be supplied and be in param-case (all lowercase)",
  },
  {
    name: "gitUser",
    message: "GitHub user name?",
    regex: "^[a-zd](?:[a-zd]|-(?=[a-zd])){0,38}$", // From https://github.com/shinnn/github-username-regex
    error: "Must be a valid GitHub user name",
  },
])

params.projectName += "-tool"
params.projectNamePascal = name.pascal(params.projectName)

let someToolBaseJs = await fs.readFile("src/some-tool.js")
let someToolJs = await fs.readFile("src/SomeTool.js")
let someToolTestJs = await fs.readFile("src/SomeTool.test.js")
let packageJson = await fs.readFile("package.json")

someToolBaseJs = someToolBaseJs.replace(/SomeTool/g, params.projectNamePascal)
someToolJs = someToolJs.replace(/SomeTool/g, params.projectNamePascal)
someToolTestJs = someToolTestJs
  .replace(/some-tool/g, params.projectName)
  .replace(/SomeTool/g, params.projectNamePascal)
packageJson = packageJson
  .replace(/some-tool/g, params.projectName)
  .replace(/some-user/g, params.gitUser)

await fs.writeFile(path.join("src", params.projectName + ".js"), someToolBaseJs)
await fs.writeFile(
  path.join("src", params.projectNamePascal + ".js"),
  someToolJs
)
await fs.writeFile(
  path.join("src", params.projectNamePascal + ".test.js"),
  someToolTestJs
)
await fs.writeFile("package.json", packageJson)

await fs.remove("src/SomeTool.js")
await fs.remove("src/SomeTool.test.js")
await fs.remove("src/some-tool.js")

await fs.mkdir("scratch")
await fs.ensureFile("scratch/.gitkeep")
await git.forceAdd("scratch/.gitkeep")

await fs.mkdir(".vscode")

const launchJson = `{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "cwd": "$\{workspaceFolder\}",
      "type": "node",
      "request": "launch",
      "name": "Run Tool",
      "skipFiles": ["<node_internals>/**"],
      "runtimeExecutable": "$\{workspaceFolder\}/node_modules/.bin/babel-node",
      "program": "$\{workspaceFolder\}/src/${params.projectName}.js",
      "args": ["--help"],
      "runtimeArgs": ["--nolazy"],
      "env": {
        "BABEL_ENV": "debug"
      }
    }
  ]
}`

await fs.writeFile(".vscode/launch.json", launchJson)
