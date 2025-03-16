// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Load environment variables
dotenv.config();

// Check if required env variables are set
if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('HUGGINGFACE_API_KEY is missing in .env file');
}

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Configure CORS to allow requests from your React app
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Middleware for parsing JSON
app.use(express.json());

// Endpoint for Hugging Face recommendations
app.post('/api/huggingface-recommendations', async (req, res) => {
  console.log('Received recommendation request');
  
  try {
    const { dogData, foodType, calculatedPortion, language } = req.body;
    
    // Log the request data (without sensitive info)
    console.log('Request data:', {
      dog: `${dogData.breed}, ${dogData.weight}kg`,
      foodType,
      language
    });
    
    // Choose an appropriate model
    const model = language === 'uk' 
      ? "Helsinki-NLP/opus-mt-en-uk" // Model with Ukrainian language support
      : "google/flan-t5-large";      // General purpose model for English
    
    // Create prompt in the appropriate language
    const prompt = language === 'uk' 
      ? `Створи рекомендації щодо харчування для собаки з наступними характеристиками:
        Ім'я: ${dogData.name}
        Порода: ${dogData.breed}
        Вага: ${dogData.weight} кг
        Рівень активності: ${dogData.activityLevel}
        Тип корму: ${foodType}
        Денна кількість корму: ${calculatedPortion.dailyAmount} грам
        Кількість прийомів їжі: ${calculatedPortion.mealCount}
        
        Надай п'ять секцій:
        1. Основні рекомендації з годівлі
        2. Поради щодо рівня активності
        3. Особливості для породи собаки
        4. Рекомендації для обраного типу корму
        5. Загальні поради щодо здоров'я
        
        Формат відповіді має бути HTML з тегами <h4> для заголовків та <ul> з <li> для списків.`
      : `Create nutrition recommendations for a dog with these characteristics:
        Name: ${dogData.name}
        Breed: ${dogData.breed}
        Weight: ${dogData.weight} kg
        Activity Level: ${dogData.activityLevel}
        Food Type: ${foodType}
        Daily Food Amount: ${calculatedPortion.dailyAmount} grams
        Meals Per Day: ${calculatedPortion.mealCount}
        
        Provide five sections:
        1. Basic feeding recommendations
        2. Activity level considerations
        3. Breed-specific advice
        4. Food type recommendations
        5. General health tips
        
        Format the response in HTML with <h4> tags for section headings and <ul> with <li> for bullet points.`;
    
    console.log(`Making request to Hugging Face API using ${model} model...`);
    
    // Make request to Hugging Face API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      throw new Error(`API returned status ${response.status}: ${errorText}`);
    }
    
    // Get response from API
    const result = await response.json();
    console.log('Hugging Face API response received');
    
    // Process response based on model used
    let finalRecommendations;
    
    if (Array.isArray(result) && result[0].generated_text) {
      // Format for flan-t5 and similar models
      finalRecommendations = result[0].generated_text;
    } else if (result.generated_text) {
      // Some models return a different format
      finalRecommendations = result.generated_text;
    } else {
      console.log('Unexpected API response format:', result);
      // If response format is unexpected, convert it to string and wrap in HTML
      finalRecommendations = `<div>${JSON.stringify(result)}</div>`;
    }
    
    // Format the recommendations as HTML if needed
    if (!finalRecommendations.includes('<h4>') && !finalRecommendations.includes('<ul>')) {
      // If the API didn't return HTML formatted text, format it
      const paragraphs = finalRecommendations.split('\n\n');
      
      finalRecommendations = `
        <div>
          <h4 class="font-semibold mb-3">${language === 'uk' ? 'Рекомендації щодо харчування' : 'Nutrition Recommendations'}</h4>
          <ul class="list-disc pl-5 mb-4 space-y-1">
            ${paragraphs.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    
    // Send the processed recommendations to the client
    res.json({ recommendations: finalRecommendations });
    
  } catch (error) {
    console.error('Error with Hugging Face API:', error);
    
    // Generate fallback recommendations on the server
    const { dogData, foodType, calculatedPortion, language } = req.body;
    const fallbackRecommendations = generateFallbackRecommendations(
      dogData, 
      foodType, 
      calculatedPortion, 
      language
    );
    
    // Send fallback recommendations with error info
    res.json({ 
      recommendations: fallbackRecommendations,
      error: error.message,
      fallback: true
    });
  }
});

// Fallback recommendation generator function
function generateFallbackRecommendations(dogData, foodType, calculatedPortion, language) {
  const isUkrainian = language === 'uk';
  const { name, breed, weight, activityLevel } = dogData;
  const { dailyAmount, mealCount } = calculatedPortion;
  
  // Basic recommendations for all dogs
  const basicRecs = isUkrainian ? [
    `Для собаки породи ${breed} з вагою ${weight} кг рекомендована денна норма становить ${dailyAmount} грам ${foodType}.`,
    `Розділіть на ${mealCount} прийоми їжі на день для кращого засвоєння.`,
    `Переконайтесь, що ${name} завжди має доступ до свіжої води.`,
    `Вводьте будь-які зміни в раціон поступово, протягом 7-10 днів.`
  ] : [
    `For a ${breed} weighing ${weight} kg, the recommended daily amount is ${dailyAmount} grams of ${foodType}.`,
    `Divide into ${mealCount} meals per day for better digestion.`,
    `Make sure ${name} always has access to fresh water.`,
    `Introduce any diet changes gradually over 7-10 days.`
  ];
  
  // Activity level specific recommendations
  let activityRecs = [];
  if (activityLevel === 'high') {
    activityRecs = isUkrainian ? [
      `Для високоактивних собак важливо забезпечити достатню кількість білка для відновлення м'язів.`,
      `В дні інтенсивних фізичних навантажень можна збільшити порцію на 10-15%.`
    ] : [
      `For highly active dogs, it's important to provide enough protein for muscle recovery.`,
      `On days with intense physical activity, you can increase the portion by 10-15%.`
    ];
  } else if (activityLevel === 'low') {
    activityRecs = isUkrainian ? [
      `При низькій активності важливо контролювати калорійність раціону, щоб запобігти набору зайвої ваги.`,
      `Регулярні короткі прогулянки допоможуть підтримувати здоров'я та нормальну вагу.`
    ] : [
      `With low activity, it's important to control caloric intake to prevent weight gain.`,
      `Regular short walks will help maintain health and normal weight.`
    ];
  } else {
    activityRecs = isUkrainian ? [
      `При помірній активності важливо підтримувати баланс між споживанням і витратою енергії.`,
      `Регулярний моніторинг ваги допоможе коригувати порції за необхідності.`
    ] : [
      `With moderate activity, it's important to maintain a balance between energy intake and expenditure.`,
      `Regular weight monitoring will help adjust portions if necessary.`
    ];
  }
  
  // Food type specific recommendations
  let foodRecs = [];
  if (foodType.includes(isUkrainian ? 'Сухий' : 'Dry')) {
    foodRecs = isUkrainian ? [
      `Сухий корм слід зберігати у герметичному контейнері для збереження свіжості.`,
      `При годуванні сухим кормом переконайтесь, що собака має достатньо води.`
    ] : [
      `Dry food should be stored in an airtight container to maintain freshness.`,
      `When feeding dry food, ensure your dog has plenty of water.`
    ];
  } else if (foodType.includes(isUkrainian ? 'Вологий' : 'Wet')) {
    foodRecs = isUkrainian ? [
      `Відкритий вологий корм слід зберігати в холодильнику і використати протягом 1-2 днів.`,
      `Вологий корм не слід залишати в мисці більше ніж на 2 години.`
    ] : [
      `Opened wet food should be stored in the refrigerator and used within 1-2 days.`,
      `Wet food should not be left in the bowl for more than 2 hours.`
    ];
  }
  
  // Health recommendations
  const healthRecs = isUkrainian ? [
    `Регулярно відвідуйте ветеринара для перевірки здоров'я та коригування раціону за необхідності.`,
    `Слідкуйте за реакцією ${name} на корм - енергійність, якість калу, стан шкіри та шерсті.`,
    `Регулярно чистіть зуби собаки, щоб запобігти утворенню зубного нальоту та захворюванням ясен.`
  ] : [
    `Visit your veterinarian regularly to check health and adjust diet if necessary.`,
    `Monitor ${name}'s reaction to food - energy levels, stool quality, skin and coat condition.`,
    `Regularly clean your dog's teeth to prevent plaque buildup and gum disease.`
  ];
  
  // Combine all recommendations in HTML format
  return `
    <div>
      <h4 class="font-semibold mb-3">${isUkrainian ? 'Основні рекомендації' : 'Basic Recommendations'}</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        ${basicRecs.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
      
      <h4 class="font-semibold mb-3">${isUkrainian ? 'З огляду на активність' : 'Activity Considerations'}</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        ${activityRecs.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
      
      <h4 class="font-semibold mb-3">${isUkrainian ? 'Рекомендації щодо типу корму' : 'Food Type Guidelines'}</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        ${foodRecs.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
      
      <h4 class="font-semibold mb-3">${isUkrainian ? 'Загальні поради щодо здоров\'я' : 'General Health Tips'}</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        ${healthRecs.map(rec => `<li>${rec}</li>`).join('')}
      </ul>
      
      <p class="text-sm italic text-gray-500">${isUkrainian ? 
        'Примітка: Це локально згенеровані рекомендації через недоступність API. Для більш персоналізованих порад зверніться до ветеринара.' : 
        'Note: These are locally generated recommendations due to API unavailability. For more personalized advice, consult your veterinarian.'}</p>
    </div>
  `;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Hugging Face API key ${process.env.HUGGINGFACE_API_KEY ? 'is' : 'is NOT'} configured`);
});