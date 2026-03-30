document.addEventListener('DOMContentLoaded', () => {
    // === DATA: 6 ARTICLES ===
    const articlesData = [
        { cat: 'Nutrition', title: 'Cancer Patient Diet Guide', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400' },
        { cat: 'Mental Health', title: 'Managing Stress During Chemo', img: 'https://images.unsplash.com/photo-1576091160550-2173bdb999ef?q=80&w=400' },
        { cat: 'Support', title: 'Accessing Global PAP Programs', img: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=400' },
        { cat: 'Exercise', title: 'Yoga for Recovery Support', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400' },
        { cat: 'Research', title: 'Latest in Immunotherapy', img: 'https://images.unsplash.com/photo-1579152276506-448c66099593?q=80&w=400' },
        { cat: 'Lifestyle', title: 'Sleep Quality & Treatment', img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=400' }
    ];

    // === ELEMENTS ===
    const mainSearch = document.getElementById('main-search');
    const overlay = document.getElementById('search-overlay');
    const suggestions = document.getElementById('search-suggestions');
    const homeGrid = document.getElementById('home-articles-grid');
    
    // Pages
    const pages = {
        home: document.getElementById('step-home'),
        search: document.getElementById('step-search-result'),
        upload: document.getElementById('step-result'),
        loading: document.getElementById('step-loading')
    };

    // === RENDER HOME ARTICLES ===
    function renderArticles(container, data) {
        container.innerHTML = data.map(item => `
            <div class="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group cursor-pointer">
                <div class="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style="background-image: url('${item.img}')"></div>
                <div class="p-6 space-y-3">
                    <span class="text-[10px] font-bold text-blue-500 uppercase tracking-widest">${item.cat}</span>
                    <h4 class="font-bold text-lg group-hover:text-blue-600 transition-colors">${item.title}</h4>
                    <p class="text-sm text-slate-500 line-clamp-2">Providing essential insights and clinical guidance for patients and caregivers.</p>
                </div>
            </div>
        `).join('');
    }
    renderArticles(homeGrid, articlesData);

    // === SEARCH & OVERLAY LOGIC (FIXED) ===
    function toggleSearchUI(active) {
        if (active) {
            overlay.classList.remove('pointer-events-none', 'opacity-0');
            overlay.classList.add('opacity-40');
            suggestions.classList.remove('hidden');
        } else {
            overlay.classList.add('opacity-0', 'pointer-events-none');
            overlay.classList.remove('opacity-40');
            suggestions.classList.add('hidden');
            mainSearch.blur();
        }
    }

    mainSearch.addEventListener('focus', () => toggleSearchUI(true));
    overlay.addEventListener('click', () => toggleSearchUI(false));

    mainSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && mainSearch.value.trim() !== "") {
            handleSearch(mainSearch.value);
        }
    });

    function handleSearch(query) {
        toggleSearchUI(false);
        // Switch Page
        Object.values(pages).forEach(p => p.classList.add('hidden'));
        pages.search.classList.remove('hidden');
        
        document.getElementById('search-query-text').innerText = query;
        document.getElementById('result-count').innerText = "12";
        
        const resGrid = document.getElementById('search-results-grid');
        renderArticles(resGrid, [...articlesData, ...articlesData]); // Fake nhiều kết quả
        window.scrollTo(0, 0);
    }

    // === UPLOAD LOGIC ===
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => e.target.files[0] && startUploadProcess());

    function startUploadProcess() {
        pages.loading.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        let progress = 0;
        const bar = document.getElementById('progress-bar');
        const status = document.getElementById('loading-status');
        const steps = ["Scanning...", "Analyzing meds...", "Matching programs...", "Finalizing hub..."];

        const interval = setInterval(() => {
            progress += 2;
            bar.style.width = progress + "%";
            status.innerText = steps[Math.floor((progress/100) * steps.length)] || "Done!";

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    pages.loading.classList.add('hidden');
                    Object.values(pages).forEach(p => p.classList.add('hidden'));
                    pages.upload.classList.remove('hidden');
                    document.body.style.overflow = 'auto';
                    window.scrollTo(0, 0);
                }, 500);
            }
        }, 40);
    }
});