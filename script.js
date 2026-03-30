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
        Object.values(pages).forEach(p => p.classList.add('hidden'));
        pages.search.classList.remove('hidden');
        
        document.getElementById('search-query-text').innerText = query;
        document.getElementById('result-count').innerText = "12";
        
        const resGrid = document.getElementById('search-results-grid');
        renderArticles(resGrid, [...articlesData, ...articlesData]);
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

    // ============================================================
    // MEDINAV AI CHATBOT
    // ============================================================

    const chatKB = {
        greet: "Xin chào! 👋 Tôi là <strong>MediNav AI</strong>. Tôi có thể giúp bạn:<br>• Phân tích đơn thuốc (upload)<br>• Tìm chương trình hỗ trợ tài chính (PAP)<br>• Giải đáp về thuốc & tác dụng phụ<br><br>Bạn cần hỗ trợ gì hôm nay?",
        rules: [
            {
                keywords: ['upload', 'tải lên', 'drop', 'kéo thả', 'đơn thuốc', 'scan', 'ảnh', 'file', 'pdf'],
                reply: "📎 <strong>Cách upload đơn thuốc:</strong><br>1. Vào trang chủ MediNav<br>2. Kéo thả file vào vùng xanh dương (Drop Zone) hoặc click vào đó<br>3. Hỗ trợ: JPG, PNG, PDF<br><br>AI sẽ tự động phân tích trong vài giây! ✅"
            },
            {
                keywords: ['keytruda', 'pembrolizumab', 'merck', 'pap', 'hỗ trợ tài chính', 'chi phí', 'miễn phí', 'giảm giá'],
                reply: "💊 <strong>Merck Patient Assistance Program (PAP):</strong><br>• Hỗ trợ chi phí Keytruda cho bệnh nhân đủ điều kiện<br>• Yêu cầu: Thu nhập ≤ 4× mức nghèo liên bang Mỹ, không có bảo hiểm đầy đủ<br>• Liên hệ: <strong>1-800-727-5400</strong> hoặc merckhelps.com<br><br>Bạn muốn tôi hướng dẫn quy trình đăng ký không? 🙋"
            },
            {
                keywords: ['tác dụng phụ', 'side effect', 'phản ứng', 'mệt mỏi', 'phát ban', 'buồn nôn', 'đau'],
                reply: "⚠️ <strong>Tác dụng phụ thường gặp của Keytruda:</strong><br>• Mệt mỏi, thiếu năng lượng<br>• Phát ban da nhẹ, ngứa<br>• Buồn nôn, chán ăn<br>• Ho khan<br><br>🚨 <strong>Gặp bác sĩ NGAY nếu:</strong> khó thở, đau ngực, vàng da, tiêu chảy nặng.<br><br>Luôn báo cáo triệu chứng bất thường cho bác sĩ điều trị nhé!"
            },
            {
                keywords: ['webinar', 'hội thảo', 'sự kiện', 'event', 'đăng ký', 'tham gia'],
                reply: "📅 <strong>Sự kiện sắp tới:</strong><br>• <strong>Keytruda Patient Webinar</strong><br>  📍 Online • 18/4/2026 • 6:00 PM EST<br>  Chủ đề: Quản lý điều trị & chất lượng cuộc sống<br><br>👉 Click vào thẻ 'Register for Keytruda Patient Webinar' trên trang kết quả để đăng ký!"
            },
            {
                keywords: ['dinh dưỡng', 'ăn uống', 'chế độ ăn', 'nutrition', 'thực phẩm', 'diet'],
                reply: "🥗 <strong>Dinh dưỡng khi điều trị ung thư:</strong><br>• Ưu tiên protein nạc: cá, gà, đậu<br>• Tăng rau xanh đậm màu (broccoli, cải bó xôi)<br>• Tránh thực phẩm chế biến sẵn & đường tinh chế<br>• Uống đủ 2–2.5L nước/ngày<br><br>📖 Đọc thêm 'Cancer Patient Diet Guide' trên trang chủ nhé!"
            },
            {
                keywords: ['tìm kiếm', 'search', 'thuốc', 'drug', 'cancer', 'ung thư', 'điều trị'],
                reply: "🔍 Bạn có thể dùng <strong>thanh tìm kiếm</strong> ở trên cùng để tra cứu thông tin về thuốc, chương trình hỗ trợ, hoặc bài viết dinh dưỡng.<br><br>Ví dụ: gõ 'Keytruda', 'PAP program' hoặc 'immunotherapy' để xem kết quả!"
            }
        ],
        fallback: "Cảm ơn bạn đã hỏi! 🤖 Tôi chưa có câu trả lời chính xác cho điều này.<br><br>Bạn có thể:<br>• <strong>Upload đơn thuốc</strong> để được tư vấn cá nhân hóa<br>• <strong>Tìm kiếm</strong> trên thanh search phía trên<br>• Thử hỏi về: thuốc Keytruda, chương trình PAP, tác dụng phụ, hay dinh dưỡng 🙂"
    };

    function answerChat(msg) {
        const lower = msg.toLowerCase();
        for (const rule of chatKB.rules) {
            if (rule.keywords.some(k => lower.includes(k))) return rule.reply;
        }
        return chatKB.fallback;
    }

    // Inject chatbot HTML
    document.body.insertAdjacentHTML('beforeend', `
    <button id="chat-fab" title="Chat với MediNav AI">
      <span class="material-symbols-outlined">smart_toy</span>
      <span id="chat-badge"></span>
    </button>

    <div id="chat-window" class="chat-hidden">
      <div id="chat-header">
        <div class="chat-avatar">
          <span class="material-symbols-outlined">smart_toy</span>
        </div>
        <div class="chat-header-info">
          <span class="chat-name">MediNav AI</span>
          <span class="chat-status"><span class="dot"></span>Online</span>
        </div>
        <button id="chat-close" title="Đóng">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-suggestions">
        <button class="chat-chip" data-q="Làm sao để upload đơn thuốc?">📎 Upload file</button>
        <button class="chat-chip" data-q="Chương trình hỗ trợ Keytruda PAP">💊 PAP Program</button>
        <button class="chat-chip" data-q="Tác dụng phụ của Keytruda">⚠️ Tác dụng phụ</button>
      </div>
      <div id="chat-input-row">
        <button id="chat-upload-btn" title="Upload tài liệu y tế">
          <span class="material-symbols-outlined">add</span>
        </button>
        <input type="file" id="chat-file-input" accept="image/*,.pdf" style="display:none">
        <input type="text" id="chat-input" placeholder="Nhắn tin cho MediNav AI...">
        <button id="chat-send">
          <span class="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
    `);

    // Inject styles
    const chatStyle = document.createElement('style');
    chatStyle.textContent = `
      #chat-fab {
        position: fixed; bottom: 28px; right: 28px; z-index: 999;
        width: 60px; height: 60px; border-radius: 50%;
        background: linear-gradient(135deg, #1e40af, #2563eb);
        color: #fff; border: none; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 8px 32px rgba(37,99,235,0.45);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      #chat-fab:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(37,99,235,0.55); }
      #chat-fab .material-symbols-outlined { font-size: 28px; }
      #chat-badge {
        position: absolute; top: 6px; right: 6px;
        width: 12px; height: 12px; border-radius: 50%;
        background: #10b981; border: 2px solid #fff; display: none;
      }
      #chat-window {
        position: fixed; bottom: 100px; right: 28px; z-index: 998;
        width: 360px; max-height: 560px;
        background: #fff; border-radius: 24px;
        box-shadow: 0 20px 60px rgba(15,23,42,0.18);
        display: flex; flex-direction: column; overflow: hidden;
        border: 1px solid #e2e8f0;
        transition: opacity 0.25s, transform 0.25s;
      }
      #chat-window.chat-hidden { opacity: 0; transform: translateY(16px) scale(0.97); pointer-events: none; }
      #chat-header {
        background: linear-gradient(135deg, #1e3a8a, #2563eb);
        padding: 16px 20px; display: flex; align-items: center; gap: 12px;
      }
      .chat-avatar {
        width: 40px; height: 40px; border-radius: 50%;
        background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
        color: #fff; flex-shrink: 0;
      }
      .chat-avatar .material-symbols-outlined { font-size: 22px; }
      .chat-header-info { flex: 1; }
      .chat-name { display: block; font-weight: 700; color: #fff; font-size: 15px; }
      .chat-status { display: flex; align-items: center; gap: 5px; font-size: 11px; color: rgba(255,255,255,0.75); }
      .chat-status .dot { width: 7px; height: 7px; border-radius: 50%; background: #34d399; }
      #chat-close { background: rgba(255,255,255,0.15); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #fff; transition: background 0.15s; }
      #chat-close:hover { background: rgba(255,255,255,0.3); }
      #chat-close .material-symbols-outlined { font-size: 18px; }
      #chat-messages {
        flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
        background: #f8fafc; scroll-behavior: smooth;
      }
      #chat-messages::-webkit-scrollbar { width: 4px; }
      #chat-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      .chat-msg { display: flex; gap: 8px; max-width: 100%; animation: msgIn 0.2s ease; }
      @keyframes msgIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform:none; } }
      .chat-msg.user { flex-direction: row-reverse; }
      .chat-bubble {
        padding: 10px 14px; border-radius: 18px; font-size: 13.5px; line-height: 1.5;
        max-width: 82%; word-break: break-word;
      }
      .chat-msg.bot .chat-bubble { background: #fff; border: 1px solid #e2e8f0; color: #1e293b; border-bottom-left-radius: 4px; }
      .chat-msg.user .chat-bubble { background: #2563eb; color: #fff; border-bottom-right-radius: 4px; }
      .chat-mini-avatar { width: 28px; height: 28px; border-radius: 50%; background: #dbeafe; display:flex; align-items:center; justify-content:center; flex-shrink:0; align-self:flex-end; }
      .chat-mini-avatar .material-symbols-outlined { font-size:15px; color:#2563eb; }
      .chat-typing { display:flex; gap:4px; align-items:center; padding: 12px 14px; }
      .chat-typing span { width:7px; height:7px; border-radius:50%; background:#94a3b8; animation: bounce 1.2s infinite; }
      .chat-typing span:nth-child(2) { animation-delay:.2s; }
      .chat-typing span:nth-child(3) { animation-delay:.4s; }
      @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
      #chat-suggestions { padding: 8px 12px; display:flex; gap:6px; flex-wrap:wrap; background:#fff; border-top:1px solid #f1f5f9; }
      .chat-chip { padding: 5px 12px; border-radius: 20px; border: 1.5px solid #bfdbfe; background: #eff6ff; color: #1d4ed8; font-size: 11.5px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.15s, border-color 0.15s; }
      .chat-chip:hover { background:#dbeafe; border-color:#93c5fd; }
      #chat-input-row { display:flex; gap:8px; padding:12px 14px; background:#fff; border-top:1px solid #f1f5f9; align-items:center; }
      #chat-upload-btn {
        width: 38px; height: 38px; border-radius: 12px; border: 1.5px solid #e2e8f0;
        background: #f8fafc; cursor: pointer; display: flex; align-items: center; justify-content: center;
        color: #64748b; flex-shrink: 0; transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
      }
      #chat-upload-btn:hover { background: #eff6ff; border-color: #bfdbfe; color: #2563eb; transform: scale(1.08); }
      #chat-upload-btn:active { transform: scale(0.93); }
      #chat-upload-btn .material-symbols-outlined { font-size: 22px; font-weight: 600; }
      .chat-file-bubble {
        display: flex; align-items: center; gap: 10px;
        background: #eff6ff; border: 1.5px solid #bfdbfe;
        border-radius: 14px; padding: 10px 14px;
        max-width: 82%; font-size: 13px; color: #1e40af;
      }
      .chat-file-bubble .file-icon {
        width: 34px; height: 34px; border-radius: 8px; background: #2563eb;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .chat-file-bubble .file-icon .material-symbols-outlined { font-size: 18px; color: #fff; }
      .chat-file-bubble .file-info { flex: 1; overflow: hidden; }
      .chat-file-bubble .file-name { font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; display: block; }
      .chat-file-bubble .file-size { font-size: 11px; color: #64748b; margin-top: 1px; }
      .chat-img-bubble { max-width: 82%; border-radius: 14px; overflow: hidden; border: 1.5px solid #bfdbfe; }
      .chat-img-bubble img { width: 100%; max-height: 180px; object-fit: cover; display: block; }
      .chat-program-cards {
        display: flex; flex-direction: column; gap: 10px;
        padding: 0 0 4px 36px;
        animation: msgIn 0.25s ease;
      }
      .cpc-card {
        background: #fff; border: 1.5px solid #e2e8f0; border-radius: 16px;
        padding: 14px; display: flex; flex-direction: column; gap: 8px;
        box-shadow: 0 2px 10px rgba(15,23,42,0.06);
        animation: cardSlide 0.3s ease both;
        transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
      }
      .cpc-card:hover { box-shadow: 0 6px 20px rgba(15,23,42,0.12); border-color: #bfdbfe; transform: translateY(-1px); }
      @keyframes cardSlide { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      .cpc-top { display: flex; justify-content: space-between; align-items: center; }
      .cpc-tag { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; letter-spacing: 0.03em; }
      .cpc-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
      .cpc-title { font-size: 13px; font-weight: 700; color: #0f172a; line-height: 1.35; }
      .cpc-desc { font-size: 11.5px; color: #64748b; line-height: 1.5; }
      .cpc-cta {
        width: 100%; padding: 9px; border-radius: 10px; border: none; cursor: pointer;
        color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.01em;
        transition: background 0.15s, transform 0.1s; margin-top: 2px;
      }
      .cpc-cta:active { transform: scale(0.97); }
      #chat-input {
        flex:1; border: 1.5px solid #e2e8f0; border-radius: 12px;
        padding: 9px 14px; font-size: 13.5px; outline:none; color:#1e293b;
        transition: border-color 0.15s; font-family: inherit;
      }
      #chat-input:focus { border-color: #3b82f6; }
      #chat-send { width:38px; height:38px; border-radius:12px; background:#2563eb; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff; transition: background 0.15s, transform 0.1s; flex-shrink:0; }
      #chat-send:hover { background:#1d4ed8; }
      #chat-send:active { transform: scale(0.93); }
      #chat-send .material-symbols-outlined { font-size:18px; }
      @media (max-width: 480px) {
        #chat-window { width: calc(100vw - 32px); right: 16px; bottom: 88px; }
        #chat-fab { right: 16px; bottom: 20px; }
      }
    `;
    document.head.appendChild(chatStyle);

    // Chatbot DOM refs
    const fab = document.getElementById('chat-fab');
    const chatWin = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');
    const chatBadge = document.getElementById('chat-badge');
    const chips = document.querySelectorAll('.chat-chip');
    const chatUploadBtn = document.getElementById('chat-upload-btn');
    const chatFileInput = document.getElementById('chat-file-input');
    let chatOpened = false;

    function addMsg(html, type) {
        const isBot = type === 'bot';
        const div = document.createElement('div');
        div.className = `chat-msg ${type}`;
        div.innerHTML = isBot
            ? `<div class="chat-mini-avatar"><span class="material-symbols-outlined">smart_toy</span></div><div class="chat-bubble">${html}</div>`
            : `<div class="chat-bubble">${html}</div>`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTyping() {
        const t = document.createElement('div');
        t.id = 'typing-indicator';
        t.className = 'chat-msg bot';
        t.innerHTML = `<div class="chat-mini-avatar"><span class="material-symbols-outlined">smart_toy</span></div><div class="chat-bubble chat-typing"><span></span><span></span><span></span></div>`;
        chatMessages.appendChild(t);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById('typing-indicator');
        if (t) t.remove();
    }

    function sendMessage(text) {
        const msg = text || chatInput.value.trim();
        if (!msg) return;
        addMsg(msg, 'user');
        chatInput.value = '';
        document.getElementById('chat-suggestions').style.display = 'none';
        showTyping();
        setTimeout(() => {
            removeTyping();
            addMsg(answerChat(msg), 'bot');
        }, 700 + Math.random() * 400);
    }

    chatUploadBtn.addEventListener('click', () => chatFileInput.click());

    chatFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        chatFileInput.value = '';
        document.getElementById('chat-suggestions').style.display = 'none';

        const isImage = file.type.startsWith('image/');
        const sizeMB = (file.size / 1024 / 1024).toFixed(2);

        if (isImage) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const div = document.createElement('div');
                div.className = 'chat-msg user';
                div.innerHTML = `<div class="chat-img-bubble"><img src="${ev.target.result}" alt="${file.name}"></div>`;
                chatMessages.appendChild(div);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                triggerFileReply(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            const div = document.createElement('div');
            div.className = 'chat-msg user';
            div.innerHTML = `
              <div class="chat-file-bubble">
                <div class="file-icon"><span class="material-symbols-outlined">description</span></div>
                <div class="file-info">
                  <span class="file-name">${file.name}</span>
                  <span class="file-size">${sizeMB} MB • PDF</span>
                </div>
              </div>`;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            triggerFileReply(file.name);
        }
    });

    const programCards = [
        {
            tag: 'Most Relevant', tagColor: '#10b981', tagBg: '#ecfdf5',
            icon: 'volunteer_activism', iconBg: '#d1fae5', iconColor: '#059669',
            title: 'Keytruda PAP – Merck',
            desc: 'Hỗ trợ 100% chi phí thuốc cho bệnh nhân đủ điều kiện. Thu nhập ≤ 4× chuẩn nghèo liên bang.',
            cta: 'Kiểm tra điều kiện →', ctaBg: '#10b981', ctaHover: '#059669',
        },
        {
            tag: 'Financial Aid', tagColor: '#2563eb', tagBg: '#eff6ff',
            icon: 'payments', iconBg: '#dbeafe', iconColor: '#2563eb',
            title: 'CancerCare Co-Pay Assistance',
            desc: 'Hỗ trợ đồng thanh toán cho bệnh nhân ung thư phổi đang điều trị hóa trị hoặc miễn dịch.',
            cta: 'Đăng ký ngay →', ctaBg: '#2563eb', ctaHover: '#1d4ed8',
        },
        {
            tag: 'Webinar', tagColor: '#7c3aed', tagBg: '#f5f3ff',
            icon: 'live_tv', iconBg: '#ede9fe', iconColor: '#7c3aed',
            title: 'Keytruda Patient Webinar',
            desc: 'Online • 18/4/2026 • 6:00 PM EST. Hỏi đáp trực tiếp với chuyên gia ung thư.',
            cta: 'Đăng ký tham dự →', ctaBg: '#7c3aed', ctaHover: '#6d28d9',
        },
    ];

    function addProgramCards(filename) {
        const introDiv = document.createElement('div');
        introDiv.className = 'chat-msg bot';
        introDiv.innerHTML = `<div class="chat-mini-avatar"><span class="material-symbols-outlined">smart_toy</span></div><div class="chat-bubble">✅ Đã phân tích <strong>"${filename}"</strong> — phát hiện <strong>Keytruda (Pembrolizumab)</strong>.<br>Dưới đây là các chương trình hỗ trợ phù hợp với bạn:</div>`;
        chatMessages.appendChild(introDiv);

        const cardsDiv = document.createElement('div');
        cardsDiv.className = 'chat-program-cards';
        cardsDiv.innerHTML = programCards.map((p, i) => `
            <div class="cpc-card" style="animation-delay:${i * 0.1}s">
                <div class="cpc-top">
                    <span class="cpc-tag" style="color:${p.tagColor};background:${p.tagBg}">${p.tag}</span>
                    <div class="cpc-icon" style="background:${p.iconBg}">
                        <span class="material-symbols-outlined" style="color:${p.iconColor};font-size:18px">${p.icon}</span>
                    </div>
                </div>
                <div class="cpc-title">${p.title}</div>
                <div class="cpc-desc">${p.desc}</div>
                <button class="cpc-cta" style="background:${p.ctaBg}" onmouseover="this.style.background='${p.ctaHover}'" onmouseout="this.style.background='${p.ctaBg}'">${p.cta}</button>
            </div>
        `).join('');
        chatMessages.appendChild(cardsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function triggerFileReply(filename) {
        showTyping();
        setTimeout(() => {
            removeTyping();
            addProgramCards(filename);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1100);
}

    fab.addEventListener('click', () => {
        chatWin.classList.toggle('chat-hidden');
        if (!chatOpened) {
            chatOpened = true;
            chatBadge.style.display = 'none';
            setTimeout(() => addMsg(chatKB.greet, 'bot'), 200);
        }
    });

    chatClose.addEventListener('click', () => chatWin.classList.add('chat-hidden'));
    chatSend.addEventListener('click', () => sendMessage());
    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    chips.forEach(c => c.addEventListener('click', () => sendMessage(c.dataset.q)));

    // Notification badge after 3s
    setTimeout(() => { if (!chatOpened) chatBadge.style.display = 'block'; }, 3000);
});