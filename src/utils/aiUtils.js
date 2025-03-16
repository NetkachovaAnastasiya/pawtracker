// src/utils/aiUtils.js
export const getDogRecommendations = async (dogData, foodCalculation, language) => {
    try {
      // Check if API key exists
      const apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY;
      if (!apiKey) {
        throw new Error("Hugging Face API key is missing. Please check your .env file.");
      }
  
      // Create the language-specific instruction
      const languageInstruction = language === 'uk' 
        ? "Будь ласка, надайте відповідь українською мовою."
        : "Please provide the response in English.";
      
      // Create language-specific section headers
      const sections = language === 'uk'
        ? ["1. Споживання води", "2. Потреби у фізичній активності", "3. Особливості харчування", "4. Поради щодо моніторингу здоров'я"]
        : ["1. Water intake", "2. Exercise needs", "3. Nutritional considerations", "4. Health monitoring tips"];
  
      const prompt = `
        ${languageInstruction}
        
        Generate comprehensive recommendations for a ${dogData.breed} dog.
        
        Dog details:
        - Weight: ${dogData.weight} kg
        - Age: ${dogData.age || 'Unknown'} years
        - Activity level: ${dogData.activityLevel}
        - Daily food portion: ${foodCalculation.daily} grams (${foodCalculation.perMeal} grams per meal, ${foodCalculation.mealCount} meals per day)
        
        Please provide specific recommendations for:
        ${sections.join('\n')}
      `;
  
      console.log("Sending request to Hugging Face API...");
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );
  
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const result = await response.json();
      return result[0].generated_text;
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      throw error;
    }
  };