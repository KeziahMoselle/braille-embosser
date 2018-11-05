// Logger
const Logger = require('leaf-logger');
// ExpressJS
const express = require('express');
const app = express();
// HTTP
const server = require('http').Server(app);
// Body Parser
const bodyParser = require('body-parser');
// Socket.Io
const io = require('socket.io')(server);
// SerialPort
const SerialPort = require('serialport');

// JSON Files
const braille = require('./data/braille.json');
const status = require('./data/status.json');

/**
 * Variables
 */
// HTTP
const webPort = 8080;
// SerialPort
const portPath = '/dev/ttyACM0';
const baudRate = 9600;
const encodeType = 'utf8';
// Application
var charIndex = 0;
var encoded = "";
var encodedLength = 0;
var reOpen;

/**
 * Configuration
 */
// SerialPort
const Serial = new SerialPort(portPath, {
    baudRate: baudRate
}).setEncoding(encodeType);

const Parser = Serial.pipe(new SerialPort.parsers.Readline());

// HTTP
server.listen(webPort, () => {
    Logger.info(`Server listening on ${webPort}`, 'HTTP');
})

// ExpressJS
app.use(bodyParser.json());

// SerialPort
Serial.on('open', () =>
{
    setTimeout(() =>
    {
        Logger.success(`Port ${portPath} ouvert`, 'SerialPort');
        Logger.warn(`Reset Arduino`, 'Application');
        send('RESET');
    }, 2500);
});

Serial.on('close', () =>
{
    Logger.error(`Port ${portPath} fermé`, 'SerialPort');
    
    reOpen = setInterval(() =>
    {
        Serial.open((err) =>
        {
            if (err) {
                Logger.error('Impossible d\'ouvrir', 'SerialPort');
                return;
            }
            clearInterval(reOpen);
        })
    }, 5000);
});

Parser.on('data', (data) =>
{
    data = Array.from(data);
    data.pop();
    data = data.join('');

    Logger.info(`Données reçus: ${data}`, 'SerialPort');

    if (data == 'S0')
    {
        if (charIndex != encodedLength)
        {
            io.sockets.emit('S0', 'Caractère embossé.');
            Logger.success('Notification envoyée: Caractère embossée.', 'App');
            charIndex++;
            print();
        }
        else
        { 
            Logger.success('Notification envoyée: Phrase embossée.', 'App');
            io.sockets.emit('S1', 'La phrase a fini d\'être embossée.');
            send('RESET');
        }
    }
});

// ExpressJS
app.post('/print', (req, res) =>
{
    let message = req.body.text;

    Logger.info(`Print requested -> ${message}`, 'ExpressJS (HTTP)');

    print(encode(message));
    req.send({
        'status': 0
    });
});

// Socket.Io
io.on('connection', (socket) =>
{
    Logger.info(`Utilisateur #${socket.id} s'est connecté`);

    socket.on('print', (message) =>
    {
        encoded = encode(message);
        Logger.info(`Nouvelle requête: ${message}`, 'WebSocket');
        print();
    });

    socket.on('paperForward', () => {
        Logger.info(`Paper forward requested`, 'WebSocket');
        send('PAPERF');
    });
});

/**
 * Fonctions
 */

/**
 * Envoie un caractère à l'Arduino
 * @param {string} message
 * @param {function} callback
 */
function send(message, callback = null)
{
    Serial.write(message, () =>
    {
        if (callback === null)
        {
            Logger.success(`Envoie: ${message} à ${portPath}`, 'Application');
        } else {
            callback();
        }
    });
}


function print()
{
    send(encoded[charIndex], () =>
    {
        Logger.success(`Requête: ${encoded[charIndex]}. En attente d'une réponse`, 'Application');
    })
}

/**
 * Encode string to braille characters
 * @param {string} text 
 */
function encode(text)
{
    charIndex = 0;
    encodedLength = -1;
    var stringArray = [];
    text.split('').forEach((char) =>
    {
        encodedLength++
        if (isWhiteSpace(char))
        {
            stringArray.push(":000000");
        } // ESPACE
        else if (Number.isInteger(parseInt(char)))
        {
            stringArray.push(`*${braille[char]}`);
        } // NUMERIQUE
        else if (isUpperCase(char))
        {
            stringArray.push(`!${braille[char.toLowerCase()]}`);
        } // MAJUSCULE
        else
        {
            stringArray.push(`:${braille[char]}`);
        } // MINUSCULE
    })
    return stringArray;
}

/**
 * Returns `true` if argument is a capital letter
 * @param {string} text 
 * @returns {boolean}
 */
function isUpperCase(text)
{
    return (text == text.toUpperCase() && !/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?.]/g.test(text));
}

/**
 * Returns `true` if argument is a space
 * @param {string} text 
 * @returns {boolean}
 */
function isWhiteSpace(text)
{
    return text.indexOf(' ') >= 0;
}