const express = require("express");
const app = express();
const path = require("path");
//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
const STRIPE_PRIVATE_KEY = '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';
const stripe = require("stripe")(STRIPE_PRIVATE_KEY);
// const cors = require('cors');
// app.use(
//     cors({
//         origin: '*',
//         credentials: true,
//         methods: "GET,HEAD,OPTIONS,PUT,PATCH,DELETE"
//     })
// )
const YOUR_DOMAIN = "https://tfm.express";

// static files
//app.use(express.static(path.join(__dirname, "client")));

// middleware
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// routes
// app.options('*', cors());
app.get("/", (req, res) => res.send("Stripe Integration Server"));

// const storeItems = new Map([
//     [0, { priceInCents: 50000, name: "Service Charges" }],

//     [1, { priceInCents: 50000, name: "Lead Generation" }],
//     [2, { priceInCents: 40000, name: "Event Promotion" }],
//     [3, { priceInCents: 50000, name: "Social Competition" }],
//     [4, { priceInCents: 40000, name: "Site Traffic" }],
//     [5, { priceInCents: 40000, name: "Social Growth" }],


//     [6, { priceInCents: 15000, name: "Lead Page" }],
//     [7, { priceInCents: 30000, name: "Instagram Story Animation" }],
//     [8, { priceInCents: 30000, name: "Carousel Creative" }],
//     [9, { priceInCents: 50000, name: "Lead Automation" }],
// ])
app.post("/payment", async(req, res) => {
    const { product } = req.body;
    product.amount = product.amount * 100;
    const storeItems = new Map([
        [0, { priceInCents: 50000, name: "Service Charges" }],

        [1, { priceInCents: 50000, name: "Lead Generation" }],
        [2, { priceInCents: 40000, name: "Event Promotion" }],
        [3, { priceInCents: 50000, name: "Social Competition" }],
        [4, { priceInCents: 40000, name: "Site Traffic" }],
        [5, { priceInCents: 40000, name: "Social Growth" }],


        [6, { priceInCents: 15000, name: "Lead Page" }],
        [7, { priceInCents: 30000, name: "Instagram Story Animation" }],
        [8, { priceInCents: 30000, name: "Carousel Creative" }],
        [9, { priceInCents: 50000, name: "Lead Automation" }],
        [10, { priceInCents: product.amount, name: "Media Budget" }],
    ])

    const session = await stripe.checkout.sessions.create({
        customer_email: req.body.clientEmail,
        payment_method_types: ["card"],
        line_items: req.body.items.map(item => {
            const storeItem = storeItems.get(item.id)
            return {
                price_data: {
                    currency: "aud",
                    product_data: {
                        name: storeItem.name,
                    },
                    unit_amount: storeItem.priceInCents,
                },
                quantity: 1,
            }
        }),
        // line_items: [{
        //     price_data: {
        //         currency: "usd",
        //         product_data: {
        //             name: "Total Cost",

        //         },
        //       unit_amount: (product.amount + 500) * 100,
        // unit_amount: product.amount * 100,
        //             },
        //             quantity: product.quantity,
        //         },
        // ],
        mode: "payment",
        success_url: `${YOUR_DOMAIN}/confirmpaymentmail.php`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
    });

    res.json({ id: session.id });
});

// listening...
const port = process.env.PORT || 5050;
app.listen(port, () => console.log(`Listening on port ${port}...`));
