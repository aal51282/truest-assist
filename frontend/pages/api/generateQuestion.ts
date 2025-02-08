// pages/api/generateQuestion.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference('YOUR_HUGGINGFACE_API_KEY'); // Replace with your Hugging Face API key

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { difficulty } = req.body;
        const prompt = `Generate a ${difficulty} finance question.`;

        try {
            const response = await hf.textGeneration({
                model: 'meta-llama/Llama-2-7b-hf', // Use the appropriate model
                inputs: prompt,
                parameters: {
                    max_length: 50,
                    num_return_sequences: 1,
                },
            });

            const question = response.generated_text; // Extract the generated question
            res.status(200).json({ question });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error generating question' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}