'use server';
/**
 * @fileOverview A Genkit flow for generating fun, interesting, and relevant facts about age.
 *
 * - generateFunAgeFact - A function that handles the generation of age-related facts.
 * - GenerateFunAgeFactInput - The input type for the generateFunAgeFact function.
 * - GenerateFunAgeFactOutput - The return type for the generateFunAgeFact function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFunAgeFactInputSchema = z.object({
  years: z.number().describe('The user\u0027s age in full years.'),
  months: z.number().describe('The user\u0027s age in months (0-11) beyond full years.'),
  days: z.number().describe('The user\u0027s age in days (1-31) beyond full months.'),
});
export type GenerateFunAgeFactInput = z.infer<typeof GenerateFunAgeFactInputSchema>;

const GenerateFunAgeFactOutputSchema = z.object({
  fact: z.string().describe('A fun, interesting, and relevant fact about the user\u0027s age or age in general.'),
});
export type GenerateFunAgeFactOutput = z.infer<typeof GenerateFunAgeFactOutputSchema>;

export async function generateFunAgeFact(input: GenerateFunAgeFactInput): Promise<GenerateFunAgeFactOutput> {
  return generateFunAgeFactFlow(input);
}

const generateFunAgeFactPrompt = ai.definePrompt({
  name: 'generateFunAgeFactPrompt',
  input: {schema: GenerateFunAgeFactInputSchema},
  output: {schema: GenerateFunAgeFactOutputSchema},
  prompt: `You are an expert at generating fun and engaging facts about age.

Given the following age details:
- Years: {{{years}}}
- Months: {{{months}}}
- Days: {{{days}}}

Generate a single fun, interesting, and relevant fact about this specific age or age in general.
The fact should be concise, entertaining, and insightful.

{{ai.output schema=output.schema}}`,
});

const generateFunAgeFactFlow = ai.defineFlow(
  {
    name: 'generateFunAgeFactFlow',
    inputSchema: GenerateFunAgeFactInputSchema,
    outputSchema: GenerateFunAgeFactOutputSchema,
  },
  async input => {
    const {output} = await generateFunAgeFactPrompt(input);
    return output!;
  }
);
