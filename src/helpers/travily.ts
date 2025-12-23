// lib/tavily.ts
export async function tavilySearch(query: string) {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 5,
      include_answer: false,
    }),
  });

  const data = await res.json();

  return data.results
    .map(
      (r: any, i: number) =>
        `Source ${i + 1}:\n${r.content}`
    )
    .join("\n\n");
}
