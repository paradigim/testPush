
const webpush = require('web-push');
const express = require('express');
const bodyparser = require('body-parser');
const vapidKeys = {
    "publicKey":"BF7ekuEOKJrtvX4ornpRrZkkv_ALrNVb4r5RzeqzOgZP-oorGGxQsUROVK2oTymCDEkQKlaNb2WVYplrrtp9MtE",
    "privateKey":"M9B2G_q8S6QaN_QwOhshyNa-4tvhm4KzsSrNF51ZNGg"
};

// M9B2G_q8S6QaN_QwOhshyNa-4tvhm4KzsSrNF51ZNGg

const app = express();
app.use(require('cors')());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('SUCCESS')
})

// webpush.setGCMAPIKey('AAAAFrEam7w:APA91bGfgaguGwRvtnRLc2YnsO5UqhktjrLmTSK_1awInWz-uGWBNr97LpHqanSA3LIvSR3l-lnsTMkJh6mgKwh7BgX_EUOjpo2peNTLf4PsSzruY7MflNiHCc72OXfAU4Ox9nTdKg-5');
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const fakeDatabase = [];
app.post('/subscription', (req, res) => {
    const subscription = req.body
    fakeDatabase.push(subscription)
})

app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    const notificationPayload = {
        "notification": {
            "title": "Angular News",
            "vibrate": [100, 50, 100],
            "data": {
                "url": "https://blog-9a5ab.web.app/home"
            },
            "requireInteraction": true,
            "actions": [
                {
                  "action": "openapp",
                  "title": "Open App"
                }
            ]
        }
    };


    const promises = []
    fakeDatabase.forEach(subscription => {
        promises.push(
        webpush.sendNotification(
            subscription,
            JSON.stringify(notificationPayload)
        )
        )
    })
    Promise.all(promises).then(() => res.sendStatus(200))


    // Promise.resolve(webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
    //     .then(() => {
    //         res.status(200).json({message: 'Newsletter sent successfully.'})
    //     })
    //     .catch(err => {
    //         console.error("Error sending notification, reason: ", err);
    //         // res.sendStatus(500);
    //         res.status(500).json({ERROR: err})
    //     })
    // )
})

const port = 5000;
app.listen(process.env.PORT || port);