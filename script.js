// المتغيرات الافتراضية لقراءة الرابط واستخراج البيانات
let currentUrl = "https://manga-starz.net/manga/spirit-farmer/1/";
let mangaName = "Spirit farmer";
let currentChapter = 1;
let baseUrlWithoutChapter = "https://manga-starz.net/manga/spirit-farmer/";

// دالة لتفكيك الرابط ومعرفة اسم المانهوا ورقم الفصل الحالي
function parseUrl(url) {
    try {
        // تنظيف الرابط من أي مسافات أو فواصل زائدة في النهاية
        let cleanUrl = url.trim();
        if (cleanUrl.endsWith('/')) {
            cleanUrl = cleanUrl.slice(0, -1);
        }

        // استخراج الأجزاء المكونة للرابط
        let parts = cleanUrl.split('/');
        
        // الرقم الأخير هو رقم الفصل
        let chapter = parseInt(parts[parts.length - 1]);
        
        // الاسم يكون قبل رقم الفصل بجزءين (حسب هيكلة الرابط المذكور)
        let nameAttr = parts[parts.length - 2];
        // تحويل الاسم لشكل مقروء (استبدال الشرطات بمسافات وتكبير الحروف الأولى)
        let formattedName = nameAttr.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

        if (!isNaN(chapter)) {
            currentChapter = chapter;
            mangaName = formattedName;
            // إعادة بناء الرابط الأساسي بدون رقم الفصل
            baseUrlWithoutChapter = cleanUrl.substring(0, cleanUrl.lastIndexOf('/')) + '/';
            updateUI();
        } else {
            alert("تأكد من أن الرابط ينتهي برقم الفصل (مثال: /1/)");
        }
    } catch (e) {
        alert("خطأ في قراءة الرابط، يرجى التأكد من الصيغة.");
    }
}

// دالة لتحديث واجهة المستخدم (العنوان والرابط في الخانة)
function updateUI() {
    document.getElementById("manga-title").innerText = `${mangaName} - الفصل ${currentChapter}`;
    let newFullUrl = `${baseUrlWithoutChapter}${currentChapter}/`;
    document.getElementById("url-input").value = newFullUrl;
    
    // التمرير إلى أعلى الصفحة تلقائياً عند تغيير الفصل
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // استدعاء دالة عرض الصور للفصل الجديد
    loadImages();
}

// دالة تغيير رقم الفصل عند الضغط على التالي (+1) أو السابق (-1)
function changeChapter(direction) {
    currentChapter += direction;
    if (currentChapter < 1) {
        currentChapter = 1; // منع النزول تحت الفصل 1
    }
    updateUI();
}

// دالة لتحديث الرابط يدويًا من الخانة النصية
function loadNewBaseUrl() {
    let inputUrl = document.getElementById("url-input").value;
    parseUrl(inputUrl);
}

// دالة محاكاة تحميل الصور وعرضها
function loadImages() {
    const container = document.getElementById("images-container");
    container.innerHTML = ""; // تنظيف الصور السابقة

    /* 
       تنبيه تقني: لأننا لا نملك سيرفر يتخطى حماية مواقع المانجا (CORS)، 
       هنا نقوم بتوليد روابط افتراضية للصور بناءً على نمط سيرفرات المانجا الشائع.
       إذا كان للموقع نمط صور ثابت، يمكننا وضعه هنا ليتم سحب الصور مباشرة.
    */
    
    // كود تجريبي لعرض آلية العمل (توليد 10 صور كمثال للفصل الحالي)
    for (let i = 1; i <= 10; i++) {
        let img = document.createElement("img");
        // هنا يتم وضع رابط السيرفر الفعلي للصور، كمثال:
        img.src = `https://via.placeholder.com/800x1200/121212/ffffff?text=${mangaName}+-+Ch+${currentChapter}+-+Page+${i}`;
        
        // في حال توفرت الروابط الحقيقية المستقرة للموقع يتم تبديل السطر العلوي بـ:
        // img.src = `رابط_سيرفر_الصور/${mangaName}/${currentChapter}/${i}.jpg`;

        img.alt = `صفحة ${i}`;
        container.appendChild(img);
    }
}

// تشغيل الدالة لأول مرة عند فتح الصفحة بناءً على الرابط الافتراضي
window.onload = function() {
    parseUrl(currentUrl);
};
