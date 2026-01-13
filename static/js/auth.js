/**
 * Firebase Authentication Handler
 */

// Check authentication state and update UI
if (window.auth) {
    window.auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        updateAuthUI(true, user);
        
        // Save user to Firestore if needed
        saveUserToFirestore(user);
    } else {
        // User is signed out
        updateAuthUI(false, null);
    }
    });
}

function updateAuthUI(isSignedIn, user) {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardLink = document.getElementById('dashboardLink');
    const createLink = document.getElementById('createLink');
    
    if (isSignedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
        if (dashboardLink) dashboardLink.style.display = 'inline-block';
        if (createLink) createLink.style.display = 'inline-block';
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (createLink) createLink.style.display = 'none';
    }
}

// Logout handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            if (window.auth) {
                await window.auth.signOut();
            }
            window.location.href = '/';
        } catch (error) {
            console.error('Error signing out:', error);
            showError('Error signing out. Please try again.');
        }
    });
}

// Save user to Firestore
async function saveUserToFirestore(user) {
    try {
        if (!window.db) return;
        const userRef = window.db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        
        if (!doc.exists) {
            // Create user document
            await userRef.set({
                email: user.email,
                display_name: user.displayName || '',
                created_at: window.firebase.firestore.FieldValue.serverTimestamp(),
                updated_at: window.firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            // Update last login
            await userRef.update({
                updated_at: window.firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error saving user to Firestore:', error);
    }
}

// Get current user
function getCurrentUser() {
    return window.auth ? window.auth.currentUser : null;
}

// Show error message
function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    } else {
        alert(message);
    }
}

// Hide error message
function hideError() {
    const errorEl = document.getElementById('errorMessage');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
}

