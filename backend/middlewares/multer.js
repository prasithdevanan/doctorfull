import multer from 'multer';

// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         console.log(file);
//         callback(null, "/uploads"); // Folder must exist
//     },
//     filename: function (req, file, callback) {
//         callback(null, Date.now() + "-" + file.originalname); // avoid overwrites
//     }
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });


export default upload;