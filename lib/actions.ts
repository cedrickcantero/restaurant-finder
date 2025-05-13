"use server"

import type { Restaurant } from "@/lib/types"
import { processWithLLM } from "@/lib/llm"
import { searchFoursquare } from "@/lib/foursquare"

export async function executeSearch(query: string): Promise<Restaurant[]> {
  try {
    const llmResponse = await processWithLLM(query)

    const restaurants = await searchFoursquare(llmResponse)

    return restaurants
  } catch (error) {
    console.error("Error executing search:", error)
    throw new Error("Failed to process search request")
  }
}
