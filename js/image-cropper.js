// ==========================================
// 2. Manual HD Profile Photo Cropper
// ==========================================

// --- Manual HD Image Cropper Logic ---
    function openImageCropModal(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                cropSourceImage = img;
                cropOffsetX = 0;
                cropOffsetY = 0;
                const zoomRange = document.getElementById('cropZoomRange');
                if(zoomRange) zoomRange.value = 1;
                const filterSelect = document.getElementById('cropFilterSelect');
                if(filterSelect) filterSelect.value = 'none';

                const modal = document.getElementById('imageCropModal');
                if(modal) modal.classList.remove('hidden');
                redrawCropCanvas();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    function closeImageCropModal() {
        const modal = document.getElementById('imageCropModal');
        if(modal) modal.classList.add('hidden');
        cropSourceImage = null;
    }

    function redrawCropCanvas() {
        if (!cropSourceImage) return;
        const canvas = document.getElementById('cropCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const zoom = parseFloat(document.getElementById('cropZoomRange')?.value || 1);
        const filter = document.getElementById('cropFilterSelect')?.value || 'none';

        canvas.width = 300;
        canvas.height = 300;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.filter = 'none';
        if (filter === 'enhance') {
            ctx.filter = 'contrast(1.2) saturate(1.1)';
        } else if (filter === 'grayscale') {
            ctx.filter = 'grayscale(100%) contrast(1.1)';
        }

        const baseSize = Math.min(cropSourceImage.width, cropSourceImage.height);
        const drawW = baseSize * zoom;
        const drawH = baseSize * zoom;
        const drawX = (canvas.width - drawW) / 2 + cropOffsetX;
        const drawY = (canvas.height - drawH) / 2 + cropOffsetY;

        const sx = (cropSourceImage.width - baseSize) / 2;
        const sy = (cropSourceImage.height - baseSize) / 2;

        ctx.drawImage(cropSourceImage, sx, sy, baseSize, baseSize, drawX, drawY, drawW, drawH);

        ctx.filter = 'none';
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2);
        ctx.stroke();
    }

    function initCropCanvasListeners() {
        const canvas = document.getElementById('cropCanvas');
        if (!canvas) return;

        canvas.addEventListener('mousedown', (e) => {
            isDraggingCrop = true;
            dragStartX = e.clientX - cropOffsetX;
            dragStartY = e.clientY - cropOffsetY;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDraggingCrop) return;
            cropOffsetX = e.clientX - dragStartX;
            cropOffsetY = e.clientY - dragStartY;
            redrawCropCanvas();
        });

        window.addEventListener('mouseup', () => {
            isDraggingCrop = false;
        });

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDraggingCrop = true;
                dragStartX = e.touches[0].clientX - cropOffsetX;
                dragStartY = e.touches[0].clientY - cropOffsetY;
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (!isDraggingCrop || e.touches.length !== 1) return;
            cropOffsetX = e.touches[0].clientX - dragStartX;
            cropOffsetY = e.touches[0].clientY - dragStartY;
            redrawCropCanvas();
        });

        canvas.addEventListener('touchend', () => {
            isDraggingCrop = false;
        });
    }

    function confirmImageCrop() {
        if (!cropSourceImage) return;
        const hdCanvas = document.createElement('canvas');
        hdCanvas.width = 600;
        hdCanvas.height = 600;
        const hdCtx = hdCanvas.getContext('2d');

        const zoom = parseFloat(document.getElementById('cropZoomRange')?.value || 1);
        const filter = document.getElementById('cropFilterSelect')?.value || 'none';

        if (filter === 'enhance') hdCtx.filter = 'contrast(1.2) saturate(1.1)';
        else if (filter === 'grayscale') hdCtx.filter = 'grayscale(100%) contrast(1.1)';

        const baseSize = Math.min(cropSourceImage.width, cropSourceImage.height);
        const drawW = baseSize * zoom * 2;
        const drawH = baseSize * zoom * 2;
        const drawX = (hdCanvas.width - drawW) / 2 + (cropOffsetX * 2);
        const drawY = (hdCanvas.height - drawH) / 2 + (cropOffsetY * 2);

        const sx = (cropSourceImage.width - baseSize) / 2;
        const sy = (cropSourceImage.height - baseSize) / 2;

        hdCtx.drawImage(cropSourceImage, sx, sy, baseSize, baseSize, drawX, drawY, drawW, drawH);

        cvData.profileImage = hdCanvas.toDataURL('image/jpeg', 0.95);
        closeImageCropModal();
        syncInputsToDOM();
        triggerUpdate();
    }
