const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// 静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// 图片压缩接口
app.post('/compress', upload.single('image'), async (req, res) => {
    try {
        const quality = parseInt(req.body.quality * 100);
        const buffer = req.file.buffer;
        
        const compressedImage = await sharp(buffer)
            .jpeg({ quality: quality })
            .toBuffer();
            
        res.set('Content-Type', 'image/jpeg');
        res.send(compressedImage);
    } catch (error) {
        console.error('压缩错误:', error);
        res.status(500).send('图片压缩失败');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
}); 