const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51UAUJLGaAig3IwqQVL67a3cfEg5FGOuibMhAX6T31WpKWRQK4Qo1pKaaZpCvHfWguwfVt9qrgALOK16rsH5FjURf00cyuYNO61');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, items } = req.body; // A kosár végösszege leiben

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'ron',
                        product_data: {
                            name: 'Veress Streetwear Vásárlás',
                        },
                        unit_amount: Math.round(amount * 100), // A Stripe fillérekben/bani-ban számol, ezért szorozzuk 100-zal
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://github.com', // Ide jöhet majd a sikeres oldalad linkje
            cancel_url: 'https://github.com',  // Ide a visszalépő link
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500.0).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
