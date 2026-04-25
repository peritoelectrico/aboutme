// Lightbox functionality - must run after main.js
(function() {
    'use strict';
    
    // Create lightbox elements
    function createLightbox() {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        
        const img = document.createElement('img');
        img.className = 'lightbox-content';
        img.id = 'lightbox-img';
        
        const caption = document.createElement('div');
        caption.className = 'lightbox-caption';
        caption.id = 'lightbox-caption';
        
        lightbox.appendChild(closeBtn);
        lightbox.appendChild(img);
        lightbox.appendChild(caption);
        document.body.appendChild(lightbox);
        
        return lightbox;
    }
    
    // Initialize lightbox
    const lightbox = createLightbox();
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    // Close functions
    function closeLightbox() {
        lightbox.style.display = 'none';
    }
    
    // Close on X click
    closeBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
        return false;
    };
    
    // Close on background click
    lightbox.onclick = function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    };
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            e.preventDefault();
            closeLightbox();
        }
    });
    
    // Setup click handlers for images
    function setupLightbox() {
        // Find all images with class 'fit' inside 'image' class links in the work section
        const images = document.querySelectorAll('#work .image.fit img');
        
        images.forEach(function(img) {
            const link = img.parentElement;
            const src = img.src;
            const alt = img.alt || 'Image';
            
            // Add a data attribute to mark this as a lightbox image
            link.setAttribute('data-lightbox', 'true');
            
            // Add click handler with highest priority
            link.addEventListener('click', function(e) {
                // Prevent default navigation
                e.preventDefault();
                e.stopPropagation();
                
                // Set lightbox content
                lightboxImg.src = src;
                lightboxCaption.textContent = alt;
                
                // Show lightbox
                lightbox.style.display = 'block';
                
                return false;
            });
        });
    }
    
    // Run on DOM ready with delay to ensure main.js has loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setupLightbox, 10);
        });
    } else {
        setTimeout(setupLightbox, 10);
    }
    
    // Track current image index
    let currentIndex = 0;
    let allImages = [];
    
    function updateImageList() {
        allImages = Array.from(document.querySelectorAll('#work .image.fit img'));
    }
    
    function updateIndex() {
        updateImageList();
        allImages.forEach((img, index) => {
            if (img.src === lightboxImg.src) {
                currentIndex = index;
            }
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                e.stopPropagation();
                updateIndex();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
                lightboxImg.src = allImages[prevIndex].src;
                lightboxCaption.textContent = allImages[prevIndex].alt || 'Image';
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                e.stopPropagation();
                updateIndex();
                const nextIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
                lightboxImg.src = allImages[nextIndex].src;
                lightboxCaption.textContent = allImages[nextIndex].alt || 'Image';
            }
        }
    });
})();
