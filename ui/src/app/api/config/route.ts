import { getLLMConfig } from "@/lib/llm/factory";

export const GET = () => {
  const { baseUrl, model } = getLLMConfig();
  return Response.json({ baseUrl, model });
};
