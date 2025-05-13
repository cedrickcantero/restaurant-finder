import type { LLMResponse } from "@/lib/types"

export async function processWithLLM(query: string): Promise<LLMResponse> {

  const keywords = query.toLowerCase()

  const response: LLMResponse = {
    action: "restaurant_search",
    parameters: {
      query: "",
      near: "Los Angeles",
      price: "",
      open_now: false,
      min_rating: 0,
    },
  }

  // Extract cuisine type
  if (keywords.includes("sushi")) {
    response.parameters.query = "sushi"
  } else if (keywords.includes("pizza")) {
    response.parameters.query = "pizza"
  } else if (keywords.includes("burger")) {
    response.parameters.query = "burger"
  } else if (keywords.includes("mexican")) {
    response.parameters.query = "mexican"
  } else if (keywords.includes("italian")) {
    response.parameters.query = "italian"
  } else {
    response.parameters.query = "restaurant"
  }

  // Extract location
  if (keywords.includes("downtown los angeles")) {
    response.parameters.near = "downtown Los Angeles"
  } else if (keywords.includes("hollywood")) {
    response.parameters.near = "Hollywood, Los Angeles"
  } else if (keywords.includes("santa monica")) {
    response.parameters.near = "Santa Monica"
  }

  // Extract price level
  if (keywords.includes("cheap")) {
    response.parameters.price = "1"
  } else if (keywords.includes("expensive") || keywords.includes("fancy")) {
    response.parameters.price = "4"
  } else if (keywords.includes("moderate")) {
    response.parameters.price = "2"
  }

  // Extract open now
  if (keywords.includes("open now")) {
    response.parameters.open_now = true
  }

  // Extract rating
  if (keywords.includes("5-star") || keywords.includes("5 star")) {
    response.parameters.min_rating = 5
  } else if (keywords.includes("4-star") || keywords.includes("4 star")) {
    response.parameters.min_rating = 4
  } else if (keywords.includes("3-star") || keywords.includes("3 star")) {
    response.parameters.min_rating = 3
  }

  console.log("Generated LLM response:", response)
  return response
}
