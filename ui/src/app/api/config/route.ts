export const GET = () => {
  return Response.json({ model: process.env.LLM_MODEL ?? null });
};
