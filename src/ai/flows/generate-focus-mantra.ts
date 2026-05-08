'use server';
/**
 * @fileOverview A Genkit flow for generating motivational focus mantras and productivity insights.
 *
 * - generateFocusMantra - A function that handles the generation of focus-related mantras.
 * - GenerateFocusMantraInput - The input type for the generateFocusMantra function.
 * - GenerateFocusMantraOutput - The return type for the generateFocusMantra function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFocusMantraInputSchema = z.object({
  mode: z.enum(['work', 'short-break', 'long-break']).describe('The current state of the Pomodoro timer.'),
  task: z.string().optional().describe('The current task the user is working on.'),
});
export type GenerateFocusMantraInput = z.infer<typeof GenerateFocusMantraInputSchema>;

const GenerateFocusMantraOutputSchema = z.object({
  mantra: z.string().describe('A short, powerful motivational mantra or productivity insight.'),
});
export type GenerateFocusMantraOutput = z.infer<typeof GenerateFocusMantraOutputSchema>;

export async function generateFocusMantra(input: GenerateFocusMantraInput): Promise<GenerateFocusMantraOutput> {
  return generateFocusMantraFlow(input);
}

const generateFocusMantraPrompt = ai.definePrompt({
  name: 'generateFocusMantraPrompt',
  input: {schema: GenerateFocusMantraInputSchema},
  output: {schema: GenerateFocusMantraOutputSchema},
  prompt: `You are a productivity performance coach for high-achievers at Camly Inc.

Current Mode: {{{mode}}}
Current Task: {{#if task}}{{{task}}}{{else}}Deep Focus Session{{/if}}

Generate a concise, high-impact mantra or insight to keep the user in a state of flow. 
- If they are working, focus on discipline and clarity.
- If they are on a break, focus on rejuvenation and mental reset.
Keep it under 15 words.`,
});

const generateFocusMantraFlow = ai.defineFlow(
  {
    name: 'generateFocusMantraFlow',
    inputSchema: GenerateFocusMantraInputSchema,
    outputSchema: GenerateFocusMantraOutputSchema,
  },
  async input => {
    const {output} = await generateFocusMantraPrompt(input);
    return output!;
  }
);
