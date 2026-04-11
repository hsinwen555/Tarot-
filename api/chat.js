export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { prompt } = req.body;
    const key = process.env.GROQ_KEY;
    
    if (!key) {
        return res.status(500).json({ error: 'GROQ_KEY not set' });
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1000
            })
        });
        const data = await response.json();
        console.log('Groq response:', JSON.stringify(data));
        res.status(200).json(data);
    } catch(e) {
        console.error('Error:', e.message);
        res.status(500).json({ error: e.message });
    }
}
