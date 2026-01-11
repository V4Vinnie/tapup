/**
 * Registration Page Handler
 */

const registerForm = document.getElementById('registerForm');
const errorMessage = document.getElementById('errorMessage');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    
    const displayName = document.getElementById('displayName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    // Validate password length
    if (password.length < 6) {
        showError('Password must be at least 6 characters');
        return;
    }
    
    try {
        // Create user with Firebase Auth
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await user.updateProfile({
            displayName: displayName
        });
        
        // User is automatically saved to Firestore via auth.js onAuthStateChanged
        // Redirect to dashboard
        window.location.href = '/dashboard';
        
    } catch (error) {
        console.error('Registration error:', error);
        let errorMsg = 'An error occurred during registration.';
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMsg = 'This email is already registered. Please sign in instead.';
                break;
            case 'auth/invalid-email':
                errorMsg = 'Please enter a valid email address.';
                break;
            case 'auth/weak-password':
                errorMsg = 'Password is too weak. Please choose a stronger password.';
                break;
            default:
                errorMsg = error.message || errorMsg;
        }
        
        showError(errorMsg);
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

