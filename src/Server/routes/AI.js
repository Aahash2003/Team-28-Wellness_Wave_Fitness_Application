const express = require("express");
const OpenAI = require("openai");
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.KEY, // This is also the default, can be omitted
    
  });


  
  router.post('/generate', async (req, res) => {
    try {
        const chatCompletion = await openai.chat.completions.create({
            
                "model": "gpt-3.5-turbo",
                "messages": [
                  { "role": "user", "content": "write a haiku about AI" }
                ]
              
              
          });
          res.json(chatCompletion.choices[0].message);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  module.exports = router;