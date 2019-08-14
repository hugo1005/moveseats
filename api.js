const express = require('express');
const router = express.Router();
const fs = require('fs');

const flightCodeParse = fs.readFileSync('./flight-codes.json', 'utf8');
const flightCodes = JSON.parse(flightCodeParse);

router.get('/validate/:flight', function(req, res, next) { 
    let flightId = req.params.flight;
    let IATACode = flightId.slice(0,2);

    let isValid = false;
    let IATA = flightCodes.IATA

    console.log("Flight code : " + IATACode);

    let loc = IATA.findIndex((code) => code === IATACode);

    isValid = loc > -1? true: false;

    res.setHeader('Content-Type', 'application/json');

    let content = {
        status: isValid? 200: 400,
        detail: isValid? `Flight ${flightId} is valid`: `Could not find ${IATACode} in db`,
        airline: isValid? flightCodes.Airline[loc]: null
    };

    console.log("Sending response!");

    res.json(content);
});

module.exports = router;
