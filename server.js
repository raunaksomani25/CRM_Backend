const express = require("express");
const dotenv = require("dotenv");   
dotenv.config();                     

const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./src/config/db");
const apiKeyAuth = require("./src/middleware/apiKeyAuth");
const ensureAuth = require("./src/middleware/ensureAuth");
const session = require("express-session");
require("./src/config/passport"); 
const passport = require("passport"); 




connectDB();

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", 
      httpOnly: true,
      sameSite: "none", 
    },
  })
);

app.use(cors({
  origin: "https://crm-frontend-theta-six.vercel.app", 
  credentials: true               
}));

app.use(passport.initialize());
app.use(passport.session());
app.use("/user", require("./src/routes/user"));
app.use("/api/segments", require("./src/routes/segments"));
app.use("/api/campaigns", require("./src/routes/campaigns"));

app.get("/", (req, res) => {
  res.send("Mini CRM API is running...");
});

app.use("/api/customers", apiKeyAuth,ensureAuth,require("./src/routes/customers"));
app.use("/api/orders", apiKeyAuth, ensureAuth,require("./src/routes/orders"));
app.use("/auth", require("./src/routes/auth"));
app.use("/api/ai", require("./src/routes/ai"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





