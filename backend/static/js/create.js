/**
 * Create Video Microlearning Page Handler
 */

const youtubeForm = document.getElementById('youtubeForm');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultModal = document.getElementById('resultModal');
const closeModalBtn = document.getElementById('closeModal');
const closeModalBtn2 = document.getElementById('closeModalBtn');
const viewDashboardBtn = document.getElementById('viewDashboardBtn');

let currentUser = null;

// Check authentication
if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
        } else {
            window.location.href = '/login';
        }
    });
}

// YouTube Form submission
youtubeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await createFromYouTube();
});

async function createFromYouTube() {
    if (!currentUser) {
        window.location.href = '/login';
        return;
    }
    
    const youtubeUrl = document.getElementById('youtubeUrl').value;
    const targetSkill = document.getElementById('targetSkill').value || 'General';
    const numClips = parseInt(document.getElementById('numClips').value) || 3;
    const errorEl = document.getElementById('youtubeError');
    
    // Validate YouTube URL
    if (!youtubeUrl.includes('youtube.com') && !youtubeUrl.includes('youtu.be')) {
        errorEl.textContent = 'Please enter a valid YouTube URL';
        errorEl.style.display = 'block';
        return;
    }
    
    errorEl.style.display = 'none';
    loadingOverlay.style.display = 'flex';
    
    try {
        const response = await fetch('/api/user/from-youtube', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: currentUser.uid,
                youtube_url: youtubeUrl,
                target_skill: targetSkill,
                num_clips: numClips
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to create video microlearning');
        }
        
        // Save to Firestore
        await saveMicrolearningToFirestore(data.microlearning);
        
        // Show result
        showResultModal(data.microlearning);
        
    } catch (error) {
        console.error('Error creating video microlearning:', error);
        errorEl.textContent = error.message;
        errorEl.style.display = 'block';
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

async function saveMicrolearningToFirestore(microlearning) {
    try {
        if (!window.db) return;
        const mlRef = window.db.collection('microlearnings').doc();
        await mlRef.set({
            ...microlearning,
            created_at: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        microlearning.id = mlRef.id;
    } catch (error) {
        console.error('Error saving to Firestore:', error);
        // Don't throw - microlearning was created, just not saved
    }
}

function showResultModal(microlearning) {
    const modalBody = document.getElementById('modalBody');
    
    let clipsHtml = '';
    if (microlearning.clips && microlearning.clips.length > 0) {
        clipsHtml = '<div class="clips-container"><h3>Video Clips</h3>';
        microlearning.clips.forEach((clip, idx) => {
            clipsHtml += `
                <div class="clip-item">
                    <h4>Clip ${clip.clip_number}</h4>
                    <video controls width="100%" style="max-width: 500px; border-radius: 8px;">
                        <source src="/static/videos/${clip.video_file}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <p><small>${clip.start_time.toFixed(1)}s - ${clip.end_time.toFixed(1)}s</small></p>
                    ${clip.description ? `<p>${escapeHtml(clip.description)}</p>` : ''}
                </div>
            `;
        });
        clipsHtml += '</div>';
    }
    
    let quizHtml = '';
    if (microlearning.quiz_questions && microlearning.quiz_questions.length > 0) {
        quizHtml = '<div class="quiz-container"><h3>Quiz Questions</h3><ol>';
        microlearning.quiz_questions.forEach((q, idx) => {
            quizHtml += `
                <li>
                    <strong>${escapeHtml(q.question)}</strong>
                    ${q.options ? `
                        <ul>
                            ${Object.entries(q.options).map(([key, value]) => 
                                `<li>${key}: ${escapeHtml(value)}</li>`
                            ).join('')}
                        </ul>
                    ` : ''}
                    ${q.correct_answer ? `<p><em>Correct Answer: ${q.correct_answer}</em></p>` : ''}
                </li>
            `;
        });
        quizHtml += '</ol></div>';
    }
    
    modalBody.innerHTML = `
        <div class="microlearning-preview">
            <h3>${escapeHtml(microlearning.title)}</h3>
            <div class="microlearning-meta">
                <span>📚 ${microlearning.target_skill}</span>
                <span>⏱️ ${microlearning.estimated_watch_time || (microlearning.clips?.length * 30 || 0)} seconds</span>
                <span>📊 ${microlearning.difficulty_level}</span>
                <span>🎬 ${microlearning.clips?.length || 0} clips</span>
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
            ${clipsHtml}
            ${quizHtml}
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
