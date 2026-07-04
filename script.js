let currentUrl = "https://manga-starz.net/manga/spirit-farmer/1/";
let mangaName = "Spirit Farmer";
let currentChapter = 1;
let baseUrlWithoutChapter = "https://manga-starz.net/manga/spirit-farmer/";

// دالة لتفكيك وفحص الرابط المدخل
function parseUrl(url) {
    if (!url) return;
    
    let cleanUrl = url.trim();
    if (cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
    }

    let parts = cleanUrl.split('/');
    let chapter = parseInt(parts[parts.length - 1]);
    
    if (!isNaN(chapter)) {
        currentChapter = chapter;
        // استخراج الاسم من الرابط وتنسيقه
        let nameAttr = parts[parts.length - 2];
        mangaName = nameAttr.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        baseUrlWithoutChapter = cleanUrl.substring(0, cleanUrl.lastIndexOf('/')) + '/';
        
        updateUI();
    } else {
        // إذا كان هناك خلل في صيغة الرابط، نكتفي بإنشاء الواجهة بدون التسبب في إيقاف الصفحة
        updateUI();
    }
}

// تحديث النصوص والرابط في الواجهة
function updateUI() {
    document.getElementById("manga-title").innerText = `${mangaName} - الفصل ${currentChapter}`;
    let newFullUrl = `${baseUrlWithoutChapter}${currentChapter}/`;
    document.getElementById("url-input").value = newFullUrl;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadMangaImages();
}

// دالة أزرار التالي والسابق لتغيير الرقم في آخر الرابط
function changeChapter(direction) {
    currentChapter += direction;
    if (currentChapter < 1) currentChapter = 1;
    updateUI();
}

// عند ضغط زر "تحديث" يدويًا
function loadNewBaseUrl() {
    let inputUrl = document.getElementById("url-input").value;
    parseUrl(inputUrl);
}

// دالة جلب وعرض الصور الحقيقية وتجنب حماية الموقع (CORS)
function loadMangaImages() {
    const container = document.getElementById("images-container");
    container.innerHTML = ""; // تنظيف الصفحة

    // لتجاوز حماية المواقع، سنقوم بتوليد روابط الصور مباشرة من السيرفر الخاص بموقع المانجا المذكور.
    // عادةً تكون التسمية مرقمة من 1 إلى 60 أو أكثر داخل الفصل.
    for (let i = 1; i <= 60; i++) {
        let img = document.createElement("img");
        
        // تحويل الرقم إلى صيغة خانتين أو ثلاث خانات إذا كان السيرفر يتطلب ذلك (مثال: 01, 02 أو 001)
        let pageNum = String(i).padStart(2, '0'); 
        
        // هذا هو النمط الشائع لروابط الصور المباشرة المخزنة على سيرفرات المانجا (تعتمد على اسم المانجا ورقم الفصل)
        // يمكنك تعديل هذا الرابط ليتوافق تماماً مع السيرفر الذي يرفع عليه الموقع الصور
        img.src = `https://manga-starz.net/wp-content/uploads/manga/${mangaName.toLowerCase().replace(' ', '-')}/chapters/${currentChapter}/${pageNum}.jpg`;
        
        img.alt = `صفحة ${i}`;

        // إذا انتهى الفصل ووصلنا لرقم صورة غير موجودة، تختفي الصورة المكسورة تلقائياً وتتوقف الحاوية نظيفة
        img.onerror = function() {
            this.remove(); 
        };

        container.appendChild(img);
    }
}

// التشغيل المبدئي الآمن عند فتح الصفحة لأول مرة
window.onload = function() {
    parseUrl(currentUrl);
};
