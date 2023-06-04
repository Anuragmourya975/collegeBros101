const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 5000; // Choose a port number
const User = require('./models/User');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const FormDataSchema = require('./models/formDataSchema');


// Configure the storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name for the uploaded file
  },
});

// Create the multer middleware using the storage configuration
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));
app.use(express.static("public"));


app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
}));
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/collegeBros', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

  app.post('/api/register', async (req, res) => {
    // Extract username, email, and password from the request body
    const {email, password } = req.body;
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user in the database
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/api/login', async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Generate a JWT
      const token = jwt.sign({ userId: user._id }, 'secret_key');
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  app.post('/api/formdata', upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'resourceMedia', maxCount: 1 }
  ]), async (req, res) => {
    // Extract the form data from the request body
    const { resourceName, description, publisher } = req.body;
    const thumbnail = req.files['thumbnail'][0].filename;
    const resourceMedia = req.files['resourceMedia'][0].filename;
  
    try {
      // Save the form data in the database
      const formData = new FormDataSchema({
        resourceName,
        description,
        thumbnail,
        resourceMedia,
        publisher,
      });
      await formData.save();
  
      res.status(200).json({ message: 'Form data saved successfully' });
    } catch (error) {
      console.error('Error saving form data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/formdata", async (req, res) => {
    try {
      const searchQuery = req.query.search || "";
      let formData;
  
      if (searchQuery.length > 0) {
        formData = await FormDataSchema.find({
          $or: [
            { resourceName: { $regex: searchQuery, $options: "i" } },
            { description: { $regex: searchQuery, $options: "i" } },
            { publisher: { $regex: searchQuery, $options: "i" } },
          ],
        });
      } else {
        formData = await FormDataSchema.find();
      }
  
      res.status(200).json(formData);
    } catch (error) {
      console.error("Error fetching form data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post("/api/formdata/upvote/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the card by its ID
      const formData = await FormDataSchema.findById(id);
  
      if (!formData) {
        return res.status(404).json({ message: "Card not found" });
      }
  
      // Increment the upvotes count
      formData.upvotes = (formData.upvotes || 0) + 1;
  
      // Save the updated card
      await formData.save();
  
      res.status(200).json({ message: "Upvote successful", formData });
    } catch (error) {
      console.error("Error upvoting card:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  