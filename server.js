const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51UAUJLGaAig3IwqQVL67a3cfEg5FGOuibMhAX6T31WpKWRQK4Qo1pKaaZpCvHfWguwfVt9qrgALOK16rsH5FjURf00cyuYNO61');

const app = express();
app.use(cors());
app.use(express.json());

// Egyszerű üdvözlet a gyökér oldalon, hogy ne legyen "Cannot GET /"
app.get('/', (req, res) => {
    res.send('Veress Streetwear Server is running!');
});

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { amount, items } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'ron',
                        product_data: {
                            name: 'Veress Streetwear Vasarlas',
                        },
                        unit_amount: Math.round(amount * 100), // Bani-ban (fillérben) számol a Stripe
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'https://veressstreetwear-romania.vercel.app', // Sikeres fizetés után visszatér a shopba
            cancel_url: 'https://veressstreetwear-romania.vercel.app',   // Megszakítás esetén is
        });

        res.json({ url: session.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
