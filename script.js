let currentChapter = 1;
let mangaName = "Spirit Farmer";
// كائن لحفظ روابط صور كل فصل بشكل مستقل لمنع ضياعها أثناء التنقل
let chaptersData = {}; 

function updateUI() {
    document.getElementById("manga-title").innerText = `${mangaName} - الفصل ${currentChapter}`;
    
    // استرجاع الروابط المخزنة لهذا الفصل إن وجدت
    if (chaptersData[currentChapter]) {
        document.getElementById("images-urls").value = chaptersData[currentChapter];
        displayImages(chaptersData[currentChapter]);
    } else {
        document.getElementById("images-urls").value = "";
        document.getElementById("images-container").innerHTML = '<p class="notice">الفصل الجديد فارغ. يرجى لصق روابط الصور الحقيقية هنا وضغط "عرض الصور".</p>';
    }

    // التمرير لأعلى الصفحة عند الانتقال
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// دالة لمعالجة وعرض الصور التي يلصقها المستخدم
function loadManualImages() {
    let rawUrls = document.getElementById("images-urls").value;
    if (!rawUrls.trim()) {
        alert("الرجاء لصق روابط صور أولاً!");
        return;
    }
    // حفظ الروابط الحالية للفصل الحالي
    chaptersData[currentChapter] = rawUrls;
    displayImages(rawUrls);
}

// دالة البناء الفعلي للصور داخل الصفحة
function displayImages(rawText) {
    const container = document.getElementById("images-container");
    container.innerHTML = ""; // تنظيف الواجهة

    // تقسيم النص إلى روابط منفصلة بناءً على السطور
    let urlsArray = rawText.split('\n');

    urlsArray.forEach((url, index) => {
        let cleanUrl = url.trim();
        if (cleanUrl) {
            let img = document.createElement("img");
            img.src = cleanUrl;
            img.alt = `صفحة ${index + 1}`;
            
            // معالجة الخطأ في حال كان الرابط محمي أو تالف
            img.onerror = function() {
                this.style.display = 'none'; // إخفاء الصورة المكسورة لتظل الشاشة نظيفة
            };

            container.appendChild(img);
        }
    });
}

// دالة أزرار التالي والسابق
function changeChapter(direction) {
    // حفظ الروابط المكتوبة حالياً قبل الانتقال لفصل آخر
    let currentInput = document.getElementById("images-urls").value;
    if (currentInput.trim()) {
        chaptersData[currentChapter] = currentInput;
    }

    currentChapter += direction;
    if (currentChapter < 1) {
        currentChapter = 1;
    }
    updateUI();
}

// تشغيل الواجهة المبدئية عند الفتح
window.onload = function() {
    updateUI();
};
