document.addEventListener('DOMContentLoaded', () => {

    // --- Smooth Scrolling for Nav Buttons ---
    const navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetSlide = document.getElementById(targetId);
            if (targetSlide) {
                targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // Add a subtle "click" feedback
            button.style.transform = 'translateY(-1px) scale(0.98)';
            setTimeout(() => {
                 // Check if button still exists before resetting style
                 if (document.body.contains(button)) {
                     button.style.transform = ''; // Reset transform fully
                     // Reapply hover lift if still hovering
                     if (button.matches(':hover')) {
                         button.style.transform = 'translateY(-3px)';
                     }
                 }
            }, 150);
        });
         // Ensure hover lift is reapplied correctly after transition if needed
         button.addEventListener('transitionend', (event) => {
            // Only reset if the transform property finished transitioning
            if (event.propertyName === 'transform' && button.matches(':hover') && !button.matches(':active')) {
                button.style.transform = 'translateY(-3px)';
            }
         });
         // Reset transform if mouse leaves *during* the click timeout
         button.addEventListener('mouseleave', () => {
             if (!button.matches(':active')) { // Don't reset if still being clicked
                 button.style.transform = '';
             }
         });
         // Reapply hover transform if mouse enters after click timeout
         button.addEventListener('mouseenter', () => {
             if (!button.matches(':active')) {
                 button.style.transform = 'translateY(-3px)';
             }
         });
    });


    // --- Intersection Observer for Scroll Animations ---
    const slides = document.querySelectorAll('.slide');
    const listItems = document.querySelectorAll('.slide li');

    // Observer for Slides
    const slideObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // Trigger when 30% is visible
    };

    const slideObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // observer.unobserve(entry.target); // Optional: Animate only once
        } else {
          // Optional: Reset animation if slide scrolls out of view
          // entry.target.classList.remove('is-visible');
        }
      });
    };

    const slideObserver = new IntersectionObserver(slideObserverCallback, slideObserverOptions);
    slides.forEach(slide => {
      slideObserver.observe(slide);
    });

    // Observer for List Items (Staggered Animation)
    const liObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger slightly earlier for list items
    };

    const liObserverCallback = (entries, observer) => {
        // Use a Map to track delays per parent list to handle multiple lists correctly
        let delayMap = new Map();

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const listItem = entry.target;
                const listParent = listItem.closest('ul, ol'); // Find the parent list

                // Get or initialize delay for this specific list
                let currentDelay = delayMap.get(listParent) || 0.4; // Start delay for a new list

                listItem.style.transitionDelay = `${currentDelay}s`;
                listItem.classList.add('is-visible'); // Add class to trigger animation

                // Increment delay for the next item *in the same list*
                delayMap.set(listParent, currentDelay + 0.1);

                observer.unobserve(listItem); // Animate each li only once
            }
        });
    };

    const liObserver = new IntersectionObserver(liObserverCallback, liObserverOptions);
    listItems.forEach(li => {
       liObserver.observe(li);
    });


    // --- Mouse Parallax Effect for Corner Images ---
    const parallaxImages = document.querySelectorAll('.corner-image[data-parallax-depth]');

    slides.forEach(slide => {
        slide.addEventListener('mousemove', (e) => {
            // Request animation frame for smoother performance
            window.requestAnimationFrame(() => {
                const rect = slide.getBoundingClientRect();
                // Calculate mouse position relative to the center of the slide
                const mouseX = e.clientX - rect.left - rect.width / 2;
                const mouseY = e.clientY - rect.top - rect.height / 2;

                // Apply parallax effect to images within *this* slide only
                const imagesInSlide = slide.querySelectorAll('.corner-image[data-parallax-depth]');
                imagesInSlide.forEach(img => {
                    const depth = parseFloat(img.getAttribute('data-parallax-depth')) || 0.1; // Default depth
                    // Invert movement slightly for depth illusion
                    const moveX = -(mouseX * depth * 0.1); // Adjust multiplier for sensitivity
                    const moveY = -(mouseY * depth * 0.1);

                    // Apply transform using translate for performance
                    // Combine with existing animation (subtleBob) if needed, though translate is usually enough
                    img.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
        });

        // Reset position when mouse leaves the slide
        slide.addEventListener('mouseleave', () => {
             const imagesInSlide = slide.querySelectorAll('.corner-image[data-parallax-depth]');
             imagesInSlide.forEach(img => {
                 img.style.transform = 'translate(0px, 0px)'; // Reset parallax transform
             });
        });
    });

}); // End DOMContentLoaded
