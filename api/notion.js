export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Support both POST body and query params
  let databaseId;
  
  if (req.method === 'POST' && req.body && req.body.databaseId) {
    databaseId = req.body.databaseId;
  } else if (req.query.database) {
    const databases = {
      calendar: '2f042fe32264805caeced964c5c1228e',
      notes: '2f042fe32264809297d6f75dfd050fa0',
      boh: '2f142fe3226481529630f2c86425ece8'
    };
    databaseId = databases[req.query.database];
  }

  if (!databaseId) {
    return res.status(400).json({ 
      error: 'Missing databaseId' 
    });
  }

  try {
    let allResults = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const body = { page_size: 100 };
      if (startCursor) body.start_cursor = startCursor;

      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Notion API error:', response.status, errorText);
        return res.status(response.status).json({ 
          error: `Notion API error: ${response.status}`,
          details: errorText 
        });
      }

      const data = await response.json();
      allResults = allResults.concat(data.results);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
      
      if (allResults.length >= 5000) {
        hasMore = false;
      }
    }

    console.log(`Fetched ${allResults.length} total records from database ${databaseId}`);

    return res.status(200).json({ 
      results: allResults,
      count: allResults.length
    });
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
