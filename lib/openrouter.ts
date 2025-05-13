const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function convertToStructuredQuery(userInput: string): Promise<any> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  const prompt = `User search request: "${userInput}"

Convert this to JSON with this structure only:
{"action":"restaurant_search","parameters":{"query":"food","near":"location","price":"1-4","open_now":true/false}}

No explanations. No markdown.`;

  try {
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Restaurant Finder'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response format:", data);
      throw new Error('Invalid response format from OpenRouter');
    }
    
    const content = data.choices[0].message.content;
    
    let jsonString = content
    .replace(/```json|```/g, '')
    .split('\n')              
    .map((line: string) => line.trim())   
    .filter((line: string) => line !== '') 
    .join(' ')                
    .trim();
  
  const jsonMatch = jsonString.match(/\{.*\}/);
  if (jsonMatch) {
    jsonString = jsonMatch[0];
  } else {
    console.error('No valid JSON found in response:', content);
    throw new Error('No valid JSON found in LLM response');
  }
    
    try {
      const parsedJson = JSON.parse(jsonString);
      return parsedJson;
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      console.error('JSON string:', jsonString);
      throw new Error('Failed to parse LLM response as JSON');
    }
    
  } catch (error) {
    console.error("Error in convertToStructuredQuery:", error);
    throw error;
  }
} 