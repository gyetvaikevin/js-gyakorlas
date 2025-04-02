$(document).ready(function() {
    // Képek előtöltése
    preloadImages();
    
    // Lightbox inicializálása
    initLightbox();
    
    // Képváltó nyilak kezelése
    initNavigation();
});

function preloadImages() {
    const images = $('.gallery-image img');
    let loaded = 0;
    const total = images.length;
    
    // Frissíti a előtöltő állapotát
    function updateProgress() {
        loaded++;
        const percent = Math.round((loaded / total) * 100);
        $('.progress-text').text(percent + '%');
        
        if (loaded === total) {
            // Minden kép betöltődött, eltüntetjük az előtöltőt
            setTimeout(() => {
                $('#preloader').fadeOut(500, function() {
                    $(this).remove();
                });
            }, 500);
        }
    }
    
    // Minden képhez hozzáadunk egy load eseménykezelőt
    images.each(function() {
        const img = new Image();
        img.src = $(this).attr('src');
        img.onload = updateProgress;
        img.onerror = updateProgress; // Hibák esetén is növeljük a számlálót
    });
}

function initLightbox() {
    const $modal = $('#lightbox-modal');
    const $modalImg = $('#modal-image');
    const $images = $('.gallery-image img');
    const $imageCounter = $('.image-counter');
    let currentIndex = 0;
    
    // Kattintás a képekre
    $images.on('click', function() {
        currentIndex = $images.index(this);
        updateModalImage();
        $modal.fadeIn(300);
    });
    
    // Modal bezárása
    $('.close-modal').on('click', function() {
        $modal.fadeOut(300);
    });
    
    // Modal bezárása kívülre kattintva
    $modal.on('click', function(e) {
        if ($(e.target).is($modal)) {
            $modal.fadeOut(300);
        }
    });
    
    // Modal bezárása ESC billentyűvel
    $(document).on('keyup', function(e) {
        if (e.key === "Escape" && $modal.is(':visible')) {
            $modal.fadeOut(300);
        }
    });
    
    // Kép frissítése a modalban
    function updateModalImage() {
        const $currentImg = $images.eq(currentIndex);
        $modalImg.attr('src', $currentImg.attr('src'));
        $modalImg.attr('alt', $currentImg.attr('alt'));
        $imageCounter.text(`${currentIndex + 1} / ${$images.length}`);
    }
    
    // Visszaadja a currentIndex értékét a navigációhoz
    return {
        getCurrentIndex: function() { return currentIndex; },
        setCurrentIndex: function(index) { currentIndex = index; },
        updateModalImage: updateModalImage
    };
}

function initNavigation() {
    const lightbox = initLightbox();
    const $images = $('.gallery-image img');
    
    // Előző kép gomb
    $('.prev-image').on('click', function(e) {
        e.stopPropagation();
        let currentIndex = lightbox.getCurrentIndex();
        currentIndex = (currentIndex - 1 + $images.length) % $images.length;
        lightbox.setCurrentIndex(currentIndex);
        lightbox.updateModalImage();
    });
    
    // Következő kép gomb
    $('.next-image').on('click', function(e) {
        e.stopPropagation();
        let currentIndex = lightbox.getCurrentIndex();
        currentIndex = (currentIndex + 1) % $images.length;
        lightbox.setCurrentIndex(currentIndex);
        lightbox.updateModalImage();
    });
    
    // Billentyűzet navigáció
    $(document).on('keyup', function(e) {
        if ($('#lightbox-modal').is(':visible')) {
            if (e.key === "ArrowLeft") {
                $('.prev-image').trigger('click');
            } else if (e.key === "ArrowRight") {
                $('.next-image').trigger('click');
            }
        }
    });
}