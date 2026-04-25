// Contact Form Handler - No External Services
(function() {
    'use strict';
    
    const recipientEmail = 'ricardo@hernandezchang.com';
    
    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }
    
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const successDiv = document.getElementById('form-success');
        
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Create mailto link
            const mailtoSubject = encodeURIComponent('Contact Form: ' + subject);
            const mailtoBody = encodeURIComponent(
                'Name: ' + name + '\n' +
                'Email: ' + email + '\n' +
                '\n' +
                'Message:\n' + message + '\n' +
                '\n' +
                '---\n' +
                'Sent from the contact form on the website'
            );
            
            // Show success message
            if (successDiv) {
                document.getElementById('contact-form-container').style.display = 'none';
                successDiv.classList.remove('hidden');
            }
            
            // Open email client after brief delay
            setTimeout(function() {
                window.location.href = 'mailto:' + recipientEmail + '?subject=' + mailtoSubject + '&body=' + mailtoBody;
                
                // Reset form after opening email client
                setTimeout(function() {
                    form.reset();
                    if (successDiv) {
                        successDiv.classList.add('hidden');
                        document.getElementById('contact-form-container').style.display = 'block';
                    }
                }, 3000);
            }, 1000);
        });
    }
})();
