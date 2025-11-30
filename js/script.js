document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Thème ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') { body.classList.add('dark-mode'); themeIcon.textContent = '☀'; }
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeIcon.textContent = isDark ? '☀' : '☾';
    });

    // --- 2. Horloge (AVEC SECONDES) ---
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        document.getElementById('date').textContent = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        
        // Ajout des secondes en petit via un span
        const clockEl = document.getElementById('time');
        clockEl.innerHTML = `${timeString}<span class="clock-seconds">${seconds}</span>`;
    }
    setInterval(updateTime, 1000); updateTime();

    // --- 3. Météo ---
    function getWeather() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                document.getElementById('temp').textContent = `${Math.round(data.current_weather.temperature)}°C`;
                document.getElementById('city').textContent = "Ma Position";
            } catch (e) { document.getElementById('city').textContent = "Météo indisponible"; }
        }, () => { document.getElementById('city').textContent = "Localisation refusée"; });
    }
    getWeather();

    // --- 4. Calendrier ---
    function renderCalendar() {
        const cal = document.getElementById('calendar-widget');
        const d = new Date();
        const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        const startOffset = new Date(d.getFullYear(), d.getMonth(), 1).getDay() || 7; 
        cal.innerHTML = '';
        for (let i = 1; i < startOffset; i++) cal.appendChild(document.createElement('div'));
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.textContent = i;
            day.className = 'cal-day' + (i === d.getDate() ? ' cal-today' : '');
            cal.appendChild(day);
        }
    }
    renderCalendar();

    // --- 5. To-Do List (MENU CIRCULAIRE) ---
    const todoInput = document.getElementById('todo-input');
    const todoTime = document.getElementById('todo-time');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // Variables du Menu
    const emojiTrigger = document.getElementById('emoji-trigger');
    const circularMenu = document.getElementById('circular-menu');
    const emojis = ['📝', '💻', '🏃', '🛒', '📞', '🎓', '🏠', '⭐', '🔥'];

    // Construction du cercle d'émojis
    const radius = 75; 
    const center = 100; // moitié de 200px

    emojis.forEach((emoji, index) => {
        const btn = document.createElement('button');
        btn.className = 'emoji-option';
        btn.textContent = emoji;
        
        // Calcul position
        const angle = (index * (360 / emojis.length)) * (Math.PI / 180); 
        const x = center + radius * Math.cos(angle) - 20; 
        const y = center + radius * Math.sin(angle) - 20;

        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;

        btn.onclick = (e) => {
            e.stopPropagation();
            emojiTrigger.textContent = emoji;
            circularMenu.classList.remove('active');
        };
        circularMenu.appendChild(btn);
    });

    emojiTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        circularMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        circularMenu.classList.remove('active');
    });

    // Gestion des Tâches
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveTodos() { localStorage.setItem('todos', JSON.stringify(todos)); renderTodos(); }
    
    function updateProgress() {
        const total = todos.length;
        if (total === 0) { progressFill.style.width = '0%'; progressText.textContent = '0%'; return; }
        const comp = todos.filter(t => t.completed).length;
        const pct = Math.round((comp / total) * 100);
        progressFill.style.width = `${pct}%`; progressText.textContent = `${pct}%`;
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox'; checkbox.checked = todo.completed;
            checkbox.onclick = () => { todos[index].completed = !todos[index].completed; saveTodos(); };

            const contentDiv = document.createElement('div');
            contentDiv.className = 'content-div';
            
            const em = document.createElement('span'); em.textContent = todo.emoji || '📝'; em.className = 'todo-emoji-span';
            const txt = document.createElement('span'); txt.textContent = todo.text; txt.className = 'todo-text';
            
            contentDiv.appendChild(em);
            contentDiv.appendChild(txt);
            
            if (todo.time) {
                const tm = document.createElement('span'); tm.textContent = todo.time; tm.className = 'todo-time-tag';
                contentDiv.insertBefore(tm, txt);
            }

            const del = document.createElement('button'); del.innerHTML = '&times;'; del.className = 'delete-btn';
            del.onclick = () => { todos.splice(index, 1); saveTodos(); };

            li.append(checkbox, contentDiv, del);
            todoList.appendChild(li);
        });
        updateProgress();
    }

    addBtn.addEventListener('click', () => {
        if (!todoInput.value.trim()) return;
        todos.push({ 
            text: todoInput.value, 
            completed: false, 
            emoji: emojiTrigger.textContent, 
            time: todoTime.value 
        });
        todoInput.value = ''; todoTime.value = ''; saveTodos();
    });
    
    todoInput.addEventListener('keypress', (e) => e.key === 'Enter' && addBtn.click());
    todoTime.addEventListener('keypress', (e) => e.key === 'Enter' && addBtn.click());

    renderTodos();

    // --- 6. Notes & PDF ---
    const notepad = document.getElementById('notepad-area');
    notepad.innerHTML = localStorage.getItem('notepad-content') || 'Commencez à écrire...';
    
    notepad.addEventListener('input', () => localStorage.setItem('notepad-content', notepad.innerHTML));
    
    function formatDoc(cmd, value = null) {
        document.execCommand(cmd, false, value);
        notepad.focus();
    }

    // Utilisation de mousedown pour ne pas perdre le focus
    document.getElementById('btn-bold').addEventListener('mousedown', (e) => {
        e.preventDefault(); formatDoc('bold');
    });
    document.getElementById('btn-italic').addEventListener('mousedown', (e) => {
        e.preventDefault(); formatDoc('italic');
    });

    document.getElementById('foreColor').addEventListener('input', (e) => formatDoc('foreColor', e.target.value));
    document.getElementById('fontSize').addEventListener('change', (e) => formatDoc('fontSize', e.target.value));

    // --- EXPORT PDF  --- (v2 post correction)
    document.getElementById('export-pdf').addEventListener('click', () => {
        const element = document.getElementById('notepad-area');
        
        if (typeof html2pdf === 'undefined') {
            alert("Erreur: Librairie PDF non trouvée.");
            return;
        }

        // 1. Création d'un conteneur temporaire (invisible à l'écran)
        // Cela permet de styliser le PDF sans changer ton écran actuel
        const pdfContainer = document.createElement('div');

        // 2. Styles forcés pour le PDF (Fond BLANC, Texte NOIR, Police propre)
        pdfContainer.style.cssText = `
            background-color: #ffffff;
            color: #111111;
            font-family: 'Inter', sans-serif;
            padding: 40px;
            font-size: 12pt;
            line-height: 1.6;
            width: 100%;
        `;

        // 3. Création d'un en-tête esthétique (Titre + Date)
        const title = document.createElement('h1');
        title.textContent = "Mes Notes - Focus Tab";
        title.style.cssText = "text-align: center; color: #333; font-size: 24px; margin-bottom: 5px; font-weight: 800;";

        const dateLine = document.createElement('div');
        const date = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        dateLine.textContent = `Exporté le ${date}`;
        dateLine.style.cssText = "text-align: center; color: #777; font-size: 10pt; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px;";

        // 4. Clonage du contenu de tes notes
        const content = document.createElement('div');
        content.innerHTML = element.innerHTML;
        
        // Assemblage final dans le conteneur temporaire
        pdfContainer.appendChild(title);
        pdfContainer.appendChild(dateLine);
        pdfContainer.appendChild(content);

        // 5. Configuration pour une haute qualité
        const opt = {
            margin:       [10, 10, 10, 10], // Marges (Haut, Gauche, Bas, Droite)
            filename:     `mes-notes-${new Date().toISOString().slice(0,10)}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, letterRendering: true }, 
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // 6. Génération et sauvegarde
        html2pdf().set(opt).from(pdfContainer).save();
    });
});
