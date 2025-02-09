import type { NextApiRequest, NextApiResponse } from 'next';
import Groq from 'groq-sdk';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false, // Disable the default body parser
    },
};

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

type AnalysisResponse = {
    analysis?: string;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<AnalysisResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const form = formidable();
        const [fields, files] = await form.parse(req);
        const file = files.file?.[0];

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Read the file content
        const content = fs.readFileSync(file.filepath, 'utf8');

        // Analyze the content using Groq
        const completion = await groq.chat.completions.create({
            messages: [
                { 
                    role: "system", 
                    content: "You are a financial document analyzer. Provide concise analysis." 
                },
                { 
                    role: "user", 
                    content: `Analyze this financial document and provide key insights:\n\n${content}` 
                }
            ],
            model: "mixtral-8x7b-32768",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const analysis = completion.choices[0]?.message?.content;

        return res.status(200).json({ analysis });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Error analyzing file' });
    }
} 