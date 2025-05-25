// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('.example input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase().trim();
                const flowers = document.querySelectorAll('.text');
                
                flowers.forEach(flower => {
                    const flowerDiv = flower.closest('div');
                    if (flowerDiv) {
                        const flowerName = flower.textContent.toLowerCase();
                        flowerDiv.style.display = flowerName.includes(searchTerm) ? 'block' : 'none';
                    }
                });
            }
        });
    }

    // Image modal and shopping cart
    const flowerImages = document.querySelectorAll('.img');
    let cart = JSON.parse(localStorage.getItem('flowerCart')) || [];

    flowerImages.forEach(img => {
        // Add favorite heart
        const heart = document.createElement('span');
        heart.classList.add('heart-icon');
        img.parentElement.classList.add('flower-item');
        img.parentElement.appendChild(heart);

        // Combined click handler
        img.addEventListener('click', function(e) {
            if (e.target.classList.contains('heart-icon')) return;
            
            // Modal functionality
            const modal = document.createElement('div');
            modal.classList.add('image-modal');
            
            const modalImg = document.createElement('img');
            modalImg.classList.add('modal-image');
            modalImg.src = this.src;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);

            modal.addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Add to cart
            const flowerName = this.nextElementSibling?.textContent;
            if (flowerName) {
                cart.push(flowerName);
                localStorage.setItem('flowerCart', JSON.stringify(cart));
                updateCartCount();
            }
        });

        // Favorite functionality
        heart.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
        });
    });

    // Shopping cart functions
    function updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        const cartLink = document.getElementById('cart-link') || createCartLink();
        
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    }

    function createCartLink() {
        const cartLink = document.createElement('a');
        cartLink.id = 'cart-link';
        cartLink.href = '#';
        cartLink.innerHTML = `Cart (<span id="cart-count">${cart.length}</span>)`;
        
        const navRight = document.querySelector('.nav-right') || document.querySelector('header');
        if (navRight) {
            navRight.appendChild(cartLink);
        }
        return cartLink;
    }

    updateCartCount();

    // Mobile menu toggle
    const menuToggle = document.createElement('button');
    menuToggle.id = 'mobile-menu-toggle';
    menuToggle.textContent = '☰';
    document.body.appendChild(menuToggle);

    const nav = document.querySelector('.nav-right') || document.querySelector('nav');
    if (nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // Responsive check
    function checkResponsive() {
        if (window.innerWidth < 768) {
            menuToggle.style.display = 'block';
            if (nav) nav.classList.remove('active');
        } else {
            menuToggle.style.display = 'none';
            if (nav) nav.classList.add('active');
        }
    }

    window.addEventListener('resize', checkResponsive);
    checkResponsive();

    // Slideshow functionality
    function createSlideshow() {
        const parent = document.getElementById('parent');
        if (!parent) return;

        const flowers = parent.querySelectorAll('div');
        if (flowers.length === 0) return;

        let currentIndex = 0;
        let slideshowInterval;
        
        flowers.forEach(flower => {
            flower.style.display = 'none';
        });
        
        flowers[0].style.display = 'block';
        
        const prevBtn = document.createElement('button');
        prevBtn.classList.add('slideshow-nav', 'prev');
        prevBtn.textContent = '❮';
        
        const nextBtn = prevBtn.cloneNode(true);
        nextBtn.classList.add('slideshow-nav', 'next');
        nextBtn.textContent = '❯';
        
        parent.classList.add('slideshow-container');
        parent.appendChild(prevBtn);
        parent.appendChild(nextBtn);
        
        function showSlide(index) {
            flowers[currentIndex].style.display = 'none';
            currentIndex = (index + flowers.length) % flowers.length;
            flowers[currentIndex].style.display = 'block';
            resetInterval();
        }
        
        function showNext() {
            showSlide(currentIndex + 1);
        }
        
        function showPrev() {
            showSlide(currentIndex - 1);
        }
        
        function resetInterval() {
            clearInterval(slideshowInterval);
            slideshowInterval = setInterval(showNext, 3000);
        }
        
        nextBtn.addEventListener('click', showNext);
        prevBtn.addEventListener('click', showPrev);
        
        parent.addEventListener('mouseenter', () => {
            clearInterval(slideshowInterval);
        });
        
        parent.addEventListener('mouseleave', resetInterval);
        
        resetInterval();
    }

    createSlideshow();
});