// Előtöltés
$(document).ready(function() {
    // Előtöltő elemek
    const $preloader = $('#preloader');
    const $progressText = $('.progress-text');
    const $images = $('img');
    const totalImages = $images.length;
    let loadedImages = 0;

    // Ha nincsenek képek, azonnal eltüntetjük az előtöltőt
    if(totalImages === 0) {
        hidePreloader();
        return;
    }

    // Képek betöltésének figyelése
    $images.each(function() {
        // Ha a kép már betöltött (cache-ből)
        if(this.complete) {
            imageLoaded();
        } else {
            $(this).on('load error', imageLoaded);
        }
    });

    // Timeout biztonsági netként (max 5 másodperc)
    setTimeout(hidePreloader, 5000);

    function imageLoaded() {
        loadedImages++;
        const progress = Math.round((loadedImages / totalImages) * 100);
        $progressText.text(progress + '%');

        if(loadedImages === totalImages) {
            hidePreloader();
        }
    }

    function hidePreloader() {
        $preloader.addClass('hidden');
        setTimeout(() => {
            $preloader.remove();
        }, 500); 
    }
});


// Modal kezelés
$(document).ready(function(){
    // Összes galéria kép kiválasztása
    var galleryImages = $(".gallery-image img");
    var modal = $("#lightbox-modal");
    var modalImg = $("#modal-image");
    var imageCounter = $(".image-counter");
    var currentIndex = 0; // Nyilvántartjuk az aktuális indexet
    
    // Képkattintás kezelése
    $(".gallery-image").click(function(){
        currentIndex = $(".gallery-image").index($(this)); // Az aktuális kép indexének mentése
        updateModal();
        modal.show();
    });
    
    // Modal bezárása
    $(".close-modal").click(function(){
        modal.hide();
    });
    
    // Kattintás a modal háttérére
    modal.click(function(event) {
        if ($(event.target).is(modal)) {
            modal.hide();
        }
    });
    
    // Előző kép gomb
    $(".prev-image").click(function(e){
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        updateModal();
    });
    
    // Következő kép gomb
    $(".next-image").click(function(e){
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryImages.length;
        updateModal();
    });
    
    // Kép frissítése a modalban
    function updateModal() {
        var img = galleryImages.eq(currentIndex);
        modalImg.attr("src", img.attr("src"));
        modalImg.attr("alt", img.attr("alt"));
        imageCounter.text((currentIndex + 1) + " / " + galleryImages.length);
    }
    
    // Billentyűzet események kezelése
    $(document).keydown(function(e) {
        if (modal.is(":visible")) {
            switch(e.which) {
                case 37: // Bal nyíl
                    $(".prev-image").click();
                    break;
                case 39: // Jobb nyíl
                    $(".next-image").click();
                    break;
                case 27: // ESC
                    modal.hide();
                    break;
                default:
                    return;
            }
            e.preventDefault();
        }
    });
});