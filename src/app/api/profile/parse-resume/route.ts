import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFParser from 'pdf2json';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Extract Text using pdf2json
        const resumeText = await new Promise<string>((resolve, reject) => {
            const pdfParser = new PDFParser(null, 1); // 1 = text content only

            pdfParser.on("pdfParser_dataError", (errData: any) => {
                console.error("PDF Parsing Error:", errData.parserError);
                reject(errData.parserError);
            });

            pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                // Determine if we have raw text content or need to extract it
                const rawText = pdfParser.getRawTextContent();
                resolve(rawText);
            });

            pdfParser.parseBuffer(buffer);
        });

        // 2. Send to Gemini for Parsing
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      You are an expert resume parser. Extract structured data from the resume text below.
      Return ONLY valid JSON matching this structure exactly (no markdown formatting):
      
      {
        "headline": "A short professional headline (e.g. Senior Frontend Engineer)",
        "about": "A summary/bio (max 500 chars)",
        "workExperience": [
           { 
             "company": "Company Name", 
             "role": "Job Title", 
             "startDate": "YYYY-MM", 
             "endDate": "YYYY-MM or 'Present'", 
             "description": "2-3 bullet points of key achievements", 
             "current": boolean
           }
        ],
        "education": [
           {
             "school": "University Name",
             "degree": "Degree Name",
             "field": "Field of Study",
             "startDate": "YYYY-MM",
             "endDate": "YYYY-MM",
             "description": ""
           }
        ],
        "skills": ["Skill1", "Skill2", "Skill3", "Skill4"],
        "contact": {
           "location": "City, Country",
           "linkedin": "Full LinkedIn URL",
           "website": "Full Portfolio URL"
        }
      }

      RESUME TEXT:
      ${resumeText}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJson);

        return NextResponse.json({ success: true, data: parsedData });

    } catch (error: any) {
        console.error("Resume parsing error (Full):", error);
        return NextResponse.json({
            error: "Failed to parse resume: " + (error.message || error.toString()),
            details: error
        }, { status: 500 });
    }
}