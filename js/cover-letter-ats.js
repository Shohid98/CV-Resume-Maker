// ==========================================
// 6. Auto Cover Letter Generator, ATS JD Matcher & Share Link
// ==========================================

// --- Auto Cover Letter Generator, Download & Print ---
    function generateAutoCoverLetter(forceReset = false) {
        const companyInput = document.getElementById('clCompanyName');
        const managerInput = document.getElementById('clManagerName');
        const container = document.getElementById('printable-cover-letter');
        if (!container) return;

        const companyName = (companyInput ? companyInput.value : cvData.clCompanyName || '').trim();
        const managerName = (managerInput ? managerInput.value : cvData.clManagerName || '').trim();
        cvData.clCompanyName = companyName;
        cvData.clManagerName = managerName;

        const targetCompany = companyName || '[Target Company Name]';
        const salutation = managerName ? `Dear ${managerName},` : 'Dear Hiring Manager,';
        const candidateName = cvData.fullName || '[Your Full Name]';
        const roleTitle = cvData.jobTitle || 'Professional Role';
        const skillsSnippet = cvData.skills
            ? cvData.skills.split(',').slice(0, 5).map(s => s.trim()).filter(Boolean).join(', ')
            : 'relevant industry skills and problem-solving expertise';
        const latestExp = (cvData.experiences && cvData.experiences.length > 0 && cvData.experiences[0].company)
            ? `In my recent role as ${cvData.experiences[0].title || roleTitle} at ${cvData.experiences[0].company}, I successfully delivered high-impact results and contributed directly to organizational growth.`
            : `With a strong background as a ${roleTitle}, I bring proven dedication, adaptability, and a results-oriented mindset.`;

        const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const color = cvData.primaryColor || '#4f46e5';

        container.innerHTML = `
            <div style="border-bottom: 2px solid ${color}; padding-bottom: 12px; margin-bottom: 18px;">
                <h2 style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0;">${candidateName}</h2>
                <div style="font-size: 12px; font-weight: 600; color: ${color}; margin-top: 2px;">${roleTitle}</div>
                <div style="font-size: 11px; color: #475569; margin-top: 4px;">
                    ${[cvData.email, cvData.phone, cvData.location, cvData.linkedin].filter(Boolean).join('  |  ')}
                </div>
            </div>

            <div style="margin-bottom: 16px; font-size: 11.5px; color: #334155;">
                <div>${todayStr}</div>
                <div style="margin-top: 10px; font-weight: 700; color: #0f172a;">${managerName || 'Hiring Manager'}</div>
                <div style="font-weight: 600; color: #1e293b;">${targetCompany}</div>
            </div>

            <div contenteditable="true" style="outline: none; space-y: 12px; font-size: 12px; color: #1e293b; line-height: 1.65;">
                <p style="margin-bottom: 12px; font-weight: 600;">${salutation}</p>
                <p style="margin-bottom: 12px;">
                    I am writing to express my enthusiastic interest in joining <strong>${targetCompany}</strong> as a <strong>${roleTitle}</strong>. Having followed ${targetCompany}’s continued reputation for excellence and innovation, I am eager to contribute my expertise in <strong>${skillsSnippet}</strong> to your team.
                </p>
                <p style="margin-bottom: 12px;">
                    ${latestExp} ${cvData.summary ? cvData.summary : ''}
                </p>
                <p style="margin-bottom: 12px;">
                    I am confident that my technical proficiency, collaborative approach, and commitment to quality align closely with the goals of <strong>${targetCompany}</strong>. I would welcome the opportunity to discuss how my background and skills can add immediate value to your upcoming initiatives.
                </p>
                <p style="margin-bottom: 16px;">
                    Thank you very much for your time and consideration. I look forward to the possibility of speaking with you soon.
                </p>
                <p style="margin-top: 20px;">
                    Sincerely,<br>
                    <strong style="font-size: 13px; color: #0f172a;">${candidateName}</strong>
                </p>
            </div>
        `;
        if (!forceReset) triggerAutoCloudSync();
    }

    function printResume() {
        document.body.classList.remove('printing-cover-letter');
        window.print();
    }

    function printCoverLetter() {
        document.body.classList.add('printing-cover-letter');
        window.print();
        setTimeout(() => {
            document.body.classList.remove('printing-cover-letter');
        }, 500);
    }

    
    async function downloadCoverLetterPDF() {
        const clEl = document.getElementById('printable-cover-letter');
        if (!clEl || typeof html2canvas === 'undefined') {
            alert('PDF library is loading. Please try again.');
            return;
        }
        try {
            const canvas = await html2canvas(clEl, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            
            // Trigger browser print using PDF layout mode for perfect vector/raster quality
            document.body.classList.add('printing-cover-letter');
            window.print();
            setTimeout(() => {
                document.body.classList.remove('printing-cover-letter');
            }, 500);
        } catch (err) {
            console.error('Cover Letter PDF export error:', err);
            printCoverLetter();
        }
    }

    function downloadCoverLetterDOC() {
        const clEl = document.getElementById('printable-cover-letter');
        if (!clEl) return;
        const companySlug = (cvData.clCompanyName || 'Company').trim().replace(/[^a-zA-Z0-9_\-ঀ-৿]+/g, '_');
        const nameSlug = (cvData.fullName || 'Candidate').trim().replace(/[^a-zA-Z0-9_\-ঀ-৿]+/g, '_');
        const docHtml = `\ufeff<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset="utf-8"><title>Cover Letter - ${companySlug}</title>
        <style>body { font-family: Calibri, Arial, sans-serif; margin: 0.8in; color: #0f172a; line-height: 1.6; }</style>
        </head><body>${clEl.innerHTML.replace(/contenteditable="true"/g, '')}</body></html>`;
        const blob = new Blob([docHtml], { type: 'application/msword;charset=utf-8' });
        triggerFileDownload(blob, `${nameSlug}_Cover_Letter_${companySlug}.doc`);
    }

    // --- ATS Job Description Matching Analyzer ---
    function openAtsMatcherModal() {
        document.getElementById('atsMatcherModal')?.classList.remove('hidden');
    }
    function closeAtsMatcherModal() {
        document.getElementById('atsMatcherModal')?.classList.add('hidden');
    }
    function analyzeJobMatch() {
        const jdText = (document.getElementById('jdInputTextarea')?.value || '').toLowerCase();
        if (!jdText.trim()) {
            alert('Please paste a Job Description first.');
            return;
        }
        const stopWords = new Set(['and','the','for','with','you','are','will','have','from','that','this','your','our','work','team','role','experience','years','skills','ability','strong','good','knowledge','using','etc','including','such','their','they','been','more','than','into','over','must','should','preferred','required']);
        const jdWords = jdText.replace(/[^a-z0-9+#.\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
        const uniqueKeywords = [...new Set(jdWords)].slice(0, 30);

        const cvFullText = [
            cvData.jobTitle, cvData.summary, cvData.skills,
            ...(cvData.experiences || []).map(e => `${e.title} ${e.desc}`),
            ...(cvData.projects || []).map(p => `${p.name} ${p.desc}`),
            ...(cvData.educations || []).map(ed => ed.degree)
        ].join(' ').toLowerCase();

        const matched = [];
        const missing = [];
        uniqueKeywords.forEach(kw => {
            if (cvFullText.includes(kw)) matched.push(kw);
            else missing.push(kw);
        });

        const pct = uniqueKeywords.length ? Math.round((matched.length / uniqueKeywords.length) * 100) : 0;
        document.getElementById('atsMatchResultBox')?.classList.remove('hidden');
        document.getElementById('jdMatchPercent').innerText = `${pct}%`;
        document.getElementById('jdMatchedList').innerHTML = matched.length
            ? matched.map(w => `<span class="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">${w}</span>`).join('')
            : '<span class="text-slate-400">None yet</span>';
        document.getElementById('jdMissingList').innerHTML = missing.length
            ? missing.map(w => `<span class="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded">${w}</span>`).join('')
            : '<span class="text-emerald-400">All key terms matched!</span>';
    }

    // --- Public Sharing Link ---
    function openShareLinkModal() {
        const sharePayload = { ...cvData, profileImage: '' }; // Exclude heavy base64 image from URL length
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(sharePayload))));
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
        const input = document.getElementById('generatedShareUrl');
        if (input) input.value = shareUrl;
        document.getElementById('shareCopyFeedback')?.classList.add('hidden');
        document.getElementById('shareLinkModal')?.classList.remove('hidden');
    }
    function closeShareLinkModal() {
        document.getElementById('shareLinkModal')?.classList.add('hidden');
    }
    function copyShareUrl() {
        const input = document.getElementById('generatedShareUrl');
        if (!input) return;
        input.select();
        navigator.clipboard?.writeText(input.value);
        document.getElementById('shareCopyFeedback')?.classList.remove('hidden');
    }
