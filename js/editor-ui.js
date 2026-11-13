// ==========================================
// 3. Tabs, Template Selection, Page Size, Margins & Drag-Drop Order
// ==========================================

function switchTab(tabId) {
        document.querySelectorAll('.editor-tab').forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('hover:bg-slate-800');
            if (btn.id !== 'tab-coverletter') btn.classList.add('text-slate-300');
        });
        const activeTabBtn = document.getElementById('tab-' + tabId);
        if (activeTabBtn) {
            activeTabBtn.classList.add('bg-indigo-600', 'text-white');
            activeTabBtn.classList.remove('text-slate-300', 'hover:bg-slate-800');
        }

        document.querySelectorAll('.editor-content').forEach(content => {
            content.classList.add('hidden');
        });
        const activeContent = document.getElementById('content-' + tabId);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }
        if (tabId === 'coverletter') {
            generateAutoCoverLetter();
        }
    }

    function renderCategories() {
        const container = document.getElementById('templateCategoriesContainer');
        if (!container) return;
        container.innerHTML = '';

        categories.forEach(cat => {
            let isCatSelected = cvData.templateCat === cat.id;
            let subHtml = cat.subTemplates.map(sub => `
                <div onclick="selectSubTemplate('${cat.id}', '${sub.id}', event)" class="p-2.5 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${cvData.subTemplate === sub.id ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow' : 'border-slate-700/60 bg-slate-800/60 text-slate-300 hover:border-indigo-400'}">
                    <span><i class="fa-solid fa-check-circle mr-1.5 ${cvData.subTemplate === sub.id ? 'text-indigo-400' : 'text-slate-600'}"></i> ${sub.name}</span>
                    <span class="text-[10px] bg-slate-900/50 px-2 py-0.5 rounded text-slate-400">Select</span>
                </div>
            `).join('');

            container.innerHTML += `
                <div class="border ${isCatSelected ? 'border-indigo-500 bg-slate-800/80 shadow-lg' : 'border-slate-700 bg-slate-800/40'} p-4 rounded-xl space-y-3">
                    <div class="flex justify-between items-center cursor-pointer" onclick="selectCategory('${cat.id}')">
                        <div>
                            <h4 class="text-xs font-bold text-white flex items-center gap-2"><input type="radio" name="catSelect" ${isCatSelected ? 'checked' : ''} onchange="selectCategory('${cat.id}')"> ${cat.name}</h4>
                            <p class="text-[10px] text-slate-400 pl-5">${cat.desc}</p>
                        </div>
                        <span class="text-[10px] text-indigo-400 font-semibold">${cat.subTemplates.length} Designs</span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2 border-t border-slate-700/50">
                        ${subHtml}
                    </div>
                </div>
            `;
        });
    }

    function selectCategory(catId) {
        cvData.templateCat = catId;
        const catObj = categories.find(c => c.id === catId);
        if (catObj && catObj.subTemplates.length > 0) {
            cvData.subTemplate = catObj.subTemplates[0].id;
        }
        renderCategories();
        triggerUpdate();
    }

    function selectSubTemplate(catId, subId, event) {
        if(event) event.stopPropagation();
        cvData.templateCat = catId;
        cvData.subTemplate = subId;
        renderCategories();
        triggerUpdate();
    }

    function updatePageSize() {
        const selected = document.querySelector('input[name="pageSize"]:checked');
        if (selected) cvData.pageSize = selected.value;
        applyPageSizeClass();
        renderPageBreakIndicators();
        triggerAutoCloudSync();
    }

    function updatePageSizeSelection() {
        const radios = document.querySelectorAll('input[name="pageSize"]');
        radios.forEach(r => {
            if(r.value === cvData.pageSize) r.checked = true;
        });
        applyPageSizeClass();
    }

    function applyPageSizeClass() {
        const wrapper = document.getElementById('previewSheetWrapper');
        if(!wrapper) return;
        wrapper.className = "relative transition-all duration-300 shadow-2xl bg-white text-slate-900 rounded-sm overflow-hidden";
        if (cvData.pageSize === 'letter') wrapper.classList.add('page-letter');
        else if (cvData.pageSize === 'legal') wrapper.classList.add('page-legal');
        else if (cvData.pageSize === 'a5') wrapper.classList.add('page-a5');
        else if (cvData.pageSize === 'b5') wrapper.classList.add('page-b5');
        else wrapper.classList.add('page-a4');
    }

    function setMarginPreset(preset) {
        cvData.marginPreset = preset;
        const customDiv = document.getElementById('customMarginControl');
        if (preset === 'custom') {
            if(customDiv) customDiv.classList.remove('hidden');
            cvData.customMargin = document.getElementById('customMarginInput')?.value || 'p-10';
        } else {
            if(customDiv) customDiv.classList.add('hidden');
            if (preset === 'narrow') cvData.customMargin = 'p-6';
            else if (preset === 'wide') cvData.customMargin = 'p-14';
            else cvData.customMargin = 'p-10';
        }
        triggerUpdate();
    }

    function updateCustomMargin(val) {
        cvData.customMargin = val || 'p-10';
        triggerUpdate();
    }

    function updateMarginUI() {
        const radios = document.querySelectorAll('input[name="marginPreset"]');
        radios.forEach(r => {
            if(r.value === cvData.marginPreset) r.checked = true;
        });
        const customDiv = document.getElementById('customMarginControl');
        if (cvData.marginPreset === 'custom') {
            if(customDiv) customDiv.classList.remove('hidden');
            setValueSafely('customMarginInput', cvData.customMargin);
        } else {
            if(customDiv) customDiv.classList.add('hidden');
        }
    }

    function setZoom(scale) {
        const wrapper = document.getElementById('previewSheetWrapper');
        if (wrapper) wrapper.style.transform = `scale(${scale})`;
    }

    function syncInputsToDOM() {
        setValueSafely('fullName', cvData.fullName);
        setValueSafely('jobTitle', cvData.jobTitle);
        setValueSafely('email', cvData.email);
        setValueSafely('phone', cvData.phone);
        setValueSafely('location', cvData.location);
        setValueSafely('linkedin', cvData.linkedin);
        setValueSafely('summary', cvData.summary);
        setValueSafely('skills', cvData.skills);
        setValueSafely('declaration', cvData.declaration);
        setValueSafely('primaryColor', cvData.primaryColor);
        setValueSafely('fontFamily', cvData.fontFamily);
        setValueSafely('fontSizeScale', cvData.fontSizeScale || '1');
        setValueSafely('lineSpacing', cvData.lineSpacing || '1.5');
        setValueSafely('clCompanyName', cvData.clCompanyName || '');
        setValueSafely('clManagerName', cvData.clManagerName || '');

        const colorHex = document.getElementById('colorHexText');
        if(colorHex) colorHex.innerText = cvData.primaryColor;

        const imgEl = document.getElementById('profileImgDisplay');
        const placeholder = document.getElementById('photoPlaceholderIcon');
        if (cvData.profileImage) {
            if(imgEl) { imgEl.src = cvData.profileImage; imgEl.classList.remove('hidden'); }
            if(placeholder) placeholder.classList.add('hidden');
        } else {
            if(imgEl) imgEl.classList.add('hidden');
            if(placeholder) placeholder.classList.remove('hidden');
        }

        renderSectionOrderList();
        renderDynamicLists();
    }

    function setValueSafely(id, val) {
        const el = document.getElementById(id);
        if (el) el.value = val !== undefined ? val : '';
    }

    function triggerUpdate() {
        try {
            cvData.fullName = document.getElementById('fullName')?.value ?? cvData.fullName;
            cvData.jobTitle = document.getElementById('jobTitle')?.value ?? cvData.jobTitle;
            cvData.email = document.getElementById('email')?.value ?? cvData.email;
            cvData.phone = document.getElementById('phone')?.value ?? cvData.phone;
            cvData.location = document.getElementById('location')?.value ?? cvData.location;
            cvData.linkedin = document.getElementById('linkedin')?.value ?? cvData.linkedin;
            cvData.summary = document.getElementById('summary')?.value ?? cvData.summary;
            cvData.skills = document.getElementById('skills')?.value ?? cvData.skills;
            cvData.declaration = document.getElementById('declaration')?.value ?? cvData.declaration;
            cvData.primaryColor = document.getElementById('primaryColor')?.value || '#4f46e5';
            cvData.fontFamily = document.getElementById('fontFamily')?.value || 'Inter';
            cvData.fontSizeScale = document.getElementById('fontSizeScale')?.value || '1';
            cvData.lineSpacing = document.getElementById('lineSpacing')?.value || '1.5';

            const colorHex = document.getElementById('colorHexText');
            if(colorHex) colorHex.innerText = cvData.primaryColor;

            const shapeRadio = document.querySelector('input[name="photoShape"]:checked');
            if(shapeRadio) cvData.photoShape = shapeRadio.value;

            renderPreview();
            calculateAtsScore();
            generateAutoCoverLetter();
            triggerAutoCloudSync();
        } catch (e) {
            console.error("Update error:", e);
        }
    }

    function updateFieldFromPreview(field, val) {
        cvData[field] = val;
        if(document.getElementById(field)) {
            document.getElementById(field).value = val;
        }
        calculateAtsScore();
        generateAutoCoverLetter();
        triggerAutoCloudSync();
    }

    // --- Drag & Drop Section Order Logic ---
    function renderSectionOrderList() {
        const container = document.getElementById('sectionOrderList');
        if (!container) return;
        const order = (cvData.sectionOrder && cvData.sectionOrder.length) ? cvData.sectionOrder : DEFAULT_SECTION_ORDER;
        container.innerHTML = order.map((secKey, idx) => `
            <div draggable="true"
                 ondragstart="handleSectionDragStart(event, ${idx})"
                 ondragover="handleSectionDragOver(event)"
                 ondrop="handleSectionDrop(event, ${idx})"
                 class="flex items-center justify-between bg-slate-900/90 border border-slate-700 hover:border-indigo-500 px-3 py-2 rounded-lg cursor-move transition">
                <div class="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
                    <i class="fa-solid fa-grip-vertical text-slate-500"></i>
                    <span>${idx + 1}. ${SECTION_LABELS[secKey] || secKey}</span>
                </div>
                <div class="flex items-center gap-1">
                    <button type="button" onclick="moveSectionOrder(${idx}, -1)" class="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300" title="Move Up"><i class="fa-solid fa-arrow-up"></i></button>
                    <button type="button" onclick="moveSectionOrder(${idx}, 1)" class="px-1.5 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300" title="Move Down"><i class="fa-solid fa-arrow-down"></i></button>
                </div>
            </div>
        `).join('');
    }

    function handleSectionDragStart(e, idx) {
        draggedSectionIdx = idx;
        e.dataTransfer.effectAllowed = 'move';
    }

    function handleSectionDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleSectionDrop(e, targetIdx) {
        e.preventDefault();
        if (draggedSectionIdx === null || draggedSectionIdx === targetIdx) return;
        const order = [...(cvData.sectionOrder || DEFAULT_SECTION_ORDER)];
        const [moved] = order.splice(draggedSectionIdx, 1);
        order.splice(targetIdx, 0, moved);
        cvData.sectionOrder = order;
        draggedSectionIdx = null;
        renderSectionOrderList();
        triggerUpdate();
    }

    function moveSectionOrder(idx, dir) {
        const order = [...(cvData.sectionOrder || DEFAULT_SECTION_ORDER)];
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= order.length) return;
        [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
        cvData.sectionOrder = order;
        renderSectionOrderList();
        triggerUpdate();
    }

    function resetSectionOrder() {
        cvData.sectionOrder = [...DEFAULT_SECTION_ORDER];
        renderSectionOrderList();
        triggerUpdate();
    }

    // --- Page Break Visual Indicator ---
    function renderPageBreakIndicators() {
        const overlay = document.getElementById('pageBreakOverlay');
        const wrapper = document.getElementById('previewSheetWrapper');
        const toggle = document.getElementById('togglePageBreakCheck');
        if (!overlay || !wrapper) return;

        overlay.innerHTML = '';
        if (toggle && !toggle.checked) return;

        // Standard pixel heights at 96 DPI for 1 page
        const pageHeightsPx = {
            a4: 1122.5,     // 297mm
            letter: 1056,   // 11in
            legal: 1344,    // 14in
            a5: 793.7,      // 210mm
            b5: 944.8       // 250mm
        };
        const singlePageH = pageHeightsPx[cvData.pageSize] || 1122.5;
        const totalH = wrapper.scrollHeight;
        let pageNum = 1;
        while (singlePageH * pageNum < totalH - 10) {
            const topPos = singlePageH * pageNum;
            const line = document.createElement('div');
            line.className = 'page-break-line';
            line.style.top = `${topPos}px`;
            line.innerHTML = `<span class="page-break-badge">Page ${pageNum} End / Page ${pageNum + 1} Start</span>`;
            overlay.appendChild(line);
            pageNum++;
        }
    }
