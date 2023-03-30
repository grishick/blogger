//const OpenAI = require('openai');
import { Configuration, OpenAIApi } from "openai";
import * as fs from "fs";
const OPENAI_API_KEY = await (fs.readFileSync("secrets/open_ai_key.txt")).toString().trim();
const OPENAI_ORG_KEY = await (fs.readFileSync("secrets/open_ai_org.txt")).toString().trim();

const configuration = new Configuration({
    organization: OPENAI_ORG_KEY,
    apiKey: OPENAI_API_KEY,
    maxBodyLength: Infinity
});
export async function Transcribe (inputFile, outputFile) {
    try {
        const openai = new OpenAIApi(configuration);
        const resp = await openai.createTranscription(
            fs.createReadStream(inputFile), // audio input file
            "whisper-1", // Whisper model name.
            undefined, // Prompt
            "text", // Output format. Options are: json, text, srt, verbose_json, or vtt.
            1, // Temperature.
            "en",
        );
        console.log(resp.data);
        fs.writeFileSync(outputFile, resp.data);
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}


