const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Middleware pour gérer les données du formulaire
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Clé API RapidAPI
const RAPIDAPI_KEY = 'ab42dda446mshde4ba65d25b85fdp13b83ejsn3965c0519b7d';

// Route principale pour afficher le formulaire
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Virtual Number API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f9;
          margin: 0;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #333;
        }
        .form-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .form-container label {
          font-size: 18px;
          color: #555;
        }
        .form-container input {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          margin-bottom: 20px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .form-container button {
          background-color: #4CAF50;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .form-container button:hover {
          background-color: #45a049;
        }
        .result-container {
          margin-top: 40px;
        }
        .result-container h2 {
          color: #333;
        }
        .message {
          padding: 10px;
          margin-bottom: 10px;
          background-color: #e7f7e7;
          border-radius: 5px;
          border: 1px solid #d1f0d1;
        }
      </style>
    </head>
    <body>

      <h1>Get Virtual Number & Messages</h1>

      <div class="form-container">
        <form action="/get-number" method="POST">
          <label for="number">Enter a virtual number (optional):</label>
          <input type="text" name="number" id="number" required />
          <button type="submit">Get Virtual Number & Messages</button>
        </form>
      </div>

    </body>
    </html>
  `);
});

// Route pour récupérer un numéro virtuel indien et les messages
app.post('/get-number', async (req, res) => {
  try {
    // Demander un numéro virtuel indien
    const response = await axios.get('https://indian-virtual-number1.p.rapidapi.com/indianvirtualnumber', {
      headers: {
        'x-rapidapi-host': 'indian-virtual-number1.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    const virtualNumber = response.data.number;

    // Récupérer les messages envoyés à ce numéro
    const messagesResponse = await axios.get(`https://virtual-number.p.rapidapi.com/api/v1/e-sim/view-messages?countryId=7&number=${virtualNumber}`, {
      headers: {
        'x-rapidapi-host': 'virtual-number.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    const messages = messagesResponse.data.messages;

    // Rendre le formulaire avec le numéro virtuel et les messages
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Virtual Number API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 20px;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          .form-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .form-container label {
            font-size: 18px;
            color: #555;
          }
          .form-container input {
            width: 100%;
            padding: 10px;
            margin-top: 10px;
            margin-bottom: 20px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          .form-container button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .form-container button:hover {
            background-color: #45a049;
          }
          .result-container {
            margin-top: 40px;
          }
          .result-container h2 {
            color: #333;
          }
          .message {
            padding: 10px;
            margin-bottom: 10px;
            background-color: #e7f7e7;
            border-radius: 5px;
            border: 1px solid #d1f0d1;
          }
        </style>
      </head>
      <body>

        <h1>Virtual Number: ${virtualNumber}</h1>

        <h3>Messages Received:</h3>
        <div class="result-container">
          ${messages.length > 0 ? messages.map(message => `
            <div class="message">
              <strong>${message.sender}:</strong> ${message.text}
            </div>
          `).join('') : '<p>No messages received yet.</p>'}
        </div>

        <div class="form-container">
          <form action="/get-number" method="POST">
            <label for="number">Enter another number (optional):</label>
            <input type="text" name="number" id="number" required />
            <button type="submit">Get Virtual Number & Messages</button>
          </form>
        </div>

      </body>
      </html>
    `);

  } catch (error) {
    console.error('Error:', error);
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Virtual Number API</title>
      </head>
      <body>
        <h1>Error: Unable to retrieve number or messages</h1>
      </body>
      </html>
    `);
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
