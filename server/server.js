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
  const { email, password } = req.body;

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
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

app.post('/api/login', async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate an access token
    const accessToken = jwt.sign({ userId: user._id }, 'secretKey', {
      expiresIn: '1h',
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

app.get('/api/formdata', async (req, res) => {
  try {
    const formDatas = await FormDataSchema.find();
    res.status(200).json(formDatas);
  } catch (error) {
    console.error('Error retrieving form data:', error);
    res.status(500).json({ message: 'An error occurred while retrieving form data' });
  }
});

app.post('/api/formdata', upload.single('resourceMedia'), async (req, res) => {
  try {
    // Extract form data from the request body
    const { resourceName, description, publisher } = req.body;
    const resourceMedia = req.file ? req.file.filename : '';

    // Create a new FormDataSchema instance
    const formData = new FormDataSchema({
      resourceName,
      description,
      publisher,
      resourceMedia,
    });

    // Save the form data to the database
    await formData.save();

    res.status(201).json({ message: 'Form data saved successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'An error occurred while saving form data' });
  }
});

app.post('/api/formdata/upvote/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the form data by ID
    const formData = await FormDataSchema.findById(id);
    if (!formData) {
      return res.status(404).json({ message: 'Form data not found' });
    }

    // Increment the upvotes count
    formData.upvotes = (formData.upvotes || 0) + 1;

    // Save the updated form data
    await formData.save();

    res.status(200).json({ message: 'Upvote successful' });
  } catch (error) {
    console.error('Error upvoting form data:', error);
    res.status(500).json({ message: 'An error occurred while upvoting form data' });
  }
});
