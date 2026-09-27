document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Auto dismiss flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => {
                msg.remove();
            }, 300);
        }, 5000);
    });
});
