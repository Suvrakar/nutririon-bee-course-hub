const express = require('express')
const router = express.Router()
const commonFunc = require("../commonFunctions")
const { Users } = require("../models/Users")
const { ProfileImage } = require("../models/ProfileImage")
const { Courses } = require("../models/Courses")


const mongoose = require("mongoose")
const multer = require('multer');

// Define storage for uploaded files
const storage = multer.memoryStorage();

// Create multer instance with specified storage
const upload = multer({ storage: storage })


router.post('/', async (req, res) => {
    let course = await new Courses(req.body);
    // const finalResult = await Object.assign(comment, name);
    // await comment.save();
    res.send(course)
})

router.get('/', async (req, res) => {
    res.send("comment")
})

// Define route to handle file upload
// router.post('/', upload.single('image'), async (req, res) => {
//     nameUser = await Users.find({ email: req.user.email })
//     const mail = nameUser[0]?.email;
//     const newImage = new ProfileImage();
//     newImage.name = req.file.originalname;
//     newImage.data = req.file.buffer;
//     newImage.email = mail;
//     newImage.contentType = req.file.mimetype;
//     newImage.save()
//         .then(image => {
//             res.redirect('/profile');
//         })
//         .catch(err => {
//             res.status(500).send(err);
//         });
// });

// Define route to display image by ID
// router.get('/:id', async (req, res) => {
//     const imageId = req.params.id;
//     ProfileImage.findById(imageId)
//         .then(image => {
//             if (!image) {
//                 return res.status(404).send('Image not found');
//             }
//             res.set('Content-Type', image.contentType);
//             res.send(image.data);

//         })
//         .catch(err => {
//             res.status(500).send(err);
//         });
// });

// // Define route to delete image by ID
// router.delete('/:id', async (req, res) => {
//     const imageId = req.params.id;
//     nameUser = await Users.find({ email: req.user.email })
//     ProfileImage.findByIdAndDelete(imageId)
//         .then(image => {
//             if (!image) {
//                 return res.status(404).send('Image not found');
//             }
//             res.redirect("/profile");
//         })
//         .catch(err => {
//             res.status(500).send(err);
//         });
// });


module.exports = router;