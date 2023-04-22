const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const { ProfileImage } = require("../models/ProfileImage")
// const sharp = require('sharp');
const mongoose = require("mongoose")
const multer = require('multer');

// Define storage for uploaded files
const storage = multer.memoryStorage();

// Create multer instance with specified storage
const upload = multer({ storage: storage })



// Define route to handle file upload
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const nameUser = await Users.findOne({ email: req.user.email });
        const mail = nameUser?.email;
        const image = req.file;
        if (!image || (image.mimetype !== 'image/jpeg' && image.mimetype !== 'image/png')) {
            throw new Error('Invalid file type. Only JPG/JPEG and PNG files are allowed.');
        }
        // const resizedImage = await sharp(image.buffer)
        //     .resize({ width: 500, height: 500 })
        //     .toBuffer();
        const newImage = new ProfileImage({
            name: image.originalname,
            data: image.buffer,
            email: mail,
            contentType: image.mimetype
        });
        await newImage.save();
        res.redirect('/profile');
    } catch (err) {
        res.status(500).send(err.message);
    }
});



// Define route to display image by ID
router.get('/:id', async (req, res) => {
    const imageId = req.params.id;
    ProfileImage.findById(imageId)
        .then(image => {
            if (!image) {
                return res.status(404).send('Image not found');
            }
            res.set('Content-Type', image.contentType);
            res.send(image.data);

        })
        .catch(err => {
            res.status(500).send(err);
        });
});

// Define route to delete image by ID
router.delete('/:id', async (req, res) => {
    const imageId = req.params.id;
    nameUser = await Users.find({ email: req.user.email })
    ProfileImage.findByIdAndDelete(imageId)
        .then(image => {
            if (!image) {
                return res.status(404).send('Image not found');
            }
            res.redirect("/profile");
        })
        .catch(err => {
            res.status(500).send(err);
        });
});


module.exports = router;