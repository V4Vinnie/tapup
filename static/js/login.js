/**
 * Login Page Handler
 */

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Sign in with Firebase Auth
        await window.auth.signInWithEmailAndPassword(email, password);
        
        // Redirect to dashboard (auth state change will handle this)
        window.location.href = '/dashboard';
        
    } catch (error) {
        console.error('Login error:', error);
        let errorMsg = 'An error occurred during login.';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMsg = 'No account found with this email. Please sign up.';
                break;
            case 'auth/wrong-password':
                errorMsg = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMsg = 'Please enter a valid email address.';
                break;
            case 'auth/user-disabled':
                errorMsg = 'This account has been disabled.';
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

