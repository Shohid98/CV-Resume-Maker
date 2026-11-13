// ==========================================
// 4. Experience, Projects, Education, Custom Sections & Date Helpers
// ==========================================

// --- Date Parsing & Duration Calculation Helpers ---
    function escapeAttr(str) {
        return String(str || '').replace(/"/g, '&quot;');
    }

    function parseFlexibleDate(str) {
        if (!str) return null;
        const clean = String(str).trim();
        if (!clean) return null;
        if (/^(present|current|now|ongoing|till date|continue|running)$/i.test(clean)) {
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        const isoFull = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (isoFull) return new Date(parseInt(isoFull[1], 10), parseInt(isoFull[2], 10) - 1, parseInt(isoFull[3], 10));
        const dmy = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
        if (dmy) {
            const p1 = parseInt(dmy[1], 10), p2 = parseInt(dmy[2], 10), y = parseInt(dmy[3], 10);
            if (p1 > 12) return new Date(y, p2 - 1, p1);
            if (p2 > 12) return new Date(y, p1 - 1, p2);
            return new Date(y, p2 - 1, p1);
        }
        const ym = clean.match(/^(\d{4})[\/\-](\d{1,2})$/);
        if (ym) return new Date(parseInt(ym[1], 10), parseInt(ym[2], 10) - 1, 1);
        const yOnly = clean.match(/^(\d{4})$/);
        if (yOnly) return new Date(parseInt(yOnly[1], 10), 0, 1);
        const parsed = new Date(clean);
        if (!isNaN(parsed.getTime())) return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
        return null;
    }

    function formatDisplayDateFromPicker(isoDateStr) {
        if (!isoDateStr) return '';
        const parts = isoDateStr.split('-');
        if (parts.length !== 3) return isoDateStr;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${parts[2]} ${months[parseInt(parts[1], 10) - 1] || parts[1]} ${parts[0]}`;
    }

    function toISODateInput(str) {
        const d = parseFlexibleDate(str);
        if (!d || /^(present|current|now|ongoing|till date)$/i.test(String(str || '').trim())) return '';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function calculateExactDurationText(startStr, endStr) {
        const start = parseFlexibleDate(startStr);
        const end = parseFlexibleDate(endStr);
        if (!start || !end || end < start) return '';

        let years = end.getFullYear() - start.getFullYear();
        let months = end.getMonth() - start.getMonth();
        let days = end.getDate() - start.getDate();

        if (days < 0) {
            months -= 1;
            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        let parts = [];
        if (years > 0) parts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
        if (months > 0) parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
        if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
        return parts.join(', ');
    }

    function formatExperienceDurationDisplay(exp) {
        if (!exp.startDate && !exp.endDate && exp.duration) return exp.duration;
        const s = (exp.startDate || '').trim();
        const e = (exp.endDate || '').trim();
        let rangeText = s && e ? `${s} - ${e}` : (s || e || '');
        if (exp.showDurationCalc !== false && s && e) {
            const calc = calculateExactDurationText(s, e);
            if (calc) rangeText += ` (${calc})`;
        }
        return rangeText;
    }

    function openDatePicker(inputId) {
        const picker = document.getElementById(inputId);
        if (!picker) return;
        if (typeof picker.showPicker === 'function') picker.showPicker();
        else picker.click();
    }

    function onCalendarPicked(idx, field, isoVal) {
        if (!isoVal) return;
        const formatted = formatDisplayDateFromPicker(isoVal);
        cvData.experiences[idx][field] = formatted;
        const textInput = document.getElementById(`exp-${field}-text-${idx}`);
        if (textInput) textInput.value = formatted;
        updateDurationPreviewBadge(idx);
        triggerUpdate();
    }

    function togglePresentEndDate(idx, isChecked) {
        const val = isChecked ? 'Present' : '';
        cvData.experiences[idx].endDate = val;
        const textInput = document.getElementById(`exp-endDate-text-${idx}`);
        if (textInput) textInput.value = val;
        updateDurationPreviewBadge(idx);
        triggerUpdate();
    }

    function updateDurationPreviewBadge(idx) {
        const badge = document.getElementById(`exp-calc-badge-${idx}`);
        if (!badge) return;
        const exp = cvData.experiences[idx];
        const calc = calculateExactDurationText(exp.startDate, exp.endDate);
        if (calc) {
            badge.innerText = `(${calc})`;
            badge.className = exp.showDurationCalc !== false
                ? 'text-[11px] font-semibold text-emerald-400'
                : 'text-[11px] font-semibold text-slate-500 line-through';
        } else {
            badge.innerText = '(তারিখ দিলে বছর, মাস ও দিন দেখাবে)';
            badge.className = 'text-[10px] text-slate-400';
        }
    }

    function formatExperienceText(idx, type) {
        const textarea = document.getElementById(`exp-desc-${idx}`);
        if (!textarea) return;
        const start = textarea.selectionStart, end = textarea.selectionEnd, val = textarea.value;
        const selectedText = val.substring(start, end);
        let newVal = val, newCursorPos = end;

        if (type === 'bold' || type === 'italic' || type === 'highlight') {
            const tag = type === 'bold' ? 'b' : (type === 'italic' ? 'i' : 'mark');
            if (selectedText.length > 0) {
                const replacement = `<${tag}>${selectedText}</${tag}>`;
                newVal = val.substring(0, start) + replacement + val.substring(end);
                newCursorPos = start + replacement.length;
            } else {
                const placeholder = type === 'bold' ? 'Bold text' : (type === 'italic' ? 'Italic text' : 'Highlight');
                const replacement = `<${tag}>${placeholder}</${tag}>`;
                newVal = val.substring(0, start) + replacement + val.substring(end);
                newCursorPos = start + tag.length + 2;
            }
        } else if (type === 'bullet' || type === 'number') {
            if (selectedText.length > 0) {
                const lines = selectedText.split('\n');
                const formattedLines = lines.map((line, i) => {
                    const cleanLine = line.replace(/^(\s*[-*•]\s+|\s*\d+\.\s+)/, '');
                    return type === 'bullet' ? `• ${cleanLine}` : `${i + 1}. ${cleanLine}`;
                });
                const replacement = formattedLines.join('\n');
                newVal = val.substring(0, start) + replacement + val.substring(end);
                newCursorPos = start + replacement.length;
            } else {
                const lineStart = val.lastIndexOf('\n', start - 1) + 1;
                const lineEndIdx = val.indexOf('\n', start);
                const lineEnd = lineEndIdx === -1 ? val.length : lineEndIdx;
                const currentLine = val.substring(lineStart, lineEnd);
                const cleanLine = currentLine.replace(/^(\s*[-*•]\s+|\s*\d+\.\s+)/, '');
                const prefix = type === 'bullet' ? '• ' : '1. ';
                const replacement = prefix + cleanLine;
                newVal = val.substring(0, lineStart) + replacement + val.substring(lineEnd);
                newCursorPos = lineStart + replacement.length;
            }
        }
        textarea.value = newVal;
        updateExperience(idx, 'desc', newVal);
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
    }

    function handleExperienceKeydown(e, idx) {
        if (e.key === 'Enter' && !e.shiftKey) {
            const textarea = e.target;
            const start = textarea.selectionStart, end = textarea.selectionEnd, val = textarea.value;
            const lineStart = val.lastIndexOf('\n', start - 1) + 1;
            const currentLineBeforeCursor = val.substring(lineStart, start);

            const bulletMatch = currentLineBeforeCursor.match(/^(\s*[•\-\*]\s+)(.*)$/);
            if (bulletMatch) {
                e.preventDefault();
                if (bulletMatch[2].trim() === '') {
                    const newVal = val.substring(0, lineStart) + '\n' + val.substring(end);
                    textarea.value = newVal;
                    updateExperience(idx, 'desc', newVal);
                    textarea.setSelectionRange(lineStart + 1, lineStart + 1);
                } else {
                    const insert = '\n' + bulletMatch[1];
                    const newVal = val.substring(0, start) + insert + val.substring(end);
                    textarea.value = newVal;
                    updateExperience(idx, 'desc', newVal);
                    textarea.setSelectionRange(start + insert.length, start + insert.length);
                }
                return;
            }

            const numMatch = currentLineBeforeCursor.match(/^(\s*)(\d+)\.\s+(.*)$/);
            if (numMatch) {
                e.preventDefault();
                if (numMatch[3].trim() === '') {
                    const newVal = val.substring(0, lineStart) + '\n' + val.substring(end);
                    textarea.value = newVal;
                    updateExperience(idx, 'desc', newVal);
                    textarea.setSelectionRange(lineStart + 1, lineStart + 1);
                } else {
                    const nextNum = parseInt(numMatch[2], 10) + 1;
                    const insert = `\n${numMatch[1]}${nextNum}. `;
                    const newVal = val.substring(0, start) + insert + val.substring(end);
                    textarea.value = newVal;
                    updateExperience(idx, 'desc', newVal);
                    textarea.setSelectionRange(start + insert.length, start + insert.length);
                }
            }
        }
    }

    function formatRichDescriptionHTML(rawText) {
        if (!rawText) return '';
        let escaped = String(rawText).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        escaped = escaped.replace(/&lt;(\/?(b|strong|i|em|mark|u))&gt;/gi, '<$1>');
        const lines = escaped.split(/\r?\n/);
        let htmlParts = [], listType = null;

        lines.forEach(line => {
            const trimmed = line.trim();
            const bulletMatch = trimmed.match(/^(?:•|-|\*)\s+(.*)$/);
            const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

            if (bulletMatch) {
                if (listType !== 'ul') {
                    if (listType) htmlParts.push(`</${listType}>`);
                    htmlParts.push('<ul>');
                    listType = 'ul';
                }
                htmlParts.push(`<li>${bulletMatch[1]}</li>`);
            } else if (numMatch) {
                if (listType !== 'ol') {
                    if (listType) htmlParts.push(`</${listType}>`);
                    htmlParts.push('<ol>');
                    listType = 'ol';
                }
                htmlParts.push(`<li>${numMatch[2]}</li>`);
            } else {
                if (listType) { htmlParts.push(`</${listType}>`); listType = null; }
                if (trimmed === '') htmlParts.push('<div class="h-2"></div>');
                else htmlParts.push(`<div>${line}</div>`);
            }
        });
        if (listType) htmlParts.push(`</${listType}>`);
        return htmlParts.join('');
    }

    function renderDynamicLists() {
        const expContainer = document.getElementById('experienceListContainer');
        if(expContainer) {
            expContainer.innerHTML = cvData.experiences.map((exp, idx) => {
                if (exp.startDate === undefined && exp.endDate === undefined && exp.duration) {
                    const parts = exp.duration.split('-');
                    exp.startDate = (parts[0] || '').trim();
                    exp.endDate = (parts[1] || '').trim();
                }
                if (exp.showDurationCalc === undefined) exp.showDurationCalc = true;
                const isPresent = /^(present|current|now|ongoing)$/i.test((exp.endDate || '').trim());
                const calcText = calculateExactDurationText(exp.startDate, exp.endDate);

                return `
                <div class="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70 space-y-3 relative">
                    <button onclick="removeExperience(${idx})" class="absolute top-3 right-3 text-rose-400 hover:text-rose-300 text-xs" title="Remove"><i class="fa-solid fa-trash"></i></button>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-5">
                        <div>
                            <label class="text-[10px] text-slate-400 block mb-1">Job Title / Designation</label>
                            <input type="text" placeholder="e.g. Senior Software Engineer" value="${escapeAttr(exp.title)}" oninput="updateExperience(${idx}, 'title', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                        </div>
                        <div>
                            <label class="text-[10px] text-slate-400 block mb-1">Company Name</label>
                            <input type="text" placeholder="e.g. TechNova Solutions" value="${escapeAttr(exp.company)}" oninput="updateExperience(${idx}, 'company', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] text-slate-400 block mb-1">Company Location</label>
                        <div class="relative">
                            <i class="fa-solid fa-location-dot absolute left-2.5 top-2.5 text-slate-400 text-xs"></i>
                            <input type="text" placeholder="e.g. Dhaka, Bangladesh" value="${escapeAttr(exp.location || '')}" oninput="updateExperience(${idx}, 'location', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 pl-7 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label class="text-[10px] text-slate-400 block mb-1">Start Date</label>
                            <div class="relative flex items-center">
                                <input type="text" id="exp-startDate-text-${idx}" placeholder="e.g. 15 Jan 2022" value="${escapeAttr(exp.startDate || '')}" oninput="updateExperience(${idx}, 'startDate', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 pr-8 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                                <input type="date" id="exp-startDate-picker-${idx}" value="${toISODateInput(exp.startDate)}" onchange="onCalendarPicked(${idx}, 'startDate', this.value)" class="sr-only">
                                <button type="button" onclick="openDatePicker('exp-startDate-picker-${idx}')" class="absolute right-2 text-indigo-400 hover:text-indigo-300 p-1"><i class="fa-solid fa-calendar-days text-xs"></i></button>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <label class="text-[10px] text-slate-400">End Date</label>
                                <label class="text-[10px] text-indigo-400 flex items-center gap-1 cursor-pointer">
                                    <input type="checkbox" ${isPresent ? 'checked' : ''} onchange="togglePresentEndDate(${idx}, this.checked)" class="rounded text-indigo-600"> Present
                                </label>
                            </div>
                            <div class="relative flex items-center">
                                <input type="text" id="exp-endDate-text-${idx}" placeholder="e.g. 31 Dec 2024 বা Present" value="${escapeAttr(exp.endDate || '')}" oninput="updateExperience(${idx}, 'endDate', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 pr-8 text-xs text-slate-200 focus:outline-none focus:border-indigo-500">
                                <input type="date" id="exp-endDate-picker-${idx}" value="${toISODateInput(exp.endDate)}" onchange="onCalendarPicked(${idx}, 'endDate', this.value)" class="sr-only">
                                <button type="button" onclick="openDatePicker('exp-endDate-picker-${idx}')" class="absolute right-2 text-indigo-400 hover:text-indigo-300 p-1"><i class="fa-solid fa-calendar-days text-xs"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-700/60">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] text-slate-400"><i class="fa-regular fa-clock mr-1 text-indigo-400"></i> মোট সময়কাল:</span>
                            <span id="exp-calc-badge-${idx}" class="${calcText ? (exp.showDurationCalc ? 'text-[11px] font-semibold text-emerald-400' : 'text-[11px] font-semibold text-slate-500 line-through') : 'text-[10px] text-slate-400'}">
                                ${calcText ? `(${calcText})` : '(তারিখ দিলে বছর, মাস ও দিন দেখাবে)'}
                            </span>
                        </div>
                        <label class="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none">
                            <input type="checkbox" ${exp.showDurationCalc ? 'checked' : ''} onchange="updateExperience(${idx}, 'showDurationCalc', this.checked)" class="rounded text-indigo-600">
                            <span>CV-তে দেখান (Visible)</span>
                        </label>
                    </div>
                    <div class="border border-slate-700 rounded-lg overflow-hidden bg-slate-800">
                        <div class="flex flex-wrap items-center gap-1 bg-slate-900/80 px-2 py-1.5 border-b border-slate-700">
                            <button type="button" onclick="formatExperienceText(${idx}, 'bold')" class="px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 rounded transition font-bold"><i class="fa-solid fa-bold"></i></button>
                            <button type="button" onclick="formatExperienceText(${idx}, 'italic')" class="px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 rounded transition italic"><i class="fa-solid fa-italic"></i></button>
                            <button type="button" onclick="formatExperienceText(${idx}, 'highlight')" class="px-2 py-1 text-xs text-amber-300 hover:bg-slate-700 rounded transition flex items-center gap-1"><i class="fa-solid fa-highlighter"></i> <span class="text-[10px]">Highlight</span></button>
                            <div class="h-3.5 w-[1px] bg-slate-700 mx-1"></div>
                            <button type="button" onclick="formatExperienceText(${idx}, 'bullet')" class="px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 rounded transition flex items-center gap-1"><i class="fa-solid fa-list-ul"></i> <span class="text-[10px]">Bullet</span></button>
                            <button type="button" onclick="formatExperienceText(${idx}, 'number')" class="px-2 py-1 text-xs text-slate-200 hover:bg-slate-700 rounded transition flex items-center gap-1"><i class="fa-solid fa-list-ol"></i> <span class="text-[10px]">Number</span></button>
                        </div>
                        <textarea id="exp-desc-${idx}" placeholder="কাজের বিবরণ লিখুন..." rows="4" oninput="updateExperience(${idx}, 'desc', this.value)" onkeydown="handleExperienceKeydown(event, ${idx})" class="w-full bg-slate-800 p-2.5 text-xs text-slate-200 focus:outline-none leading-relaxed">${exp.desc || ''}</textarea>
                    </div>
                </div>
            `}).join('');
        }

        const projContainer = document.getElementById('projectListContainer');
        if(projContainer) {
            projContainer.innerHTML = cvData.projects.map((proj, idx) => `
                <div class="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70 space-y-3 relative">
                    <button onclick="removeProject(${idx})" class="absolute top-3 right-3 text-rose-400 hover:text-rose-300 text-xs"><i class="fa-solid fa-trash"></i></button>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Project Name" value="${escapeAttr(proj.name)}" oninput="updateProject(${idx}, 'name', this.value)" class="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">
                        <input type="text" placeholder="Link" value="${escapeAttr(proj.link)}" oninput="updateProject(${idx}, 'link', this.value)" class="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">
                    </div>
                    <textarea placeholder="Details" rows="2" oninput="updateProject(${idx}, 'desc', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">${proj.desc}</textarea>
                </div>
            `).join('');
        }

        const eduContainer = document.getElementById('educationListContainer');
        if(eduContainer) {
            eduContainer.innerHTML = cvData.educations.map((edu, idx) => `
                <div class="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70 space-y-3 relative">
                    <button onclick="removeEducation(${idx})" class="absolute top-3 right-3 text-rose-400 hover:text-rose-300 text-xs"><i class="fa-solid fa-trash"></i></button>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Degree" value="${escapeAttr(edu.degree)}" oninput="updateEducation(${idx}, 'degree', this.value)" class="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">
                        <input type="text" placeholder="Institution" value="${escapeAttr(edu.institution)}" oninput="updateEducation(${idx}, 'institution', this.value)" class="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Duration" value="${escapeAttr(edu.duration)}" oninput="updateEducation(${idx}, 'duration', this.value)" class="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">
                        <input type="text" placeholder="Grade" value="${escapeAttr(edu.grade)}" oninput="updateEducation(${idx}, 'grade', this.value)" class="bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">
                    </div>
                </div>
            `).join('');
        }

        const customContainer = document.getElementById('customSectionsContainer');
        if(customContainer) {
            customContainer.innerHTML = cvData.customSections.map((sec, idx) => `
                <div class="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70 space-y-3 relative">
                    <button onclick="removeCustomSection(${idx})" class="absolute top-3 right-3 text-rose-400 hover:text-rose-300 text-xs"><i class="fa-solid fa-trash"></i></button>
                    <input type="text" placeholder="Section Title" value="${escapeAttr(sec.title)}" oninput="updateCustomSection(${idx}, 'title', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 font-bold">
                    <textarea placeholder="Content" rows="2" oninput="updateCustomSection(${idx}, 'content', this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200">${sec.content}</textarea>
                </div>
            `).join('');
        }
    }

    function addExperienceItem() { cvData.experiences.push({ title: '', company: '', location: '', startDate: '', endDate: '', showDurationCalc: true, desc: '' }); renderDynamicLists(); triggerUpdate(); }
    function removeExperience(i) { cvData.experiences.splice(i, 1); renderDynamicLists(); triggerUpdate(); }
    function updateExperience(i, field, val) {
        cvData.experiences[i][field] = val;
        if (field === 'startDate' || field === 'endDate' || field === 'showDurationCalc') updateDurationPreviewBadge(i);
        triggerUpdate();
    }

    function addProjectItem() { cvData.projects.push({ name: '', link: '', desc: '' }); renderDynamicLists(); triggerUpdate(); }
    function removeProject(i) { cvData.projects.splice(i, 1); renderDynamicLists(); triggerUpdate(); }
    function updateProject(i, field, val) { cvData.projects[i][field] = val; triggerUpdate(); }

    function addEducationItem() { cvData.educations.push({ degree: '', institution: '', duration: '', grade: '' }); renderDynamicLists(); triggerUpdate(); }
    function removeEducation(i) { cvData.educations.splice(i, 1); renderDynamicLists(); triggerUpdate(); }
    function updateEducation(i, field, val) { cvData.educations[i][field] = val; triggerUpdate(); }

    function addCustomSection() { cvData.customSections.push({ title: 'New Section', content: '' }); renderDynamicLists(); triggerUpdate(); }
    function removeCustomSection(i) { cvData.customSections.splice(i, 1); renderDynamicLists(); triggerUpdate(); }
    function updateCustomSection(i, field, val) { cvData.customSections[i][field] = val; triggerUpdate(); }

    function removePhoto() { cvData.profileImage = ''; syncInputsToDOM(); triggerUpdate(); }

    function calculateAtsScore() {
        let score = 50;
        if (cvData.fullName) score += 10;
        if (cvData.email && cvData.phone) score += 10;
        if (cvData.summary.length > 30) score += 10;
        if (cvData.experiences.length > 0) score += 10;
        if (cvData.educations.length > 0) score += 5;
        if (cvData.skills.length > 5) score += 5;
        if (score > 100) score = 100;

        const circle = document.getElementById('atsScoreCircle');
        const badge = document.getElementById('atsBadge');
        const tip = document.getElementById('atsTip');

        if(circle) circle.innerText = score + '%';
        if(badge) {
            if (score >= 80) { badge.className = "bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded"; badge.innerText = "Strong"; }
            else if (score >= 60) { badge.className = "bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.5 rounded"; badge.innerText = "Good"; }
            else { badge.className = "bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded"; badge.innerText = "Needs Work"; }
        }
        if(tip) tip.innerText = score >= 80 ? "Great job! Your resume has key ATS sections." : "Add more experience and skills to boost ATS score.";
    }
