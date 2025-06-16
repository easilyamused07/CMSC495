import { getOpenAIResponse, parseWithAIOrFallback } from "../openaiService.ts";
describe("openaiService", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("getOpenAIResponse", () => {
    it("returns text on successful fetch", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        text: async () => "AI reply",
      });
      const result = await getOpenAIResponse("prompt");
      expect(result).toBe("AI reply");
      expect(global.fetch).toHaveBeenCalledWith(
        "/completions",
        expect.any(Object)
      );
    });
    it("returns undefined on failed fetch", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const result = await getOpenAIResponse("prompt");
      expect(result).toBeUndefined();
    });
  });
  describe("parseWithAIOrFallback", () => {
    it("returns ai_output on success", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ai_output: ["step1", "step2"] }),
      });
      const steps = await parseWithAIOrFallback("input");
      expect(steps).toEqual(["step1", "step2"]);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/parse",
        expect.any(Object)
      );
    });
    it("returns undefined on exception", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
      const steps = await parseWithAIOrFallback("input");
      expect(steps).toBeUndefined();
    });
  });
});
