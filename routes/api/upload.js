const express = require('express');
const router = express.Router();
const uuid = require('uuid/v4')

// Gets all users
router.post('/', (req, res) => {
    // Make sure request is coming from an admin role
    if (req.role !== 'admin') {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    const { files } = req;

    if (!files) {
        return res.status(400).json({
            success: false,
            message: 'Bad request'
        });
    }

    const filename = uuid() + files.file.name;
    const path = req.workingDirectory + "/public/images/" + filename;
    const returnPath = "/images/" + filename;
    files.file.mv(path, function (error) {
        if (error) {
            return res.status(500).json({
                success: false,
                message: 'File could not be saved'
            });
        } else {
            return res.status(200).json({
                success: true,
                path: returnPath
            });
        }
    });
});

module.exports = router;