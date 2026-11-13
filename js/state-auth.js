// ==========================================
// 1. Global State, Blank CV Data, Templates List & Firebase Auth/Sync
// ==========================================

let currentUser = null;
    let authMode = 'login';
    let autoSaveTimer = null;
    let cropSourceImage = null;
    let cropOffsetX = 0;
    let cropOffsetY = 0;
    let isDraggingCrop = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let draggedSectionIdx = null;
    let isPublicShareView = false;

    const DEFAULT_SECTION_ORDER = ['summary', 'experience', 'projects', 'education', 'skills', 'custom'];
    const SECTION_LABELS = {
        summary: 'Professional Summary',
        experience: 'Work Experience',
        projects: 'Key Projects',
        education: 'Education History',
        skills: 'Skills & Expertise',
        custom: 'Custom Sections'
    };

    function getBlankCVData() {
        return {
            templateCat: 'ats',
            subTemplate: 'ats-classic',
            pageSize: 'a4',
            marginPreset: 'normal',
            customMargin: 'p-10',
            primaryColor: '#4f46e5',
            fontFamily: 'Inter',
            fontSizeScale: '1',
            lineSpacing: '1.5',
            sectionOrder: [...DEFAULT_SECTION_ORDER],
            photoShape: 'circle',
            profileImage: '',
            fullName: '',
            jobTitle: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            summary: '',
            experiences: [],
            projects: [],
            educations: [],
            skills: '',
            customSections: [],
            declaration: '',
            clCompanyName: '',
            clManagerName: '',
            clCustomBody: ''
        };
    }

    let cvData = getBlankCVData();

    const categories = [
        { id: 'ats', name: 'ATS Friendly', desc: 'Optimized for automated parsing systems', subTemplates: [
            { id: 'ats-classic', name: 'ATS Classic Single Column' },
            { id: 'ats-modern', name: 'ATS Clean Structured' },
            { id: 'ats-executive', name: 'ATS Executive Minimal' }
        ]},
        { id: 'official', name: 'Official & Govt', desc: 'Formal structure for government & corporate', subTemplates: [
            { id: 'off-table', name: 'Official Table Header' },
            { id: 'off-formal', name: 'Executive Corporate Formal' },
            { id: 'off-govt', name: 'Govt Standard Format' }
        ]},
        { id: 'modern', name: 'Modern Sidebar', desc: 'Stylish 2-column sidebar layouts', subTemplates: [
            { id: 'mod-left', name: 'Modern Left Sidebar' },
            { id: 'mod-right', name: 'Modern Right Sidebar' },
            { id: 'mod-split', name: 'Split Pane Modern' }
        ]},
        { id: 'corporate', name: 'Corporate Pro', desc: 'Clean professional business style', subTemplates: [
            { id: 'corp-standard', name: 'Corporate Pro Standard' },
            { id: 'corp-classic', name: 'Corporate Business Clean' },
            { id: 'corp-bold', name: 'Bold Header Corporate' }
        ]},
        { id: 'creative', name: 'Creative Tech', desc: 'For designers, developers & innovators', subTemplates: [
            { id: 'tech-developer', name: 'Tech Developer Dark Header' },
            { id: 'tech-creative', name: 'Creative Portfolio Style' },
            { id: 'tech-modern', name: 'Modern Tech Grid' }
        ]},
        { id: 'minimalist', name: 'Minimalist', desc: 'Clean, elegant, whitespace focused', subTemplates: [
            { id: 'min-clean', name: 'Minimalist Clean Lines' },
            { id: 'min-simple', name: 'Simple Elegant Serif' },
            { id: 'min-compact', name: 'Compact Ultra Clean' }
        ]}
    ];

    document.addEventListener('DOMContentLoaded', () => {
        try {
            // Check if opened via Public Share URL (?share=...)
            const urlParams = new URLSearchParams(window.location.search);
            const sharedPayload = urlParams.get('share');
            if (sharedPayload) {
                try {
                    const decoded = JSON.parse(decodeURIComponent(escape(atob(sharedPayload))));
                    cvData = { ...getBlankCVData(), ...decoded };
                    isPublicShareView = true;
                    document.getElementById('authGuardModal')?.classList.add('hidden');
                    document.getElementById('mainAppHeader')?.classList.add('hidden');
                    document.getElementById('leftEditorPanel')?.classList.add('hidden');
                    document.getElementById('publicShareBanner')?.classList.remove('hidden');
                    const rightPanel = document.getElementById('rightPreviewPanel');
                    if (rightPanel) {
                        rightPanel.classList.remove('lg:w-1/2');
                        rightPanel.classList.add('w-full');
                    }
                    applyPageSizeClass();
                    renderPreview();
                    return;
                } catch (err) {
                    console.error('Invalid share payload:', err);
                }
            }

            renderCategories();
            syncInputsToDOM();
            updatePageSizeSelection();
            updateMarginUI();
            triggerUpdate();
            generateAutoCoverLetter();
            initCropCanvasListeners();

            // Initialize Firebase Auth Listener & Auth Guard
            setTimeout(() => {
                if (window.firebaseAuth) {
                    window.firebaseMethods.onAuthStateChanged(window.firebaseAuth, async (user) => {
                        if (isPublicShareView) return;
                        currentUser = user;
                        const guardModal = document.getElementById('authGuardModal');
                        const loggedInView = document.getElementById('userLoggedInView');
                        const emailDisplay = document.getElementById('userEmailDisplay');
                        const statusBar = document.getElementById('cloudStatusBar');

                        if (user) {
                            if(guardModal) guardModal.classList.add('hidden');
                            if(loggedInView) loggedInView.classList.remove('hidden');
                            if(statusBar) statusBar.classList.remove('hidden');
                            if(emailDisplay) emailDisplay.innerText = user.email;
                            await loadFromCloud();
                        } else {
                            if(guardModal) guardModal.classList.remove('hidden');
                            if(loggedInView) loggedInView.classList.add('hidden');
                            if(statusBar) statusBar.classList.add('hidden');
                            cvData = getBlankCVData();
                            syncInputsToDOM();
                            triggerUpdate();
                        }
                    });
                }
            }, 500);
        } catch (e) {
            console.error("Initialization error:", e);
        }
    });

    function exitPublicShareMode() {
        window.location.href = window.location.pathname;
    }

    function toggleAuthMode() {
        authMode = authMode === 'login' ? 'signup' : 'login';
        const titleEl = document.getElementById('authGuardTitle');
        const subEl = document.getElementById('authGuardSub');
        const btnEl = document.getElementById('modalAuthSubmitBtn');
        const forgotBtn = document.getElementById('modalForgotBtn');
        const switchText = document.getElementById('authSwitchText');

        if (authMode === 'signup') {
            if(titleEl) titleEl.innerText = "Create Your ProCV Account";
            if(subEl) subEl.innerText = "Sign up to start saving and syncing your professional CV securely.";
            if(btnEl) btnEl.innerText = "Create Account";
            if(forgotBtn) forgotBtn.classList.add('hidden');
            if(switchText) switchText.innerHTML = `Already have an account? <button type="button" onclick="toggleAuthMode()" class="text-indigo-400 font-semibold hover:underline">Login</button>`;
        } else {
            if(titleEl) titleEl.innerText = "Welcome to ProCV Studio";
            if(subEl) subEl.innerText = "Please login or create an account to access your professional CV builder and secure cloud sync.";
            if(btnEl) btnEl.innerText = "Login to Continue";
            if(forgotBtn) forgotBtn.classList.remove('hidden');
            if(switchText) switchText.innerHTML = `Don't have an account? <button type="button" onclick="toggleAuthMode()" class="text-indigo-400 font-semibold hover:underline">Create Account</button>`;
        }
    }

    async function handleModalAuthSubmit() {
        const email = document.getElementById('modalAuthEmail')?.value;
        const password = document.getElementById('modalAuthPassword')?.value;
        const errEl = document.getElementById('modalAuthError');
        if(errEl) errEl.classList.add('hidden');

        try {
            if (!window.firebaseAuth) {
                alert('Firebase is not initialized properly.');
                return;
            }
            if (authMode === 'login') {
                await window.firebaseMethods.signInWithEmailAndPassword(window.firebaseAuth, email, password);
            } else {
                await window.firebaseMethods.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
                cvData = getBlankCVData();
                await saveToCloud();
            }
        } catch (err) {
            if(errEl) {
                errEl.innerText = err.message;
                errEl.classList.remove('hidden');
            } else {
                alert(err.message);
            }
        }
    }

    async function sendModalPasswordReset() {
        const email = document.getElementById('modalAuthEmail')?.value;
        const errEl = document.getElementById('modalAuthError');
        if(errEl) errEl.classList.add('hidden');

        if (!email) {
            if(errEl) {
                errEl.innerText = "Please enter your email address first.";
                errEl.classList.remove('hidden');
            } else {
                alert("Please enter your email address first.");
            }
            return;
        }

        try {
            await window.firebaseMethods.sendPasswordResetEmail(window.firebaseAuth, email);
            alert("Password reset email sent! Please check your inbox.");
        } catch (err) {
            if(errEl) {
                errEl.innerText = err.message;
                errEl.classList.remove('hidden');
            } else {
                alert(err.message);
            }
        }
    }

    async function logoutUser() {
        if (window.firebaseAuth) {
            await window.firebaseMethods.signOut(window.firebaseAuth);
            alert('Logged out successfully!');
            cvData = getBlankCVData();
            location.reload();
        }
    }

    async function saveToCloud() {
        if (!currentUser) return;
        const statusText = document.getElementById('cloudStatusText');
        if(statusText) statusText.innerText = "Saving to cloud...";

        try {
            const docRef = window.firebaseMethods.doc(window.firebaseDb, 'cvs', currentUser.uid);
            await window.firebaseMethods.setDoc(docRef, cvData);
            if(statusText) statusText.innerText = "All changes saved ✓";
        } catch (err) {
            console.error(err);
            if(statusText) statusText.innerText = "Cloud sync failed ✕";
        }
    }

    function triggerAutoCloudSync() {
        if (!currentUser) return;
        const statusText = document.getElementById('cloudStatusText');
        if(statusText) statusText.innerText = "Saving changes...";

        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(async () => {
            await saveToCloud();
        }, 1200);
    }

    async function loadFromCloud() {
        if (!currentUser) return;
        try {
            const docRef = window.firebaseMethods.doc(window.firebaseDb, 'cvs', currentUser.uid);
            const docSnap = await window.firebaseMethods.getDoc(docRef);
            if (docSnap.exists()) {
                cvData = { ...getBlankCVData(), ...docSnap.data() };
            } else {
                cvData = getBlankCVData();
            }
            renderCategories();
            syncInputsToDOM();
            updatePageSizeSelection();
            updateMarginUI();
            triggerUpdate();
            generateAutoCoverLetter();
        } catch (err) {
            console.error("Cloud load error:", err);
        }
    }
