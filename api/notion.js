// Vercel Serverless Function for Notion API
// This keeps your Notion token secure on the server side

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { databaseId } = req.body;

    if (!databaseId) {
        return res.status(400).json({ error: 'Missing databaseId in request body' });
    }

    const NOTION_TOKEN = process.env.NOTION_TOKEN;

    if (!NOTION_TOKEN) {
        console.error('NOTION_TOKEN environment variable is not set');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Notion API error:', response.status, errorText);
            return res.status(response.status).json({ 
                error: 'Notion API error', 
                status: response.status,
                details: errorText 
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching from Notion:', error);
        return res.status(500).json({ error: 'Failed to fetch from Notion', details: error.message });
    }
}
