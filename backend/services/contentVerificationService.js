const { OpenRouter } = require('@openrouter/sdk');

/**
 * Service to verify if post content is relevant to the Hobby Space theme using Gemini AI.
 */
exports.verifyContent = async (text, mediaUrls, spaceInfo) => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    console.warn('AI_API_KEY not found. Defaulting to relevant.');
    return { isRelevant: true, relevanceScore: 1.0, reason: 'AI verification disabled (no API key)' };
  }
  const openrouter = new OpenRouter({ apiKey });

  try {
    const parts = [];
    // Build prompt for OpenRouter, now including media URLs
    const mediaSection = mediaUrls && mediaUrls.length > 0
      ? `\nMedia URLs uploaded by user:\n${mediaUrls.map((url, i) => `${i + 1}. ${url}`).join('\n')}`
      : '\nNo media uploaded.';

    const prompt = `\nAnalyze if this user post is relevant to the hobby space it was posted in.\nHobby Space: ${spaceInfo.name}\nDescription: ${spaceInfo.description}\n\nUser Post: "${text || 'No text content'}"${mediaSection}\n\nTasks:\n1. Determine if the content (including any uploaded media) is relevant to the hobby.\n2. Spot "junk" posts intended solely to farm points.\n3. If media is present, consider whether the media itself is relevant to the hobby space.\n4. Return a JSON object: { "relevanceScore": number (0-1), "isRelevant": boolean, "reason": string }.\n`;
    try {
      const stream = await openrouter.chat.send({
        chatGenerationParams: {
          model: "openai/gpt-5.4-nano",
          messages: [
            { role: "user", content: prompt }
          ],
          stream: false,
          maxTokens: 1024
        }
      });
      const resultText = stream.choices[0]?.message?.content;
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('AI Verification Error:', error.message);
      return { isRelevant: true, relevanceScore: 0.8, reason: 'AI verification failed, assuming relevant' };
    }
  } catch (error) {
    console.error('AI Verification Error:', error.response?.data || error.message);
    // Fail-safe: allow post if AI fails
    return { isRelevant: true, relevanceScore: 0.8, reason: 'AI verification failed, assuming relevant' };
  }
};
