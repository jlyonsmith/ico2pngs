import { GetFaviconTool } from "./GetFaviconTool"

const toolName = "get-favicon-tool"

function getMockLog() {
  return {
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  }
}

function getOutput(fn) {
  const calls = fn.mock.calls
  if (calls.length > 0 && calls[0].length > 0) {
    return calls[0][0]
  } else {
    return ""
  }
}

test("--help", async (done) => {
  const log = getMockLog()
  const tool = new GetFaviconTool({ toolName, log })

  await expect(tool.run(["--help"])).resolves.toBe(0)
  expect(getOutput(log.info)).toEqual(expect.stringContaining("--help"))
  done()
})

test("--version", async (done) => {
  const log = getMockLog()
  const tool = new GetFaviconTool({ toolName, log })

  await expect(tool.run(["--version"])).resolves.toBe(0)
  expect(getOutput(log.info)).toEqual(expect.stringMatching(/^v/))
  done()
})
