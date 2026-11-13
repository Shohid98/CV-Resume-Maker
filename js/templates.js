// ==========================================
// 5. All 18 CV Template Designs & Live Preview Renderer
// (Edit specific CV template HTML/layouts easily here)
// ==========================================

// Helper to build ordered sections dynamically
    function buildOrderedSections(titleRenderer, skillsRenderer) {
        const order = (cvData.sectionOrder && cvData.sectionOrder.length) ? cvData.sectionOrder : DEFAULT_SECTION_ORDER;

        const expHtml = cvData.experiences.map(e => {
            const durationDisplay = formatExperienceDurationDisplay(e);
            const companyLine = [e.company, e.location].filter(Boolean).join(' • ');
            return `
            <div class="mb-3">
                <div class="flex justify-between items-baseline gap-2 font-bold text-xs">
                    <span>${e.title || ''}</span>
                    <span class="text-slate-600 font-medium text-[11px] text-right">${durationDisplay}</span>
                </div>
                <div class="text-xs font-semibold text-slate-700 mb-1">${companyLine}</div>
                <div class="text-xs text-slate-600 leading-relaxed exp-formatted-desc">${formatRichDescriptionHTML(e.desc)}</div>
            </div>`;
        }).join('');

        const projHtml = cvData.projects.map(p => `
            <div class="mb-3">
                <div class="flex justify-between font-bold text-xs">
                    <span>${p.name}</span>
                    <span style="color: ${cvData.primaryColor}" class="text-[11px]">${p.link}</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">${p.desc}</p>
            </div>
        `).join('');

        const eduHtml = cvData.educations.map(ed => `
            <div class="mb-2">
                <div class="flex justify-between font-bold text-xs">
                    <span>${ed.degree}</span>
                    <span class="text-slate-600">${ed.duration}</span>
                </div>
                <div class="text-xs text-slate-700">${ed.institution} ${ed.grade ? '• ' + ed.grade : ''}</div>
            </div>
        `).join('');

        const customHtml = cvData.customSections.map(cs => `
            <div class="mt-3">
                ${titleRenderer(cs.title)}
                <p class="text-xs text-slate-600 whitespace-pre-line">${cs.content}</p>
            </div>
        `).join('');

        const sectionBlocks = {
            summary: cvData.summary ? `<div>${titleRenderer('Professional Summary')}<p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line" contenteditable="true" onblur="updateFieldFromPreview('summary', this.innerText)">${cvData.summary}</p></div>` : '',
            experience: expHtml ? `<div>${titleRenderer('Work Experience')}${expHtml}</div>` : '',
            projects: projHtml ? `<div>${titleRenderer('Key Projects')}${projHtml}</div>` : '',
            education: eduHtml ? `<div>${titleRenderer('Education')}${eduHtml}</div>` : '',
            skills: cvData.skills ? `<div>${titleRenderer('Core Skills')}${skillsRenderer()}</div>` : '',
            custom: customHtml
        };

        return order.map(k => sectionBlocks[k] || '').filter(Boolean).join('');
    }

    function renderPreview() {
        const printable = document.getElementById('printable-cv');
        const labelEl = document.getElementById('activeTemplateNameLabel');
        if(!printable) return;

        // Apply Font Size Scale & Line Spacing
        printable.style.setProperty('--cv-scale', cvData.fontSizeScale || '1');
        printable.style.setProperty('--cv-leading', cvData.lineSpacing || '1.5');

        let fontClass = 'font-sans';
        if (cvData.fontFamily === 'Merriweather') fontClass = 'font-merriweather';
        else if (cvData.fontFamily === 'Roboto') fontClass = 'font-roboto';

        const activeCatObj = categories.find(c => c.id === cvData.templateCat);
        const activeSubObj = activeCatObj?.subTemplates.find(s => s.id === cvData.subTemplate);
        if(labelEl) labelEl.innerText = activeSubObj ? activeSubObj.name : 'Resume';

        let marginCls = cvData.customMargin || 'p-10';
        let shapeClass = cvData.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg';
        let photoHtml = cvData.profileImage
            ? `<img src="${cvData.profileImage}" class="w-20 h-20 object-cover ${shapeClass} border-2 shadow shrink-0" style="border-color: ${cvData.primaryColor}">`
            : '';

        let skillsHtml = cvData.skills ? cvData.skills.split(',').map(s => `<span class="bg-slate-100 text-slate-800 px-2 py-1 rounded text-[11px] font-medium border border-slate-200">${s.trim()}</span>`).join(' ') : '';

        let expHtml = cvData.experiences.map(e => {
            const durationDisplay = formatExperienceDurationDisplay(e);
            const companyLine = [e.company, e.location].filter(Boolean).join(' • ');
            return `
            <div class="mb-3">
                <div class="flex justify-between items-baseline gap-2 font-bold text-xs">
                    <span>${e.title || ''}</span>
                    <span class="text-slate-600 font-medium text-[11px] text-right">${durationDisplay}</span>
                </div>
                <div class="text-xs font-semibold text-slate-700 mb-1">${companyLine}</div>
                <div class="text-xs text-slate-600 leading-relaxed exp-formatted-desc">${formatRichDescriptionHTML(e.desc)}</div>
            </div>
        `}).join('');

        let projHtml = cvData.projects.map(p => `
            <div class="mb-3">
                <div class="flex justify-between font-bold text-xs">
                    <span>${p.name}</span>
                    <span class="text-indigo-600 text-[11px]">${p.link}</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line">${p.desc}</p>
            </div>
        `).join('');

        let eduHtml = cvData.educations.map(ed => `
            <div class="mb-2">
                <div class="flex justify-between font-bold text-xs">
                    <span>${ed.degree}</span>
                    <span class="text-slate-600">${ed.duration}</span>
                </div>
                <div class="text-xs text-slate-700">${ed.institution} ${ed.grade ? '• ' + ed.grade : ''}</div>
            </div>
        `).join('');

        let customHtml = cvData.customSections.map(cs => `
            <div class="mt-4">
                <h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">${cs.title}</h3>
                <p class="text-xs text-slate-600 whitespace-pre-line">${cs.content}</p>
            </div>
        `).join('');

        let declHtml = cvData.declaration
            ? `<div class="mt-5 pt-3 border-t border-slate-200 text-[11px] text-slate-600 italic"><strong>Declaration:</strong> ${cvData.declaration}</div>`
            : '';

        let sub = cvData.subTemplate;

        // 1. ATS Templates (Unchanged)
        if (sub === 'ats-classic') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-1.5" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">${t}</h3>`,
                () => `<div class="flex flex-wrap gap-1">${skillsHtml}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="flex items-center gap-4 border-b pb-4 mb-4" style="border-color: ${cvData.primaryColor}">
                    ${photoHtml}
                    <div class="flex-1 text-center">
                        <h1 class="text-2xl font-bold text-slate-900 outline-none" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                        <p class="text-sm font-semibold mt-0.5" style="color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        <p class="text-xs text-slate-600 mt-1">${[cvData.email, cvData.phone, cvData.location, cvData.linkedin].filter(Boolean).join(' • ')}</p>
                    </div>
                </div>
                <div class="space-y-4">${orderedBody}${declHtml}</div>
            `;
        } else if (sub === 'ats-modern') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 mb-2" style="color: ${cvData.primaryColor}">${t}</h3>`,
                () => `<div class="flex flex-wrap gap-1">${skillsHtml}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="flex justify-between items-center border-b-2 pb-4 mb-4" style="border-color: ${cvData.primaryColor}">
                    <div class="flex items-center gap-3">
                        ${photoHtml}
                        <div>
                            <h1 class="text-2xl font-black text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-sm font-bold uppercase tracking-wider" style="color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        </div>
                    </div>
                    <div class="text-right text-xs text-slate-600">
                        <p>${cvData.email}</p><p>${cvData.phone}</p><p>${cvData.location}</p>
                    </div>
                </div>
                <div class="space-y-4">${orderedBody}${declHtml}</div>
            `;
        } else if (sub === 'ats-executive') {
            const orderedBody = buildOrderedSections(
                t => `<h4 class="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">${t}</h4>`,
                () => `<div class="flex flex-wrap gap-1">${skillsHtml}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="flex items-center gap-4 mb-4">
                    ${photoHtml}
                    <div>
                        <h1 class="text-3xl font-light text-slate-900 tracking-tight" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                        <p class="text-xs tracking-widest uppercase text-slate-500 mt-1" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${[cvData.jobTitle, cvData.email, cvData.phone].filter(Boolean).join(' • ')}</p>
                    </div>
                </div>
                <div class="space-y-4 border-t pt-4 border-slate-300">${orderedBody}${declHtml}</div>
            `;
        }
        // 2. Official & Govt Templates (Unchanged)
        else if (sub === 'off-table') {
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="border-2 p-4 mb-4 flex items-center gap-4" style="border-color: ${cvData.primaryColor}">
                    ${photoHtml}
                    <div class="flex-1 text-center">
                        <h1 class="text-2xl font-bold uppercase text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                        <p class="text-xs font-semibold uppercase text-slate-700" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        <p class="text-[11px] text-slate-600 mt-1">${[cvData.email, cvData.phone, cvData.location].filter(Boolean).join(' | ')}</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div><h3 class="text-xs font-bold uppercase bg-slate-200 p-1 mb-1 text-slate-900 border-l-4" style="border-color: ${cvData.primaryColor}">1. Career Objective</h3><p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line" contenteditable="true" onblur="updateFieldFromPreview('summary', this.innerText)">${cvData.summary}</p></div>
                    <div><h3 class="text-xs font-bold uppercase bg-slate-200 p-1 mb-2 text-slate-900 border-l-4" style="border-color: ${cvData.primaryColor}">2. Employment Record</h3>${expHtml}</div>
                    <div><h3 class="text-xs font-bold uppercase bg-slate-200 p-1 mb-2 text-slate-900 border-l-4" style="border-color: ${cvData.primaryColor}">3. Academic Qualifications</h3>${eduHtml}</div>
                    <div><h3 class="text-xs font-bold uppercase bg-slate-200 p-1 mb-2 text-slate-900 border-l-4" style="border-color: ${cvData.primaryColor}">4. Professional Skills</h3><div class="flex flex-wrap gap-1">${skillsHtml}</div></div>
                    ${customHtml}
                    ${declHtml}
                </div>
            `;
        } else if (sub === 'off-formal') {
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="border-b-2 pb-4 mb-4 flex justify-between items-center" style="border-color: ${cvData.primaryColor}">
                    <div>
                        <h1 class="text-2xl font-bold tracking-tight text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                        <p class="text-xs font-medium text-slate-600 uppercase" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                    </div>
                    <div class="flex items-center gap-3">
                        ${photoHtml}
                        <div class="text-right text-xs text-slate-600">
                            <p>${cvData.email}</p><p>${cvData.phone}</p><p>${cvData.location}</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div><h3 class="text-xs font-bold uppercase tracking-wider mb-1" style="color: ${cvData.primaryColor}">Executive Summary</h3><p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line" contenteditable="true" onblur="updateFieldFromPreview('summary', this.innerText)">${cvData.summary}</p></div>
                    <div><h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: ${cvData.primaryColor}">Professional Experience</h3>${expHtml}</div>
                    <div><h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: ${cvData.primaryColor}">Projects & Initiatives</h3>${projHtml}</div>
                    <div><h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: ${cvData.primaryColor}">Education & Credentials</h3>${eduHtml}</div>
                    <div><h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: ${cvData.primaryColor}">Core Competencies</h3><div class="flex flex-wrap gap-1">${skillsHtml}</div></div>
                    ${customHtml}${declHtml}
                </div>
            `;
        } else if (sub === 'off-govt') {
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="text-center border-b-2 pb-4 mb-4" style="border-color: ${cvData.primaryColor}">
                    ${cvData.profileImage ? `<div class="flex justify-center mb-2">${photoHtml}</div>` : ''}
                    <h1 class="text-2xl font-bold uppercase text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                    <p class="text-xs font-semibold text-slate-700 uppercase" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                    <p class="text-[11px] text-slate-600 mt-1">Email: ${cvData.email} | Phone: ${cvData.phone} | Address: ${cvData.location}</p>
                </div>
                <div class="space-y-3">
                    <div><h4 class="text-xs font-bold uppercase bg-slate-100 p-1 text-slate-900 mb-1">Career Objective</h4><p class="text-xs text-slate-700 whitespace-pre-line" contenteditable="true" onblur="updateFieldFromPreview('summary', this.innerText)">${cvData.summary}</p></div>
                    <div><h4 class="text-xs font-bold uppercase bg-slate-100 p-1 text-slate-900 mb-1">Work History</h4>${expHtml}</div>
                    <div><h4 class="text-xs font-bold uppercase bg-slate-100 p-1 text-slate-900 mb-1">Academic Background</h4>${eduHtml}</div>
                    <div><h4 class="text-xs font-bold uppercase bg-slate-100 p-1 text-slate-900 mb-1">Skills</h4><div class="flex flex-wrap gap-1">${skillsHtml}</div></div>
                    ${customHtml}${declHtml}
                </div>
            `;
        }
        // 3. Modern Sidebar Templates (Unchanged)
        else if (sub.startsWith('mod')) {
            let isRight = sub === 'mod-right';
            let isSplit = sub === 'mod-split';
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="grid grid-cols-3 gap-6 h-full">
                    <div class="${isRight ? 'col-span-1 order-2' : 'col-span-1 order-1'} bg-slate-100 p-4 rounded-lg space-y-4 border border-slate-200">
                        ${photoHtml}
                        <div>
                            <h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: ${cvData.primaryColor}">Contact</h3>
                            <p class="text-[11px] text-slate-600 mb-1 break-all"><i class="fa-solid fa-envelope mr-1"></i> ${cvData.email}</p>
                            <p class="text-[11px] text-slate-600 mb-1"><i class="fa-solid fa-phone mr-1"></i> ${cvData.phone}</p>
                            <p class="text-[11px] text-slate-600 mb-1"><i class="fa-solid fa-location-dot mr-1"></i> ${cvData.location}</p>
                            <p class="text-[11px] text-slate-600 break-all"><i class="fa-solid fa-link mr-1"></i> ${cvData.linkedin}</p>
                        </div>
                        <div>
                            <h3 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: ${cvData.primaryColor}">Skills</h3>
                            <div class="flex flex-wrap gap-1">${skillsHtml}</div>
                        </div>
                        ${isSplit ? customHtml : ''}
                    </div>
                    <div class="${isRight ? 'col-span-2 order-1' : 'col-span-2 order-2'} space-y-4">
                        <div>
                            <h1 class="text-2xl font-black text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-sm font-semibold" style="color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        </div>
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-1" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Summary</h3><p class="text-xs text-slate-600 leading-relaxed whitespace-pre-line" contenteditable="true" onblur="updateFieldFromPreview('summary', this.innerText)">${cvData.summary}</p></div>
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Experience</h3>${expHtml}</div>
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Projects</h3>${projHtml}</div>
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Education</h3>${eduHtml}</div>
                        ${!isSplit ? customHtml : ''}${declHtml}
                    </div>
                </div>
            `;
        }
        // 4. FIXED: Corporate Pro (3 Distinct Sub-Templates)
        else if (sub === 'corp-standard') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-1.5" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">${t}</h3>`,
                () => `<div class="flex flex-wrap gap-1">${skillsHtml}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="p-6 rounded-t-lg mb-6 flex justify-between items-center text-white" style="background-color: ${cvData.primaryColor}">
                    <div class="flex items-center gap-4">
                        ${photoHtml}
                        <div>
                            <h1 class="text-2xl font-bold" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-xs text-slate-200 mt-1" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        </div>
                    </div>
                    <div class="text-right text-xs text-slate-200">
                        <p>${cvData.email}</p><p>${cvData.phone}</p><p>${cvData.location}</p>
                    </div>
                </div>
                <div class="space-y-4 px-2">${orderedBody}${declHtml}</div>
            `;
        } else if (sub === 'corp-classic') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-xs font-bold uppercase tracking-wider border-l-4 pl-2.5 py-0.5 bg-slate-50 mb-2 text-slate-800" style="border-color: ${cvData.primaryColor}">${t}</h3>`,
                () => `<div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs text-slate-700">${cvData.skills.split(',').map(s => `<div><span style="color:${cvData.primaryColor}">▪</span> ${s.trim()}</div>`).join('')}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="border-t-8 pt-5 pb-4 mb-5 border-b border-slate-200 flex justify-between items-start gap-4" style="border-top-color: ${cvData.primaryColor}">
                    <div class="flex items-center gap-4">
                        ${photoHtml}
                        <div>
                            <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-sm font-semibold mt-0.5" style="color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                            <div class="flex flex-wrap gap-3 text-[11px] text-slate-600 mt-2">
                                ${cvData.email ? `<span><i class="fa-solid fa-envelope mr-1"></i>${cvData.email}</span>` : ''}
                                ${cvData.phone ? `<span><i class="fa-solid fa-phone mr-1"></i>${cvData.phone}</span>` : ''}
                                ${cvData.location ? `<span><i class="fa-solid fa-location-dot mr-1"></i>${cvData.location}</span>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">${orderedBody}${declHtml}</div>
            `;
        } else if (sub === 'corp-bold') {
            const orderedBody = buildOrderedSections(
                t => `<div class="flex items-center gap-2 mb-2"><span class="w-2.5 h-2.5 rounded-sm inline-block" style="background-color:${cvData.primaryColor}"></span><h3 class="text-xs font-black uppercase tracking-widest text-slate-900">${t}</h3><div class="flex-1 h-[1px] bg-slate-200"></div></div>`,
                () => `<div class="flex flex-wrap gap-1.5">${cvData.skills.split(',').map(s => `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-white" style="background-color:${cvData.primaryColor}">${s.trim()}</span>`).join('')}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="bg-slate-900 text-white p-6 rounded-xl mb-6 flex justify-between items-center gap-4 border-b-4" style="border-bottom-color: ${cvData.primaryColor}">
                    <div class="flex items-center gap-4">
                        ${photoHtml}
                        <div>
                            <h1 class="text-2xl font-black uppercase tracking-wide" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-xs font-bold uppercase tracking-widest mt-1 px-2 py-0.5 rounded inline-block" style="background-color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        </div>
                    </div>
                    <div class="text-right text-[11px] text-slate-300 space-y-0.5">
                        <p>${cvData.email}</p><p>${cvData.phone}</p><p>${cvData.location}</p><p>${cvData.linkedin}</p>
                    </div>
                </div>
                <div class="space-y-4">${orderedBody}${declHtml}</div>
            `;
        }
        // 5. FIXED: Creative Tech (3 Distinct Sub-Templates)
        else if (sub === 'tech-developer') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-xs font-bold uppercase tracking-wider font-mono mb-1.5" style="color: ${cvData.primaryColor}">// ${t}</h3>`,
                () => `<div class="flex flex-wrap gap-1.5 font-mono">${cvData.skills.split(',').map(s => `<span class="bg-slate-900 text-emerald-400 px-2 py-0.5 rounded text-[11px]">&lt;${s.trim()} /&gt;</span>`).join('')}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="bg-slate-900 text-white p-5 rounded-lg mb-5 border-l-4" style="border-left-color: ${cvData.primaryColor}">
                    <div class="flex items-center gap-4">
                        ${photoHtml}
                        <div>
                            <h1 class="text-2xl font-black tracking-tight" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-xs font-mono font-bold px-2 py-0.5 rounded inline-block text-white mt-1" style="background-color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                            <p class="text-xs text-slate-300 font-mono mt-1.5">${[cvData.email, cvData.phone, cvData.linkedin].filter(Boolean).join(' • ')}</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">${orderedBody}${declHtml}</div>
            `;
        } else if (sub === 'tech-creative') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-xs font-extrabold uppercase tracking-wider inline-block px-2.5 py-0.5 rounded-md mb-2 text-white" style="background-color: ${cvData.primaryColor}">${t}</h3>`,
                () => `<div class="flex flex-wrap gap-1.5">${cvData.skills.split(',').map(s => `<span class="border px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style="border-color:${cvData.primaryColor}; color:${cvData.primaryColor}">${s.trim()}</span>`).join('')}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="p-5 rounded-2xl mb-5 flex justify-between items-center gap-4 border" style="background-color: ${cvData.primaryColor}12; border-color: ${cvData.primaryColor}40">
                    <div class="flex items-center gap-4">
                        ${photoHtml}
                        <div>
                            <h1 class="text-2xl font-black text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-sm font-bold" style="color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                            <p class="text-[11px] text-slate-600 mt-1">${[cvData.email, cvData.phone, cvData.location].filter(Boolean).join(' | ')}</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">${orderedBody}${declHtml}</div>
            `;
        } else if (sub === 'tech-modern') {
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="border-b-4 pb-4 mb-5 flex justify-between items-end" style="border-color: ${cvData.primaryColor}">
                    <div class="flex items-center gap-4">
                        ${photoHtml}
                        <div>
                            <h1 class="text-2xl font-black text-slate-900 tracking-tight" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-xs font-bold uppercase tracking-widest mt-0.5" style="color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        </div>
                    </div>
                    <div class="text-right text-[11px] text-slate-600">
                        <p>${cvData.email}</p><p>${cvData.phone}</p><p>${cvData.linkedin}</p>
                    </div>
                </div>
                <div class="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line" contenteditable="true" onblur="updateFieldFromPreview('summary', this.innerText)">${cvData.summary}</p>
                </div>
                <div class="grid grid-cols-3 gap-5 flex-1">
                    <div class="col-span-2 space-y-4">
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Experience</h3>${expHtml}</div>
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Projects</h3>${projHtml}</div>
                    </div>
                    <div class="col-span-1 space-y-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Tech Stack</h3><div class="flex flex-wrap gap-1">${skillsHtml}</div></div>
                        <div><h3 class="text-xs font-bold uppercase tracking-wider pb-1 border-b mb-2" style="color: ${cvData.primaryColor}; border-color: ${cvData.primaryColor}">Education</h3>${eduHtml}</div>
                        ${customHtml}
                    </div>
                </div>
                ${declHtml}
            `;
        }
        // 6. FIXED: Minimalist (3 Distinct Sub-Templates)
        else if (sub === 'min-clean') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 border-b border-slate-200 pb-1 mb-2">${t}</h3>`,
                () => `<p class="text-xs text-slate-700 leading-relaxed">${cvData.skills.split(',').map(s => s.trim()).filter(Boolean).join('  •  ')}</p>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200">
                    ${photoHtml}
                    <div>
                        <h1 class="text-3xl font-light text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                        <p class="text-xs tracking-widest uppercase mt-1" style="color: ${cvData.primaryColor}" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        <p class="text-[11px] text-slate-400 mt-1.5">${[cvData.email, cvData.phone, cvData.location].filter(Boolean).join(' / ')}</p>
                    </div>
                </div>
                <div class="space-y-5">${orderedBody}${declHtml}</div>
            `;
        } else if (sub === 'min-simple') {
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-xs font-serif font-bold italic border-b pb-1 mb-2" style="color: ${cvData.primaryColor}; border-color: #e2e8f0">${t}</h3>`,
                () => `<div class="flex flex-wrap gap-1.5">${skillsHtml}</div>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col font-merriweather`;
            printable.innerHTML = `
                <div class="text-center mb-6 pb-4 border-b border-slate-300">
                    ${cvData.profileImage ? `<div class="flex justify-center mb-3">${photoHtml}</div>` : ''}
                    <h1 class="text-2xl font-bold text-slate-900 tracking-wide" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                    <p class="text-xs italic text-slate-600 mt-1" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                    <p class="text-[11px] text-slate-500 mt-2">${[cvData.email, cvData.phone, cvData.location, cvData.linkedin].filter(Boolean).join('  •  ')}</p>
                </div>
                <div class="space-y-4">${orderedBody}${declHtml}</div>
            `;
        } else {
            // min-compact
            const orderedBody = buildOrderedSections(
                t => `<h3 class="text-[11px] font-bold uppercase tracking-wider mb-1" style="color: ${cvData.primaryColor}">${t}</h3>`,
                () => `<p class="text-xs text-slate-700">${cvData.skills}</p>`
            );
            printable.className = `${marginCls} w-full h-full flex flex-col ${fontClass}`;
            printable.innerHTML = `
                <div class="flex justify-between items-center mb-4 pb-3 border-b border-slate-200">
                    <div class="flex items-center gap-3">
                        ${photoHtml}
                        <div>
                            <h1 class="text-xl font-bold text-slate-900" contenteditable="true" onblur="updateFieldFromPreview('fullName', this.innerText)">${cvData.fullName}</h1>
                            <p class="text-xs text-slate-500" contenteditable="true" onblur="updateFieldFromPreview('jobTitle', this.innerText)">${cvData.jobTitle}</p>
                        </div>
                    </div>
                    <div class="text-right text-[11px] text-slate-500">
                        <p>${cvData.email}</p><p>${cvData.phone}</p><p>${cvData.location}</p>
                    </div>
                </div>
                <div class="space-y-3">${orderedBody}${declHtml}</div>
            `;
        }

        // Update visual page breaks after DOM renders
        setTimeout(renderPageBreakIndicators, 50);
    }
