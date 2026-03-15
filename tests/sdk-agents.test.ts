import { describe, expect, test } from "bun:test";
import { AnthropicAgent, OpenAIAgent } from "../src/agents";

function createFakeModel() {
  let lastCall: any;
  return {
    model: {
      specificationVersion: "v3" as const,
      provider: "test-provider",
      modelId: "fake-model",
      get supportedUrls() {
        return {};
      },
      async doGenerate(options: any) {
        lastCall = options;
        return {
          content: [{ type: "text", text: "hello from sdk agent" }],
          finishReason: "stop",
          usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
          warnings: [],
        };
      },
      async doStream() {
        throw new Error("stream not implemented in test");
      },
    },
    getLastCall() {
      return lastCall;
    },
  };
}

describe("SDK agents", () => {
  test("AnthropicAgent accepts a prebuilt model and preserves instructions", async () => {
    const fake = createFakeModel();
    const agent = new AnthropicAgent({
      id: "anthropic-sdk",
      model: fake.model as any,
      instructions: "You are a reviewer.",
    });

    const result = await agent.generate({ prompt: "review this file" });

    expect(result.text).toBe("hello from sdk agent");
    expect(fake.getLastCall()?.prompt?.[0]?.role).toBe("system");
    expect(fake.getLastCall()?.prompt?.[0]?.content).toBe(
      "You are a reviewer.",
    );
  });

  test("OpenAIAgent accepts a prebuilt model and preserves instructions", async () => {
    const fake = createFakeModel();
    const agent = new OpenAIAgent({
      id: "openai-sdk",
      model: fake.model as any,
      instructions: "You are an implementer.",
    });

    const result = await agent.generate({ prompt: "write the patch" });

    expect(result.text).toBe("hello from sdk agent");
    expect(fake.getLastCall()?.prompt?.[0]?.role).toBe("system");
    expect(fake.getLastCall()?.prompt?.[0]?.content).toBe(
      "You are an implementer.",
    );
  });
});
