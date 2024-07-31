const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000; // Use PORT from .env or default to 8000
const nodemailer = require("nodemailer");
const cors = require("cors");
require('dotenv').config(); // Ensure this is at the top

const sender = process.env.SENDER;
const sendername = process.env.SENDERNAME;
const pass = process.env.PASS;

// Configure Nodemailer
const config = {
    service: "gmail",
    auth: {
        user: sender,
        pass: pass
    }
};

const client = nodemailer.createTransport(config);

app.use(express.json());
app.use(cors());

app.post("/goMail", (req, res) => {
    const { firstName, lastName, email, website, message } = req.body;

    if (firstName && lastName && email && website && message) {
        client.sendMail(
            {
                from: `${sendername} <${sender}>`,
                to: email,
                subject: "Confirmation Mail",
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Confirmation</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                height: 100vh;
                                margin: 0;
                                padding: 20px;
                                background: linear-gradient(to right, rgb(13, 13, 172), rgb(90, 90, 235));
                                display: flex;
                                justify-content: center;
                                align-items: center;
                            }
                            .container {
                                background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                                max-width: 600px;
                                width: 100%;
                                box-sizing: border-box;
                            }
                            .header {
                                font-size: 24px;
                                font-weight: bold;
                                margin-bottom: 20px;
                                text-align: center;
                                color: #333333;
                            }
                            .form-row {
                                margin-bottom: 15px;
                            }
                            .form-row label {
                                display: block;
                                font-weight: bold;
                                margin-bottom: 5px;
                                color: #333333;
                            }
                            .form-row .input-data {
                                background-color: #f9f9f9;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                color: #333333;
                                font-size: 16px;
                                word-wrap: break-word;
                            }
                            @media (max-width: 600px) {
                                body {
                                    padding: 10px;
                                }
                                .container {
                                    padding: 15px;
                                }
                                .header {
                                    font-size: 20px;
                                }
                                .form-row .input-data {
                                    font-size: 14px;
                                    padding: 8px;
                                }
                            }
                            @media (max-width: 480px) {
                                body {
                                    padding: 10px;
                                }
                                .header {
                                    font-size: 18px;
                                }
                                .form-row {
                                    margin-bottom: 12px;
                                }
                                .form-row label {
                                    font-size: 14px;
                                }
                                .form-row .input-data {
                                    font-size: 14px;
                                    padding: 6px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                Thank you for submitting the form
                            </div>
                            <div class="form-row">
                                <label for="firstName">First Name</label>
                                <div class="input-data" id="firstName">${firstName}</div>
                            </div>
                            <div class="form-row">
                                <label for="lastName">Last Name</label>
                                <div class="input-data" id="lastName">${lastName}</div>
                            </div>
                            <div class="form-row">
                                <label for="email">Email Address</label>
                                <div class="input-data" id="email">${email}</div>
                            </div>
                            <div class="form-row">
                                <label for="website">Website Name</label>
                                <div class="input-data" id="website">${website}</div>
                            </div>
                            <div class="form-row">
                                <label for="message">Message</label>
                                <div class="input-data" id="message">
                                    ${message}
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
            },
            (error, info) => {
                if (error) {
                    console.error("Error sending email:", error); // Log error details for debugging
                    return res.status(500).send(`Error in internal server: ${error.message}`);
                }
                res.send("Successfully mailed");
                console.log("Email sent:", info.response);
            }
        );
    } else {
        res.status(400).send("Missing required fields");
    }
});

app.listen(PORT, () => {
    console.log(`The server is running on port: ${PORT}`);
});
