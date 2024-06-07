const router = require('express').Router();
const multer = require('multer');
const { storage } = require('../storage/storage'); 
const upload = multer({ storage });
const Plant = require('../modals/plants.model');
const cloudinary = require('cloudinary').v2;

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Access the Cloudinary image URL
    const imageUrl = result.secure_url;
    // Save the Cloudinary image URL in your database
    const newPlant = new Plant({
      plantName: req.body.plantName,
      description: req.body.description,
      plantPicture: imageUrl,
    });

    await newPlant.save();

    res.status(200).json({ message: 'Plant added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error uploading plant', error: err.message });
}
});

module.exports = router;