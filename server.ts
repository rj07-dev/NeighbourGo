import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// In-memory data store for the demo
let requests: any[] = [
  {
    id: 'req-1',
    userName: 'Maria Garcia',
    title: 'Need help with grocery shopping',
    originalDescription: 'I am an elderly person and cannot go out much. I need someone to pick up some milk and bread.',
    aiOptimizedDescription: 'Senior citizen seeking assistance with grocery pickup (milk and bread) periodically to ensure essential nutrition and safety.',
    category: 'food',
    urgency: 'medium',
    location: 'North Hill District',
    tags: ['senior-care', 'groceries'],
    status: 'open',
    language: 'English',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'req-2',
    userName: 'Li Wei',
    title: 'Translation for medical appointment',
    originalDescription: 'Need help translating Mandarin to English for my doctor visit tomorrow morning. The specialist is at City General.',
    aiOptimizedDescription: 'Multilingual support required for a medical appointment; bridging the language gap for effective healthcare communication during a specialist visit.',
    category: 'translation',
    urgency: 'high',
    location: 'East Side',
    tags: ['healthcare', 'mandarin', 'translation'],
    status: 'open',
    language: 'Mandarin',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: 'req-3',
    userName: 'Officer Brown',
    title: 'Lost dog seen near park',
    originalDescription: 'I saw a small brown terrier running loose near Riverview Park. It looked scared.',
    aiOptimizedDescription: 'Sighting reported: A small brown terrier appears to be lost or running loose near Riverview Park.',
    category: 'other',
    urgency: 'low',
    location: 'Riverview',
    tags: ['animals', 'safety'],
    status: 'flagged',
    language: 'English',
    createdAt: new Date(Date.now() - 10000000).toISOString()
  },
  {
    id: 'req-4',
    userName: 'John Smith',
    title: 'Need someone to tutor my son in Math',
    originalDescription: 'My son is struggling with 8th grade algebra. Looking for some evening help.',
    aiOptimizedDescription: 'Tutoring support requested for middle school level algebra; seeking locally based educational assistance to improve student comprehension.',
    category: 'tutoring',
    urgency: 'low',
    location: 'Riverview',
    tags: ['education', 'math'],
    status: 'open',
    language: 'English',
    createdAt: new Date(Date.now() - 20000000).toISOString()
  },
  {
    id: 'req-5',
    userName: 'Alice Johnson',
    title: 'Furniture moving help',
    originalDescription: 'Moving to a new apartment, need extra hands for heavy lifting.',
    aiOptimizedDescription: 'Assistance requested for physical labor; seeking help with furniture transit and heavy lifting during residential relocation.',
    category: 'transport',
    urgency: 'high',
    location: 'City Center',
    tags: ['physical-labor', 'transport'],
    status: 'open',
    language: 'English',
    createdAt: new Date(Date.now() - 15000000).toISOString()
  },
  {
    id: 'req-6',
    userName: 'Older Neighbor',
    title: 'Help with garden',
    originalDescription: 'Need someone to help with yard work as I cant do it myself anymore.',
    aiOptimizedDescription: 'Support requested for residential maintenance and landscaping; assisting a senior community member with yard management.',
    category: 'eldercare',
    urgency: 'medium',
    location: 'West End',
    tags: ['senior-care', 'outdoor'],
    status: 'open',
    language: 'English',
    createdAt: new Date(Date.now() - 30000000).toISOString()
  }
];

let offers: any[] = [
  {
    id: 'off-1',
    userName: 'Sarah Jenkins',
    skills: ['driving', 'heavy lifting'],
    languages: ['English', 'Spanish'],
    availability: 'Weekends',
    bio: 'Happy to help with transport or moving items. I have a clean driving record and a 4-door car.',
    status: 'active'
  },
  {
    id: 'off-2',
    userName: 'David Chen',
    skills: ['translation', 'tutoring'],
    languages: ['English', 'Mandarin'],
    availability: 'Evenings',
    bio: 'Willing to help with Mandarin translation or math tutoring for middle schoolers.',
    status: 'active'
  },
  {
    id: 'off-3',
    userName: 'Robert Miller',
    skills: ['eldercare', 'companionship'],
    languages: ['English'],
    availability: 'Flexible',
    bio: 'I enjoy spending time with seniors and helping with light chores or conversation.',
    status: 'active'
  }
];

let resources: any[] = [
  {
    id: 'res-1',
    title: 'Central City Food Bank',
    type: 'food-bank',
    address: '123 Main St, Central City',
    phone: '(555) 0123-4567',
    description: 'Provides emergency food assistance to families in need. Open Mon-Fri, 9am-4pm.'
  },
  {
    id: 'res-2',
    title: 'Riverview Community Shelter',
    type: 'shelter',
    address: '456 Oak Rd, Riverview',
    phone: '(555) 9876-5432',
    description: 'Safe overnight housing and warm meals for individuals experiencing homelessness.'
  },
  {
    id: 'res-3',
    title: 'East Side Legal Aid',
    type: 'legal',
    address: '789 Pine Ave, East Side',
    phone: '(555) 4567-8901',
    description: 'Free legal consultations and representation for low-income residents.'
  },
  {
    id: 'res-4',
    title: 'City Health Clinic',
    type: 'health',
    address: '101 Health Way, City Center',
    phone: '(555) 111-2222',
    description: 'Walk-in healthcare services and vaccinations for community members.'
  },
  {
    id: 'res-5',
    title: 'Adult Learning Center',
    type: 'education',
    address: '55 Scholar St, West End',
    phone: '(555) 333-4444',
    description: 'ESL classes, GED prep, and vocational training for adults.'
  }
];

