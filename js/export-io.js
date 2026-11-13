// ==========================================
// 7. Sample Data, Reset, JSON Backup & Export (DOC, HTML, TXT, PNG)
// ==========================================

function loadSampleData() {
        cvData = {
            ...getBlankCVData(),
            templateCat: 'ats',
            subTemplate: 'ats-classic',
            pageSize: 'a4',
            marginPreset: 'normal',
            customMargin: 'p-10',
            primaryColor: '#2563eb',
            fontFamily: 'Inter',
            fontSizeScale: '1',
            lineSpacing: '1.5',
            sectionOrder: [...DEFAULT_SECTION_ORDER],
            photoShape: 'circle',
            profileImage: '',
            fullName: 'Farhan Rahman',
            jobTitle: 'Senior Full Stack Developer',
            email: 'farhan.dev@example.com',
            phone: '+880 1811 223344',
            location: 'Sylhet, Bangladesh',
            linkedin: 'linkedin.com/in/farhan-dev',
            summary: 'Results-driven Full Stack Engineer with 7+ years building enterprise web solutions using React, Node.js, and AWS cloud architecture.',
            experiences: [
                {
                    title: 'Senior Developer',
                    company: 'Global Tech Ltd',
                    location: 'Dhaka, Bangladesh',
                    startDate: '10 Feb 2021',
                    endDate: 'Present',
                    showDurationCalc: true,
                    desc: '• Managed microservices migration and led a team of <b>5 engineers</b>.\n• Reduced API latency by <mark>35%</mark> using Redis caching.'
                },
                {
                    title: 'Software Engineer',
                    company: 'DevCraft Studio',
                    location: 'Sylhet, Bangladesh',
                    startDate: '01 Jun 2018',
                    endDate: '31 Jan 2021',
                    showDurationCalc: true,
                    desc: '1. Built high-performance frontend components.\n2. Integrated REST APIs and automated CI/CD pipelines.'
                }
            ],
            projects: [
                { name: 'Enterprise SaaS Platform', link: 'github.com/farhan/erp', desc: 'Cloud inventory and billing management system with analytics.' }
            ],
            educations: [
                { degree: 'B.Sc. in Software Engineering', institution: 'Shahjalal University of Science & Technology', duration: '2014 - 2018', grade: 'CGPA: 3.90' }
            ],
            skills: 'JavaScript, TypeScript, React, Next.js, Node.js, GraphQL, Docker, Kubernetes, AWS',
            customSections: [
                { title: 'Certifications', content: "AWS Certified Solutions Architect\nCertified Kubernetes Administrator (CKA)" }
            ],
            declaration: 'I hereby declare that all particulars given above are true to the best of my knowledge.',
            clCompanyName: 'TechNova Global',
            clManagerName: 'Mr. Tariqul Islam'
        };
        renderCategories();
        syncInputsToDOM();
        updatePageSizeSelection();
        updateMarginUI();
        triggerUpdate();
        generateAutoCoverLetter();
    }

    function resetData() {
        if (confirm('Are you sure you want to reset all data to blank?')) {
            cvData = getBlankCVData();
            renderCategories();
            syncInputsToDOM();
            updatePageSizeSelection();
            updateMarginUI();
            triggerUpdate();
            generateAutoCoverLetter();
        }
    }

    function exportJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cvData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", "cv_backup.json");
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
    }

    function importJSON(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    cvData = { ...getBlankCVData(), ...JSON.parse(e.target.result) };
                    renderCategories();
                    syncInputsToDOM();
                    updatePageSizeSelection();
                    updateMarginUI();
                    triggerUpdate();
                    generateAutoCoverLetter();
                    alert('CV data imported successfully!');
                } catch (err) {
                    alert('Invalid JSON file format.');
                }
            };
            reader.readAsText(file);
        }
    }

    function toggleExportMenu(event) {
        if (event) event.stopPropagation();
        const menu = document.getElementById('exportDropdownMenu');
        if (menu) menu.classList.toggle('hidden');
    }

    document.addEventListener('click', function(event) {
        const wrapper = document.getElementById('exportDropdownWrapper');
        const menu = document.getElementById('exportDropdownMenu');
        if (wrapper && menu && !wrapper.contains(event.target)) {
            menu.classList.add('hidden');
        }
    });

    function getSafeFileName(ext) {
        const base = (cvData.fullName || 'Resume').trim().replace(/[^a-zA-Z0-9_\-ঀ-৿]+/g, '_');
        return `${base}_Resume.${ext}`;
    }

    function triggerFileDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function buildWordCompatibleHTML() {
        const color = cvData.primaryColor || '#4f46e5';
        const font = cvData.fontFamily || 'Inter, Arial, sans-serif';
        const skillsList = cvData.skills ? cvData.skills.split(',').map(s => s.trim()).filter(Boolean).join(' • ') : '';

        const photoBlock = cvData.profileImage
            ? `<td style="width:90px; vertical-align:middle; padding-right:14px;"><img src="${cvData.profileImage}" width="80" height="80" style="width:80px; height:80px; object-fit:cover; border:2px solid ${color};" /></td>`
            : '';

        const expBlock = (cvData.experiences || []).map(e => {
            const durationDisplay = formatExperienceDurationDisplay(e);
            const companyLine = [e.company, e.location].filter(Boolean).join(' • ');
            return `
            <div style="margin-bottom:10px;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td style="font-weight:bold; font-size:11pt; color:#0f172a;">${e.title || ''}</td>
                        <td style="text-align:right; font-size:9.5pt; color:#475569;">${durationDisplay}</td>
                    </tr>
                </table>
                <div style="font-size:10pt; font-weight:bold; color:#334155; margin-bottom:2px;">${companyLine}</div>
                <div style="font-size:10pt; color:#475569; line-height:1.45;">${formatRichDescriptionHTML(e.desc || '')}</div>
            </div>
        `}).join('');

        const projBlock = (cvData.projects || []).map(p => `
            <div style="margin-bottom:10px;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td style="font-weight:bold; font-size:11pt; color:#0f172a;">${p.name || ''}</td>
                        <td style="text-align:right; font-size:9.5pt; color:${color};">${p.link || ''}</td>
                    </tr>
                </table>
                <div style="font-size:10pt; color:#475569; line-height:1.45;">${(p.desc || '').replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');

        const eduBlock = (cvData.educations || []).map(ed => `
            <div style="margin-bottom:8px;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td style="font-weight:bold; font-size:10.5pt; color:#0f172a;">${ed.degree || ''}</td>
                        <td style="text-align:right; font-size:9.5pt; color:#475569;">${ed.duration || ''}</td>
                    </tr>
                </table>
                <div style="font-size:10pt; color:#334155;">${ed.institution || ''} ${ed.grade ? '• ' + ed.grade : ''}</div>
            </div>
        `).join('');

        const customBlock = (cvData.customSections || []).map(cs => `
            <div style="margin-top:14px;">
                <div style="font-size:10.5pt; font-weight:bold; text-transform:uppercase; color:${color}; border-bottom:1.5px solid ${color}; padding-bottom:3px; margin-bottom:6px;">${cs.title || ''}</div>
                <div style="font-size:10pt; color:#334155; line-height:1.45;">${(cs.content || '').replace(/\n/g, '<br>')}</div>
            </div>
        `).join('');

        const declBlock = cvData.declaration
            ? `<div style="margin-top:18px; padding-top:8px; border-top:1px solid #cbd5e1; font-size:9.5pt; color:#475569; font-style:italic;"><strong>Declaration:</strong> ${cvData.declaration}</div>`
            : '';

        return `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset="utf-8">
                <title>${cvData.fullName || 'Resume'}</title>
                <style>
                    body { font-family: ${font}, 'Noto Sans Bengali', Calibri, Arial, sans-serif; color: #0f172a; margin: 0.6in; }
                    .sec-title { font-size: 10.5pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: ${color}; border-bottom: 1.5px solid ${color}; padding-bottom: 3px; margin-top: 14px; margin-bottom: 7px; }
                    ul, ol { margin: 4px 0 4px 18px; padding: 0; }
                    li { margin-bottom: 2px; }
                    mark { background-color: #fef08a; }
                </style>
            </head>
            <body>
                <table style="width:100%; border-collapse:collapse; border-bottom:2px solid ${color}; padding-bottom:10px; margin-bottom:12px;">
                    <tr>
                        ${photoBlock}
                        <td style="vertical-align:middle;">
                            <div style="font-size:20pt; font-weight:bold; color:#0f172a;">${cvData.fullName || ''}</div>
                            <div style="font-size:11.5pt; font-weight:bold; color:${color}; margin-top:2px;">${cvData.jobTitle || ''}</div>
                            <div style="font-size:9.5pt; color:#475569; margin-top:4px;">${[cvData.email, cvData.phone, cvData.location, cvData.linkedin].filter(Boolean).join('  |  ')}</div>
                        </td>
                    </tr>
                </table>

                ${cvData.summary ? `<div class="sec-title">Professional Summary</div><div style="font-size:10pt; color:#334155; line-height:1.5;">${cvData.summary.replace(/\n/g, '<br>')}</div>` : ''}
                ${expBlock ? `<div class="sec-title">Work Experience</div>${expBlock}` : ''}
                ${projBlock ? `<div class="sec-title">Projects</div>${projBlock}` : ''}
                ${eduBlock ? `<div class="sec-title">Education</div>${eduBlock}` : ''}
                ${skillsList ? `<div class="sec-title">Skills</div><div style="font-size:10pt; color:#1e293b; line-height:1.5;">${skillsList}</div>` : ''}
                ${customBlock}
                ${declBlock}
            </body>
            </html>
        `;
    }

    function exportAsDOC() {
        toggleExportMenu();
        const wordHTML = '\ufeff' + buildWordCompatibleHTML();
        const blob = new Blob([wordHTML], { type: 'application/msword;charset=utf-8' });
        triggerFileDownload(blob, getSafeFileName('doc'));
    }

    function exportAsHTML() {
        toggleExportMenu();
        const printable = document.getElementById('printable-cv');
        if (!printable) return;
        const standaloneHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${cvData.fullName || 'Resume'} - CV</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Roboto:wght@300;400;500;700&family=Noto+Sans+Bengali:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  body { font-family: 'Inter', 'Noto Sans Bengali', sans-serif; background: #f1f5f9; display: flex; justify-content: center; padding: 24px; }
  .font-merriweather { font-family: 'Merriweather', serif; }
  .font-roboto { font-family: 'Roboto', sans-serif; }
  .sheet { background: #fff; width: 210mm; min-height: 297mm; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
  .exp-formatted-desc ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.2rem 0; }
  .exp-formatted-desc ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.2rem 0; }
  .exp-formatted-desc li { margin-bottom: 0.15rem; }
  .exp-formatted-desc mark { background-color: #fef08a; color: #0f172a; padding: 0 3px; border-radius: 2px; }
  @media print { body { background: #fff; padding: 0; } .sheet { box-shadow: none; width: 100%; } }
</style>
</head>
<body>
  <div class="sheet">${printable.outerHTML.replace(/contenteditable="true"/g, '')}</div>
</body>
</html>`;
        const blob = new Blob([standaloneHTML], { type: 'text/html;charset=utf-8' });
        triggerFileDownload(blob, getSafeFileName('html'));
    }

    function exportAsTXT() {
        toggleExportMenu();
        let lines = [];
        lines.push((cvData.fullName || '').toUpperCase());
        if (cvData.jobTitle) lines.push(cvData.jobTitle);
        lines.push([cvData.email, cvData.phone, cvData.location, cvData.linkedin].filter(Boolean).join(' | '));
        lines.push('============================================================');
        if (cvData.summary) { lines.push('\nPROFESSIONAL SUMMARY'); lines.push(cvData.summary); }
        if (cvData.experiences && cvData.experiences.length) {
            lines.push('\nWORK EXPERIENCE');
            cvData.experiences.forEach(e => {
                const durationDisplay = formatExperienceDurationDisplay(e);
                const compInfo = [e.company, e.location].filter(Boolean).join(', ');
                lines.push(`* ${e.title} - ${compInfo} (${durationDisplay})`);
                if (e.desc) {
                    const plainDesc = e.desc.replace(/<\/?(b|strong|i|em|mark|u)>/gi, '');
                    lines.push(plainDesc.split('\n').map(l => '  ' + l).join('\n'));
                }
            });
        }
        if (cvData.projects && cvData.projects.length) {
            lines.push('\nPROJECTS');
            cvData.projects.forEach(p => {
                lines.push(`* ${p.name}${p.link ? ' (' + p.link + ')' : ''}`);
                if (p.desc) lines.push(`  ${p.desc}`);
            });
        }
        if (cvData.educations && cvData.educations.length) {
            lines.push('\nEDUCATION');
            cvData.educations.forEach(ed => {
                lines.push(`* ${ed.degree} - ${ed.institution} (${ed.duration}) ${ed.grade ? '[' + ed.grade + ']' : ''}`);
            });
        }
        if (cvData.skills) { lines.push('\nSKILLS'); lines.push(cvData.skills); }
        if (cvData.customSections && cvData.customSections.length) {
            cvData.customSections.forEach(cs => { lines.push(`\n${(cs.title || '').toUpperCase()}`); lines.push(cs.content || ''); });
        }
        if (cvData.declaration) { lines.push('\nDECLARATION'); lines.push(cvData.declaration); }
        const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        triggerFileDownload(blob, getSafeFileName('txt'));
    }

    async function exportAsPNG() {
        toggleExportMenu();
        const wrapper = document.getElementById('previewSheetWrapper');
        if (!wrapper || typeof html2canvas === 'undefined') {
            alert('Image export library is still loading. Please try again in a second.');
            return;
        }
        const prevTransform = wrapper.style.transform;
        wrapper.style.transform = 'scale(1)';
        try {
            const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            canvas.toBlob(function(blob) {
                if (blob) triggerFileDownload(blob, getSafeFileName('png'));
            }, 'image/png');
        } catch (err) {
            console.error('PNG export failed:', err);
            alert('Could not generate image. Please try Print / PDF.');
        } finally {
            wrapper.style.transform = prevTransform;
        }
    }
