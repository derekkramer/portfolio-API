const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

const port = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/', (req, res) => {
    console.log(req.body);
    jwt.verify(req.body.token, process.env.TOKEN, (err, decoded) => {
        if(decoded){
            let mailOptions = {
                from: decoded.email,
                to: process.env.SEND,
                subject: `New Email from ${decoded.name} at ${decoded.email}`,
                text: decoded.message
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    console.log(error);
                    res.json({
                        status: 'failure',
                        data: error
                    });
                }else{
                    console.log(info);
                    res.json({
                        status: 'success',
                        data: 'Thank you, your message has been sent'
                    });
                }
            });
        }else{
            console.log(err);
            res.json({
                status: 'failure',
                data: 'Token error'
            });
        }
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
