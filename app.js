// https://stripe.com/docs/recipes/custom-checkout
// https://www.youtube.com/watch?v=QT3_zT97_1g&t=3s

require("dotenv").config();

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const express = require("express");
const stripe = require("stripe")(keySecret);
const bosyParser = require("body-parser");
const exphbs = require("express-handlebars");

const app = express();

// Handlebar middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body Parcer middleware
app.use(bosyParser.json());
app.use(bosyParser.urlencoded({ extended: false }));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// index route
app.get("/", (req, res) => {
  res.render("index", {
    keyPublishable // send it to the index view
  });
});

app.post("/charge", async (req, res) => {
  const amount = 10000; // 100$
  try {
    let customer = await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    });
    let charge = await stripe.charges.create({
      amount: amount,
      description: "just payed",
      currency: "usd",
      customer: customer.id
    });
    res.render("success");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
