const proxyUrl = 'https://zuhayrcors.herokuapp.com/';
const express = require("express");
const app = express();
const path = require("path");
const stripe = require("stripe")("sk_test_51LXJMNHaiJQbqv8nU6Hnl7ZnL2CI9ulx2E9t4uGkLIHU0euDvV9a9vW1ZBBvi602m9vWKNIQAfvBjy6lrVD0vFzf002fDuknqP");
// const cors = require('cors');
// app.use(
//     cors({
//         origin: '*',
//         credentials: true,
//         methods: "GET,HEAD,OPTIONS,PUT,PATCH,DELETE"
//     })
// )
const YOUR_DOMAIN = "https://serversidestripe.herokuapp.com";

// static files
app.use(express.static(path.join(__dirname, "client")));

// middleware
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// routes
// app.options('*', cors());
app.get("/", (req, res) => res.send("Hello World"));


app.post("/payment", async(req, res) => {
    const { product } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Total Cost",

                },
                unit_amount: (product.amount + 500) * 100,
                // unit_amount: product.amount * 100,
            },
            quantity: product.quantity,
        }, ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.json({ id: session.id });
});

// listening...
const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`Listening on port ${port}...`));