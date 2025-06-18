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
        status: 200,
        statusText: "OK",
        json: async () => ({ response: "AI reply" }), // matches actual usage
      });

      const result = await getOpenAIResponse("prompt");
      expect(result).toBe("AI reply");
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/chat",
        expect.any(Object)
      ); // corrected endpoint
    });
    it("returns error message on failed fetch", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });
      const result = await getOpenAIResponse("prompt");
      expect(result).toBe("Error: 500 Internal Server Error");
    });

    it("returns fallback error message on thrown exception", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
      const result = await getOpenAIResponse("prompt");
      expect(result).toBe("AI call failed.");
    });
  });
  describe("parseWithAIOrFallback", () => {
    it("returns ai_output on success", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        json: async () => ({ ai_output: ["step1", "step2"] }),
      });
      const steps = await parseWithAIOrFallback("input");
      expect(steps).toEqual(["step1", "step2"]);
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/parse",
        expect.any(Object)
      );
    });
    it("returns fallback message on exception", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("fail"));
      const steps = await parseWithAIOrFallback("input");
      expect(steps).toEqual(["Sorry, no instructions found."]);
    });
  });
});
