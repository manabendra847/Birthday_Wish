document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. System Initialization & Error Fallbacks ---
    if (typeof birthday === 'undefined') {
        console.error("data.js is missing or not formatted correctly.");
        return;
    }

    // SVG Placeholder generator for missing images
    const createPlaceholder = (text) => `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' style='background:%23222'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-family='sans-serif' font-size='20'%3E${text}%3C/text%3E%3C/svg%3E`;

    window.addEventListener('error', function(e) {
        if(e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
            e.target.src = createPlaceholder('Image not found');
        }
    }, true);


    // --- 2. Populate HTML from Data ---
    function populateData() {
        // Cover
        document.getElementById("cover-small-text").textContent = birthday.cover.smallText;
        document.getElementById("cover-title").textContent = birthday.cover.title;
        document.getElementById("open-btn").innerHTML = `${birthday.cover.button} <span class="arrow">↓</span>`;

        // Hero
        document.getElementById("hero-intro").textContent = birthday.person.intro;
        document.getElementById("hero-name").textContent = birthday.person.name;
        document.getElementById("hero-bday").textContent = birthday.person.birthdayMessage;
        document.getElementById("hero-subtitle").textContent = birthday.person.subtitle;

        // Letter
        document.getElementById("letter-label").textContent = birthday.letter.label;
        document.getElementById("letter-title").textContent = birthday.letter.title;
        document.getElementById("letter-message").textContent = birthday.letter.message;
        document.getElementById("letter-img").src = birthday.letter.image;

        // Memory Header
        document.getElementById("memory-label").textContent = birthday.memorySection.label;
        document.getElementById("memory-title").textContent = birthday.memorySection.title;

        // Wishes Header
        document.getElementById("wishes-label").textContent = birthday.wishesSection.label;
        document.getElementById("wishes-title").textContent = birthday.wishesSection.title;

        // Gallery Header
        document.getElementById("gallery-label").textContent = birthday.gallery.label;
        document.getElementById("gallery-title").textContent = birthday.gallery.title;

        // Final & Rewind
        document.getElementById("rewind-title").textContent = birthday.rewind.title;
        document.getElementById("rewind-message").textContent = birthday.rewind.message;
        document.getElementById("rewind-ending").textContent = birthday.rewind.ending;
        
        document.getElementById("final-label").textContent = birthday.final.label;
        document.getElementById("final-title").textContent = birthday.final.title;
        document.getElementById("final-name").textContent = birthday.final.name;
        document.getElementById("final-message").textContent = birthday.final.message;

        // Final & Rewind
        document.getElementById("rewind-title").textContent = birthday.rewind.title;
        document.getElementById("rewind-message").textContent = birthday.rewind.message;
        document.getElementById("rewind-ending").textContent = birthday.rewind.ending;
        
        document.getElementById("final-label").textContent = birthday.final.label;
        document.getElementById("final-title").textContent = birthday.final.title;
        document.getElementById("final-name").textContent = birthday.final.name;
        document.getElementById("final-message").textContent = birthday.final.message;

        // --- NEW: Load Final Video if it exists ---
        const finalVideo = document.getElementById("final-video");
        const finalOverlay = document.getElementById("final-video-overlay");
        
        if (birthday.final.video && birthday.final.video !== "") {
            finalVideo.src = birthday.final.video;
            finalVideo.classList.remove("hidden");
            finalOverlay.classList.remove("hidden");
        }
    }


    // --- 3. Build Dynamic Arrays ---
    function buildDynamicSections() {
        // Memories
        const timeline = document.getElementById("timeline-container");
        if (birthday.memories && birthday.memories.length > 0) {
            birthday.memories.forEach(mem => {
                const div = document.createElement('div');
                div.className = 'memory-card fade-in-section';
                div.innerHTML = `
                    <div class="memory-point"></div>
                    <div class="memory-content">
                        <div class="memory-year">${mem.year}</div>
                        <h3 class="serif-title" style="font-size: 1.8rem;">${mem.title}</h3>
                        <p class="subtitle">${mem.text}</p>
                    </div>
                    <div class="memory-image">
                        <img src="${mem.image}" alt="${mem.title}" loading="lazy">
                        ${mem.caption ? `<p class="label" style="margin-top:10px; text-align:center;">${mem.caption}</p>` : ''}
                    </div>
                `;
                timeline.appendChild(div);
            });
        } else {
            document.getElementById("memory-section").classList.add("hidden");
        }

        // Wishes
        const wishesContainer = document.getElementById("wishes-container");
        if (birthday.wishes && birthday.wishes.length > 0) {
            birthday.wishes.forEach(wish => {
                const div = document.createElement('div');
                div.className = 'wish-card';
                div.innerHTML = `
                    <p class="wish-message">"${wish.message}"</p>
                    <h4 class="wish-author">${wish.name}</h4>
                    <span class="wish-relation">${wish.relation}</span>
                `;
                wishesContainer.appendChild(div);
            });
        } else {
            document.getElementById("wishes-section").classList.add("hidden");
        }

        // Gallery & Rewind Marquee
        const galleryContainer = document.getElementById("gallery-container");
        const marqueeTrack = document.getElementById("marquee-track");
        
        if (birthday.galleryPhotos && birthday.galleryPhotos.length > 0) {
            // Combine all photos for the rewind marquee
            const allPhotos = [...birthday.galleryPhotos.map(p=>p.image), ...birthday.memories.map(m=>m.image)];
            
            // Populate Gallery
            birthday.galleryPhotos.forEach(photo => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `<img src="${photo.image}" alt="${photo.caption || 'Memory'}" loading="lazy">`;
                galleryContainer.appendChild(div);
            });

            // Populate Marquee (Double for infinite scroll illusion)
            const marqueePhotos = [...allPhotos, ...allPhotos];
            marqueePhotos.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'marquee-img';
                marqueeTrack.appendChild(img);
            });
        } else {
            document.getElementById("gallery-section").classList.add("hidden");
            document.getElementById("rewind-section").classList.add("hidden");
        }
    }


    // --- 4. Canvas Scratch Reveal ---
    function buildReveals() {
        const revealContainer = document.getElementById("reveal-container");
        if (!birthday.reveals || birthday.reveals.length === 0) {
            document.getElementById("reveal-section").classList.add("hidden");
            return;
        }

        birthday.reveals.forEach((rev, index) => {
            const card = document.createElement('div');
            card.className = 'reveal-card';
            
            const img = document.createElement('img');
            img.src = rev.image;
            img.className = 'reveal-hidden';
            
            const overlay = document.createElement('div');
            overlay.className = 'reveal-overlay';
            overlay.innerHTML = `<h3 style="color:#222; text-shadow:0 0 10px #fff;">${rev.title}</h3><p style="color:#333; font-weight:500;">${rev.message}</p>`;

            const canvas = document.createElement('canvas');
            canvas.className = 'scratch-canvas';
            canvas.id = `scratch-${index}`;

            card.appendChild(img);
            card.appendChild(overlay);
            card.appendChild(canvas);
            revealContainer.appendChild(card);
        });
    }

    function initScratchCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        let totalPixels = 0;
        let isRevealed = false;
        let isDrawing = false;
        let scratchedPixels = 0;


        // Calculates width/height dynamically when called
        function resizeCanvas() {
            if (isRevealed) return;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            totalPixels = canvas.width * canvas.height;
            
            ctx.globalCompositeOperation = 'source-over';
            
            // --- 1. Create a beautiful cinematic gradient ---
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#1a1a1a');      // Dark charcoal
            gradient.addColorStop(0.5, '#3d3425');    // Subtle warm golden tint
            gradient.addColorStop(1, '#050505');      // Deep dark
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // --- 2. Add elegant instruction text ---
            ctx.fillStyle = '#f7cb51'; // Template's golden accent color
            ctx.font = 'italic 30px "Playfair Display", serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🤏👆 Scratch to reveal 👆🤏', canvas.width / 2, canvas.height / 2);
            
            scratchedPixels = 0;
        }

        // Initialize size immediately when called
        resizeCanvas();

        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: clientX - rect.left, y: clientY - rect.top };
        };

        const scratch = (e) => {
            if (!isDrawing || isRevealed) return;
            e.preventDefault();
            const pos = getMousePos(e);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 40, 0, Math.PI * 2);
            ctx.fill();
            
            scratchedPixels += (Math.PI * 40 * 40); 
            
            if (scratchedPixels > (totalPixels * 1.5)) { 
                canvas.style.opacity = '0';
                isRevealed = true;
                setTimeout(() => canvas.style.display = 'none', 1000);
            }
        };

        canvas.addEventListener('mousedown', () => isDrawing = true);
        canvas.addEventListener('touchstart', (e) => { isDrawing = true; e.preventDefault(); }, {passive: false});
        
        window.addEventListener('mouseup', () => isDrawing = false);
        window.addEventListener('touchend', () => isDrawing = false);
        
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('touchmove', scratch, {passive: false});
        
        window.addEventListener('resize', resizeCanvas);
    }

    // Helper to initialize all canvases at the right time
    function initializeAllCanvases() {
        const canvases = document.querySelectorAll('.scratch-canvas');
        canvases.forEach(canvas => initScratchCanvas(canvas));
    }


    // --- 5. Scroll-Driven Hero Animation ---
    function initScrollAnimation() {
        const track = document.getElementById('hero-scroll-track');
        const img = document.getElementById('hero-img');
        const intro = document.getElementById('hero-intro');
        const mainReveal = document.querySelector('.hero-main-reveal');
        const divider = document.querySelector('.hero-divider');
        const indicator = document.querySelector('.scroll-indicator');
        
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if(track.getBoundingClientRect().bottom > 0) {
                        
                        // Calculate scroll progress (0 to 1) within the track
                        const rect = track.getBoundingClientRect();
                        const trackHeight = track.offsetHeight - window.innerHeight;
                        let progress = -rect.top / trackHeight;
                        progress = Math.max(0, Math.min(1, progress));

                        // Hide scroll indicator once scrolling starts
                        indicator.style.opacity = progress > 0.05 ? 0 : 1;

                        // Phase 1: Image Zoom & Move
                        const scale = 1.1 + (progress * 0.2);
                        const yMove = progress * 10;
                        img.style.transform = `scale(${scale}) translateY(${yMove}%)`;

                        // Phase 2-4: Intro Text (Fades in around 0.1, up, fades out at 0.4)
                        if (progress < 0.5) {
                            let introOp = 0;
                            if (progress > 0.1 && progress < 0.2) introOp = (progress - 0.1) * 10;
                            if (progress >= 0.2 && progress <= 0.35) introOp = 1;
                            if (progress > 0.35 && progress < 0.45) introOp = 1 - ((progress - 0.35) * 10);
                            
                            intro.style.opacity = Math.max(0, introOp);
                            intro.style.transform = `translate(-50%, calc(-50% - ${progress * 50}px))`;
                            mainReveal.style.opacity = 0;
                        } 
                        // Phase 6-10: Main Reveal (Starts at 0.5)
                        else {
                            intro.style.opacity = 0;
                            let mainOp = (progress - 0.5) * 2.5; // reaches 1 at 0.9
                            mainReveal.style.opacity = Math.max(0, Math.min(1, mainOp));
                            mainReveal.style.transform = `translate(-50%, calc(-50% + ${(1 - mainOp) * 20}px))`;
                            
                            // Divider line animation
                            if (progress > 0.7) {
                                divider.style.width = Math.min(100, (progress - 0.7) * 400) + 'px';
                            } else {
                                divider.style.width = '0px';
                            }
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }


    // --- 6. Intersection Observers (Fade In Sections) ---
    function initObservers() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Unobserve after animating in
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));
    }


    // --- 7. Music & Audio ---
    function initMusic() {
        const audio = document.getElementById("bg-music");
        const btn = document.getElementById("music-toggle");
        
        if (!birthday.music || !birthday.music.enabled) {
            btn.style.display = 'none';
            return;
        }

        audio.src = birthday.music.file;
        let isPlaying = false;

        btn.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                btn.classList.remove('playing');
            } else {
                // Catch potential autoplay restrictions gracefully
                audio.play().then(() => {
                    btn.classList.add('playing');
                }).catch(err => console.log("Audio play failed:", err));
            }
            isPlaying = !isPlaying;
        });
    }


    // --- 8. Initialization & Flow ---
    function initializePage() {
        // Lock scrolling initially
        document.body.classList.add('locked');
        
        populateData();
        buildDynamicSections();
        buildReveals();
        initMusic();

    // --- NEW: Cinematic Celebration Graphics (Confetti) ---
    function triggerCelebration() {
        // Create an invisible canvas on top of everything
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.inset = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none'; // Lets clicks pass through
        canvas.style.zIndex = '99999'; // Stays on top
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        // Elegant color palette matching your CSS theme (Gold, Cream, White)
        const colors = ['#C2A878', '#FDFBF7', '#EAE6DF', '#ffffff']; 

        // Generate 150 particles
        for (let i = 0; i < 200; i++) {
            particles.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 50, // Burst slightly below the button
                vx: (Math.random() - 0.5) * 25, // Horizontal spread
                vy: (Math.random() - 1) * 20 - 5, // Upwards arc
                size: Math.random() * 5 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                opacity: 1
            });
        }

        let animationFrame;

        // Animate particles
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            particles.forEach(p => {
                if (p.opacity > 0) {
                    active = true;
                    // Apply physics (gravity and movement)
                    p.vy += 0.4; 
                    p.x += p.vx;
                    p.y += p.vy;
                    p.rotation += p.rotationSpeed;
                    
                    // Fade out slowly as they fall
                    if (p.y > canvas.height - 200 || p.vy > 10) {
                        p.opacity -= 0.015; 
                    }

                    if(p.opacity > 0) {
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate((p.rotation * Math.PI) / 180);
                        ctx.globalAlpha = Math.max(0, p.opacity);
                        ctx.fillStyle = p.color;
                        // Draw confetti rectangles
                        ctx.fillRect(-p.size, -p.size / 2, p.size * 2.5, p.size);
                        ctx.restore();
                    }
                }
            });

            // Loop until all particles fade out, then remove the canvas
            if (active) {
                animationFrame = requestAnimationFrame(render);
            } else {
                cancelAnimationFrame(animationFrame);
                canvas.remove();
            }
        }
        
        render();
    }
        
