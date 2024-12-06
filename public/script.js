document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');
    const controlSection = document.querySelector('.control-section');
    const previewSection = document.querySelector('.preview-section');

    // 拖拽上传处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#007AFF';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5EA';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#E5E5EA';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 点击上传处理
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // 质量滑块处理
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        compressImage();
    });

    // 文件处理函数
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            
            // 显示控制和预览区域
            controlSection.style.display = 'block';
            previewSection.style.display = 'block';
            
            compressImage();
        };
        reader.readAsDataURL(file);
    }

    // 图片压缩函数
    async function compressImage() {
        const quality = qualitySlider.value / 100;
        const formData = new FormData();
        
        // 获取原始图片的 blob
        const response = await fetch(originalImage.src);
        const blob = await response.blob();
        formData.append('image', blob);
        formData.append('quality', quality);

        try {
            const res = await fetch('/compress', {
                method: 'POST',
                body: formData
            });
            
            const compressedBlob = await res.blob();
            const compressedUrl = URL.createObjectURL(compressedBlob);
            compressedImage.src = compressedUrl;
            compressedSize.textContent = formatFileSize(compressedBlob.size);

            // 设置下载按钮
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = compressedUrl;
                link.download = 'compressed-image.' + blob.type.split('/')[1];
                link.click();
            };
        } catch (error) {
            console.error('压缩失败:', error);
            alert('图片压缩失败，请重试！');
        }
    }

    // 文件大小格式化
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 