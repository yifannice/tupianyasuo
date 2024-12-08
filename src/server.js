const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const upload = multer({
    limits: {
        fileSize: 10 * 1024 * 1024 // 限制10MB
    }
});

// 静态文件服务
app.use(express.static('public'));

// 压缩图片接口
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No image file uploaded');
        }

        let quality = parseInt(req.body.quality);
        quality = Math.round(Math.pow(quality / 100, 0.5) * 100);
        console.log('服务器收到的质量值:', quality);
        console.log('处理后的质量值:', quality);
        
        const buffer = await sharp(req.file.buffer)
            .jpeg({ 
                quality: quality,
                mozjpeg: true,
                chromaSubsampling: '4:4:4',
                force: false
            })
            .withMetadata()
            .toBuffer();

        res.set('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (error) {
        console.error('Image compression error:', error);
        res.status(500).send('Image compression failed');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app; 