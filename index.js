var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Aha_Moment_Labs') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// API End Point - added by Stefan

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'hi') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAdSvDBERRYBAMYHZCZAZBcxhykM2x7VlPjdun9C45fub4tN8YPFn3ZBse7BNZCUjdCl1AUkkWbgRKDRnqhjp7oaz2Rd227QmGDbi7B6oKgAqoVXpzylPgQcTbO7qihWmvZBjH8ILum198oSULRi5cGgLo6SFrQwKzlGb6NXDJ6KPuZAByHZCOYG";

// function to echo back messages - added by Stefan

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// Send an test message back as two cards.

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Our Services",
                    "subtitle": "Entertaining you at our best.",
                    "image_url": "https://steemitimages.com/DQmWiKbVoJEqsqfgWKAKB8iErQmjjFueysv1rynoHnk2za4/14-COYOTE-09636-Entertainment-Header-1000x356-72dpi.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://additionalknowledge.wordpress.com/",
                        "title": "Our Blog"
                    },{
                       "type": "postback",
                        "title": "Why connecting us?",
                        "payload": "We will make your life full of entertainment.",
                    }],
                }, {
                    "title": "FAQ",
                    "subtitle": "Aking the Deep Questions",
                    "image_url": "https://searchengineland.com/figz/wp-content/seloads/2015/06/question-ask-faq-raise-hand-ss-1920.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "What are the queries?",
                        "payload": "You can message us anytime.",
                    },{
                        "type": "postback",
                        "title": "How can we resolve your problems?",
                        "payload": "We can message you here only and if you want more quick response you can contact us via blog link too.",
                    }, {
                         "type": "web_url",
                        "url": "https://additionalknowledge.wordpress.com/contact/",
                        "title": "Contact Us"
                    }],
                },  {
                    "title": "Want our logos accessories",
                    "subtitle": "We have high end collection of our logos based tees and accessories",
                    "image_url": "https://img.shirtcity.com/article_preview/315x315/eeeeee/p1c19s1a1_d1i117584p0z5r1c2f2.jpg",
                    "buttons": [{
                        "type": "postback",
                        "title": "Why accessories?",
                        "payload": "Checkout our new accessories, if you support us its easier than you think!",
                    },{
                        "type": "postback",
                        "title": "How much it costs?",
                        "payload": "It costs nearly 500 rs for every accessory and must be in your budget.",
                    }, {
                        "type": "postback",
                        "title": "What are additional benifits?",
                        "payload": "You will also be given more priority than others!",
                    }],
                }]  
            } 
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}






//EAAdSvDBERRYBAJSzUbaoZC3aHi1mDAf4zatjtk7RCYxqcnZAD9QSztSgR3HJVqQLlPmsM11cnNDPRCo0m7rVLkFAHZAinEsOUQq1iJdZCl72U94axJVD68rJkFm9PzoMqvS5r5mFwzJ6aUVYxEzbZCV2JeBeGr8kb2VsdgMeNPZBsdMcmGZAchb




