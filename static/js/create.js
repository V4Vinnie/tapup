/**
 * Create Microlearning Page Handler
 */

const urlForm = document.getElementById('urlForm');
const textForm = document.getElementById('textForm');
const urlTab = document.getElementById('urlTab');
const textTab = document.getElementById('textTab');
const tabButtons = document.querySelectorAll('.tab-btn');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultModal = document.getElementById('resultModal');
const closeModalBtn = document.getElementById('closeModal');
const closeModalBtn2 = document.getElementById('closeModalBtn');
const viewDashboardBtn = document.getElementById('viewDashboardBtn');

let currentUser = null;

// Check authentication
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
    } else {
        window.location.href = '/login';
    }
});

// Tab switching
tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update active tab button
        tabButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        urlTab.classList.remove('active');
        textTab.classList.remove('active');
        
        if (tabName === 'url') {
            urlTab.classList.add('active');
        } else {
            textTab.classList.add('active');
        }
    });
});

// URL Form submission
urlForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createFromURL();
});

// Text Form submission
textForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createFromText();
});

async function createFromURL() {
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }
    
    const url = document.getElementById('url').value;
    const targetSkill = document.getElementById('urlSkill').value || 'General';
    const errorEl = document.getElementById('urlError');
    
    errorEl.style.display = 'none';
    loadingOverlay.style.display = 'flex';
    
    try {
        const response = await fetch('/api/user/from-url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.uid,
                url: url,
                target_skill: targetSkill
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create microlearning');
        }
        
        // Save to Firestore
        await saveMicrolearningToFirestore(data.microlearning);
        
        // Show result
        showResultModal(data.microlearning);
        
    } catch (error) {
        console.error('Error creating microlearning:', error);
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function createFromText() {
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const targetSkill = document.getElementById('textSkill').value || 'General';
    const description = document.getElementById('description').value || '';
    const sourceUrl = document.getElementById('sourceUrl').value || '';
    const errorEl = document.getElementById('textError');
    
    errorEl.style.display = 'none';
    loadingOverlay.style.display = 'flex';
    
    try {
        const response = await fetch('/api/user/create-microlearning', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.uid,
                title: title,
                content: content,
                target_skill: targetSkill,
                description: description,
                url: sourceUrl
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create microlearning');
        }
        
        // Save to Firestore
        await saveMicrolearningToFirestore(data.microlearning);
        
        // Show result
        showResultModal(data.microlearning);
        
    } catch (error) {
        console.error('Error creating microlearning:', error);
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function saveMicrolearningToFirestore(microlearning) {
    try {
        const mlRef = db.collection('microlearnings').doc();
        await mlRef.set({
            ...microlearning,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });
        microlearning.id = mlRef.id;
    } catch (error) {
        console.error('Error saving to Firestore:', error);
        // Don't throw - microlearning was created, just not saved
    }
}

function showResultModal(microlearning) {
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="microlearning-preview">
            <h3>${escapeHtml(microlearning.title)}</h3>
            <div class="microlearning-meta">
                <span>📚 ${microlearning.target_skill}</span>
                <span>⏱️ ${microlearning.estimated_read_time} min read</span>
                <span>📊 ${microlearning.difficulty_level}</span>
            </div>
            ${microlearning.summary ? `<div class="preview-summary"><strong>Summary:</strong><p>${escapeHtml(microlearning.summary.substring(0, 500))}...</p></div>` : ''}
            ${microlearning.key_concepts && microlearning.key_concepts.length > 0 ? `
                <div class="preview-concepts">
                    <strong>Key Concepts:</strong>
                    <ul>
                        ${microlearning.key_concepts.map(concept => `<li>${escapeHtml(concept)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    resultModal.style.display = 'flex';
}

closeModalBtn.addEventListener('click', () => {
    resultModal.style.display = 'none';
});

closeModalBtn2.addEventListener('click', () => {
    resultModal.style.display = 'none';
});

viewDashboardBtn.addEventListener('click', () => {
    window.location.href = '/dashboard';
});

// Close modal when clicking outside
resultModal.addEventListener('click', (e) => {
    if (e.target === resultModal) {
        resultModal.style.display = 'none';
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

