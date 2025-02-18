import axios from 'axios';

// API key should be stored in .env for production
const apiKey = 'openai-api-key';

export async function getSynonyms(query: string): Promise<string[]> {
    
    const prompt = `Provide a list of 50 synonyms or closely related words for the term "${query}" in the context of food and cooking. Output the words only with no other text and dont number each word.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o',
            messages: [{ role: "user", content: prompt }],
            max_tokens: 100,
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );
    console.log(response.data);
    return response.data.choices[0].message.content.split('\n').map((word: string) => word.trim());
    // return response.data.choices[0].text.split(',').map((word: string) => word.trim());
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

export async function testOpenAI() {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [{ role: 'user', content: 'Hello!' }],
          max_tokens: 50,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
    }
  }