// Tap to Open Logic
        document.getElementById("open-btn").addEventListener("click", () => {
            const cover = document.getElementById("cover");
            const main = document.getElementById("main-content");
            const audio = document.getElementById("bg-music");
            const musicBtn = document.getElementById("music-toggle");
            
            cover.classList.add("fade-out");
            
            // --- NEW: Play music on cover tap ---
            if (birthday.music && birthday.music.enabled) {
                audio.play().then(() => {
                    musicBtn.classList.add('playing');
                }).catch(err => console.log("Audio play failed/blocked by browser:", err));
            }

            // --- NEW: Trigger Elegant Confetti Burst ---
            triggerCelebration();
            // -------------------------------------------

            // Wait for fade out
            setTimeout(() => {
                cover.style.display = 'none';
                main.classList.remove("hidden");
                document.body.classList.remove('locked');
                
                initScrollAnimation();
                initObservers();
                initializeAllCanvases(); // Your updated scratch fix
                
                window.dispatchEvent(new Event('scroll'));
            }, 1000); 
        });

        // Replay Logic
        document.getElementById("replay-btn").addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            if (birthday.settings.replayShowsCover) {
                setTimeout(() => {
                    document.body.classList.add('locked');
                    const cover = document.getElementById("cover");
                    cover.style.display = 'flex';
                    // Force reflow
                    void cover.offsetWidth;
                    cover.classList.remove("fade-out");
                    document.getElementById("main-content").classList.add("hidden");
                }, 800); // wait for smooth scroll to mostly finish
            }
        });
    }

    // Run
    initializePage();
});