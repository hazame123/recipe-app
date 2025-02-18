import axios from 'axios';

const apiKey = 'api-key-here';

export async function getSynonyms(query: string): Promise<string[]> {
    
    const prompt = `Provide a list of synonyms or closely related words for the term "${query}" in the context of food and cooking.`;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [{ role: "user", content: prompt }],
            max_tokens: 50,
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );
    console.log(response.data);
    return response.data.choices[0].text.split(',').map((word: string) => word.trim());
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