let notices: any[] = [
  {
    id: 'not-1',
    title: 'Community Garden Workshop',
    content: 'Join us this Saturday for a workshop on sustainable urban gardening. All skill levels welcome!',
    date: new Date(Date.now() + 172800000).toISOString(),
    type: 'event'
  },
  {
    id: 'not-2',
    title: 'Severe Weather Warning',
    content: 'A severe storm warning is in effect for the next 48 hours. Please check on vulnerable neighbors.',
    date: new Date(Date.now() + 86400000).toISOString(),
    type: 'alert'
  },
  {
    id: 'not-3',
    title: 'New Library Hours',
    content: 'The City Library will now be open until 8pm on weekdays to support students.',
    date: new Date().toISOString(),
    type: 'info'
  }
];

// --- API Routes ---

// Get all requests
app.get('/api/requests', (req, res) => {
  res.json(requests);
});

// Update request status (Admin/Mod)
app.patch('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const request = requests.find(r => r.id === id);
  if (request) {
    request.status = status;
    res.json(request);
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// Get all resources
app.get('/api/resources', (req, res) => {
  res.json(resources);
});

// Get all notices
app.get('/api/notices', (req, res) => {
  res.json(notices);
});

// Create a new request
app.post('/api/requests', async (req, res) => {
  const { userName, title, description, location, aiData } = req.body;

  try {
    let analysis = aiData;

    // If AI data wasn't provided by the client, try to generate it (fallback)
    if (!analysis) {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use stable flash for fallback
      const prompt = `Analyze this community support request and return JSON: Title: ${title}, Description: ${description}. Include: category, urgency, isSafe (bool), optimizedText, tags (array), detectedLanguage.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleanJson = text.replace(/```json|```/g, "").trim();
      analysis = JSON.parse(cleanJson);
    }

    if (!analysis.isSafe) {
      return res.status(400).json({ error: 'Request was flagged as inappropriate.' });
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      userName,
      title,
      originalDescription: description,
      aiOptimizedDescription: analysis.optimizedText,
      category: analysis.category,
      urgency: analysis.urgency,
      location,
      tags: analysis.tags,
      status: 'open',
      language: analysis.detectedLanguage,
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    res.json(newRequest);
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: 'Failed to save request.' });
  }
});

// Get all offers
app.get('/api/offers', (req, res) => {
  res.json(offers);
});

// Create a new offer
app.post('/api/offers', (req, res) => {
  const { userName, bio, skills, languages, availability } = req.body;
  const newOffer = {
    id: `off-${Date.now()}`,
    userName,
    bio,
    skills,
    languages,
    availability,
    status: 'active'
  };
  offers.unshift(newOffer);
  res.json(newOffer);
});

// AI Match Explanation
app.post('/api/match-explain', async (req, res) => {
  const { requestId, volunteerId } = req.body;
  const request = requests.find(r => r.id === requestId);
  const volunteer = offers.find(v => v.id === volunteerId);

  if (!request || !volunteer) return res.status(404).json({ error: 'Not found' });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Explain why this volunteer matches this community request.
      Volunteer: ${volunteer.userName} (Skills: ${volunteer.skills.join(', ')}, Languages: ${volunteer.languages.join(', ')})
      Request: ${request.title} (${request.aiOptimizedDescription})
      
      Keep the explanation warm, encouraging, and under 3 sentences.
    `;

    const result = await model.generateContent(prompt);
    res.json({ explanation: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: 'Matching failed' });
  }
});

// AI Assistant Chat
app.post('/api/assistant', async (req, res) => {
  const { message, history } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const chat = model.startChat({
      history: history.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    });

    const result = await chat.sendMessage(`
      You are the NeighbourGo AI Assistant. 
      You help people in the community find resources, understand how to help, 
      and answer questions about using the app.
      Be kind, professional, and community-focused.
      
      Current system state for context:
      Total Requests: ${requests.length}
      Total Volunteers: ${offers.length}
      
      User message: ${message}
    `);

    res.json({ text: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: 'Assistant error' });
  }
});

// Analytics Route
app.get('/api/analytics', (req, res) => {
  const categories = ['food', 'transport', 'tutoring', 'translation', 'eldercare', 'housing', 'other'];
  const data = categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: requests.filter(r => r.category === cat).length
  }));
  res.json(data);
});

// --- Server Setup ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NeighbourGo running on http://localhost:${PORT}`);
  });
}

startServer();
