const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        
       
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

       
        const prompt = `You are a helpful, empathetic, and professional AI Health Assistant for a women's health and period tracking app. 
        A user is asking: "${message}"
        Provide a short, helpful, and caring response. Keep it under 3-4 sentences. If they ask for serious medical advice, kindly remind them that you are an AI and they should consult a doctor.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Gemini AI Error:", error);
        res.status(500).json({ error: "Failed to process AI response" });
    }
});

module.exports = router;