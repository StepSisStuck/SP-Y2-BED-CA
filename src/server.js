const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const db = require('./config/db');
const path = require("path");
const classRoutes = require('./routes/classRoutes');
const questionRoutes = require('./routes/questionRoutes'); 
const spellsRoutes = require("./routes/spellsRoutes");
const userRoutes = require('./routes/userRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes = require('./routes/authRoutes');
const customizationRoutes = require('./routes/customizationRoutes');
const battleRoutes = require('./routes/battleRoutes');



const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));


app.use('/api', authRoutes);
app.use('/api', classRoutes);
app.use('/api', questionRoutes);
app.use('/api', spellsRoutes);
app.use('/api', userRoutes);
app.use('/api', reviewRoutes)
app.use('/api', customizationRoutes);
app.use('/api', battleRoutes);


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
