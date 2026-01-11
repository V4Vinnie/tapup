/**
 * Dashboard Page Handler
 */

const loadingIndicator = document.getElementById('loadingIndicator');
const microlearningsGrid = document.getElementById('microlearningsGrid');
const emptyState = document.getElementById('emptyState');

// Check authentication
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        loadUserMicrolearnings(user.uid);
    } else {
        // Redirect to login if not authenticated
        window.location.href = '/login';
    }
});

async function loadUserMicrolearnings(userId) {
    try {
        loadingIndicator.style.display = 'block';
        microlearningsGrid.style.display = 'none';
        emptyState.style.display = 'none';
        
        // Fetch microlearnings from Firestore
        const querySnapshot = await db.collection('microlearnings')
            .where('user_id', '==', userId)
            .orderBy('created_at', 'desc')
            .get();
        
        const microlearnings = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            microlearnings.push(data);
        });
        
        loadingIndicator.style.display = 'none';
        
        if (microlearnings.length === 0) {
            emptyState.style.display = 'block';
        } else {
            displayMicrolearnings(microlearnings);
            microlearningsGrid.style.display = 'grid';
        }
        
    } catch (error) {
        console.error('Error loading microlearnings:', error);
        loadingIndicator.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <div class="empty-icon">⚠️</div>
            <h2>Error loading microlearnings</h2>
            <p>Please try refreshing the page</p>
        `;
    }
}

function displayMicrolearnings(microlearnings) {
    microlearningsGrid.innerHTML = '';
    
    microlearnings.forEach((ml) => {
        const card = createMicrolearningCard(ml);
        microlearningsGrid.appendChild(card);
    });
}

function createMicrolearningCard(microlearning) {
    const card = document.createElement('div');
    card.className = 'microlearning-card';
    card.addEventListener('click', () => {
        viewMicrolearning(microlearning.id);
    });
    
    const title = microlearning.title || 'Untitled';
    const description = microlearning.description || microlearning.summary?.substring(0, 100) || 'No description';
    const readTime = microlearning.estimated_read_time || 'N/A';
    const difficulty = microlearning.difficulty_level || 'Unknown';
    const createdAt = microlearning.created_at ? 
        new Date(microlearning.created_at.seconds ? microlearning.created_at.seconds * 1000 : microlearning.created_at).toLocaleDateString() : 
        'Unknown date';
    
    card.innerHTML = `
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(description)}...</p>
        <div class="microlearning-meta">
            <span>${readTime} min read • ${difficulty}</span>
            <span>${createdAt}</span>
        </div>
    `;
    
    return card;
}

function viewMicrolearning(id) {
    // Navigate to view page or show modal
    window.location.href = `/microlearning/${id}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

