document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const modelTab = document.getElementById('models-tab');
    const soundsTab = document.getElementById('sounds-tab');
    const imagesTab = document.getElementById('images-tab');
    const descriptionsTab = document.getElementById('descriptions-tab');
    const patternsTab = document.getElementById('patterns-tab');

    const modelsSection = document.getElementById('models-section');
    const soundsSection = document.getElementById('sounds-section');
    const imagesSection = document.getElementById('images-section');
    const descriptionsSection = document.getElementById('descriptions-section');
    const patternsSection = document.getElementById('patterns-section');

    const modelList = document.getElementById('model-list');
    const soundList = document.getElementById('sound-list');
    const imageList = document.getElementById('image-list');
    const descriptionList = document.getElementById('description-list');
    const patternList = document.getElementById('pattern-list');

    // Формы загрузки
    const uploadModelForm = document.getElementById('upload-model-form');
    const modelFileInput = document.getElementById('model-file');
    const modelUploadStatus = document.getElementById('model-upload-status');

    const uploadSoundForm = document.getElementById('upload-sound-form');
    const soundFileInput = document.getElementById('sound-file');
    const soundUploadStatus = document.getElementById('sound-upload-status');

    const uploadImageForm = document.getElementById('upload-image-form');
    const imageFileInput = document.getElementById('image-file');
    const imageUploadStatus = document.getElementById('image-upload-status');

    const uploadDescriptionForm = document.getElementById('upload-description-form');
    const descriptionFileInput = document.getElementById('description-file');
    const descriptionUploadStatus = document.getElementById('description-upload-status');

    const uploadPatternForm = document.getElementById('upload-pattern-form');
    const patternFileInput = document.getElementById('pattern-file');
    const patternUploadStatus = document.getElementById('pattern-upload-status');

    // Переключение между вкладками
    function switchTab(selectedTab) {
        [modelTab, soundsTab, imagesTab, descriptionsTab, patternsTab].forEach(tab => {
            tab.classList.toggle('active', tab.id === selectedTab + '-tab');
        });

        [modelsSection, soundsSection, imagesSection, descriptionsSection, patternsSection].forEach(section => {
            section.style.display = section.id === selectedTab + '-section' ? 'block' : 'none';
        });

        if (selectedTab === 'sounds') loadSounds();
        else if (selectedTab === 'images') loadImages();
        else if (selectedTab === 'descriptions') loadDescriptions();
        else if (selectedTab === 'patterns') loadPatterns();
    }

    modelTab.addEventListener('click', () => switchTab('models'));
    soundsTab.addEventListener('click', () => switchTab('sounds'));
    imagesTab.addEventListener('click', () => switchTab('images'));
    descriptionsTab.addEventListener('click', () => switchTab('descriptions'));
    patternsTab.addEventListener('click', () => switchTab('patterns'));

    // Загрузка всех данных
    async function loadAllData() {
        try {
            const [modelsResponse, soundsResponse, imagesResponse, descriptionsResponse, patternsResponse] = await Promise.all([
                fetch('/api/models'),
                fetch('/api/models/sounds'),
                fetch('/api/models/images'),
                fetch('/api/models/descriptions'),
                fetch('/api/models/patterns')
            ]);

            const models = await modelsResponse.json();
            const sounds = await soundsResponse.json();
            const images = await imagesResponse.json();
            const descriptions = await descriptionsResponse.json();
            const patterns = await patternsResponse.json();

            renderModels(models);
            renderSounds(sounds);
            renderImages(images);
            renderDescriptions(descriptions);
            renderPatterns(patterns);
        } catch (error) {
            console.error('Error loading data:', error);
            showError(error.message);
        }
    }

    // Отображение моделей
    function renderModels(models) {
        modelList.innerHTML = models && models.length ? '' : '<div class="no-items">No models found</div>';
        if (models && models.length) {
            models.forEach(model => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <div class="file-name">${model}</div>
                    <div class="file-actions">
                        <button class="download-btn" data-type="model" data-name="${model}">Скачать</button>
                        <button class="delete-btn" data-type="model" data-name="${model}">Удалить</button>
                    </div>
                `;
                modelList.appendChild(item);
            });
        }
    }

    // Отображение звуков
    function renderSounds(sounds) {
        soundList.innerHTML = sounds && sounds.length ? '' : '<div class="no-items">No sounds found</div>';
        if (sounds && sounds.length) {
            sounds.forEach(sound => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <div class="file-name">${sound}</div>
                    <div class="file-actions">
                        <button class="play-btn" data-src="/api/files/sounds/${sound}">Проиграть</button>
                        <button class="download-btn" data-type="sound" data-name="${sound}">Скачать</button>
                        <button class="delete-btn" data-type="sound" data-name="${sound}">Удалить</button>
                    </div>
                `;
                soundList.appendChild(item);
            });
        }
    }

    // Отображение изображений
    function renderImages(images) {
        imageList.innerHTML = images && images.length ? '' : '<div class="no-items">No images found</div>';
        if (images && images.length) {
            images.forEach(image => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <div class="file-name">${image}</div>
                    <div class="file-actions">
                        <img src="/api/files/images/${image}" alt="${image}" class="file-preview" style="width: 50px; height: 50px; object-fit: cover;">
                        <button class="download-btn" data-type="image" data-name="${image}">Скачать</button>
                        <button class="delete-btn" data-type="image" data-name="${image}">Удалить</button>
                    </div>
                `;
                imageList.appendChild(item);
            });
        }
    }

    // Отображение описаний
    async function renderDescriptions(descriptions) {
        descriptionList.innerHTML = descriptions && descriptions.length ? '' : '<div class="no-items">No descriptions found</div>';
        if (descriptions && descriptions.length) {
            for (const desc of descriptions) {
                try {
                    const response = await fetch(`/api/models/description/${desc}`);
                    const content = await response.text();
                    const preview = content.length > 100 ? content.substring(0, 100) + '...' : content;

                    const item = document.createElement('div');
                    item.className = 'file-item';
                    item.innerHTML = `
                        <div class="file-name">${desc}</div>
                        <div class="file-content">${preview}</div>
                        <div class="file-actions">
                            <button class="download-btn" data-type="description" data-name="${desc}">Скачать</button>
                            <button class="delete-btn" data-type="description" data-name="${desc}">Удалить</button>
                        </div>
                    `;
                    descriptionList.appendChild(item);
                } catch (error) {
                    console.error('Error loading description:', error);
                }
            }
        }
    }

    // Отображение паттернов
    function renderPatterns(patterns) {
        patternList.innerHTML = patterns && patterns.length ? '' : '<div class="no-items">No patterns found</div>';
        if (patterns && patterns.length) {
            patterns.forEach(pattern => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <div class="file-name">${pattern}</div>
                    <div class="file-actions">
                        <button class="download-btn" data-type="pattern" data-name="${pattern}">Скачать</button>
                        <button class="delete-btn" data-type="pattern" data-name="${pattern}">Удалить</button>
                    </div>
                `;
                patternList.appendChild(item);
            });
        }
    }

    // Обработка кликов
    document.addEventListener('click', async (e) => {
        // Удаление файлов
        if (e.target.classList.contains('delete-btn')) {
            const type = e.target.dataset.type;
            const name = e.target.dataset.name;

            if (confirm(`Удалить ${type} "${name}"?`)) {
                try {
                    let endpoint;
                    switch (type) {
                        case 'model': endpoint = `/api/models/${encodeURIComponent(name)}`; break;
                        case 'sound': endpoint = `/api/models/sound/${encodeURIComponent(name)}`; break;
                        case 'image': endpoint = `/api/models/image/${encodeURIComponent(name)}`; break;
                        case 'description': endpoint = `/api/models/description/${encodeURIComponent(name)}`; break;
                        case 'pattern': endpoint = `/api/models/pattern/${encodeURIComponent(name)}`; break;
                        default: throw new Error('Unknown file type');
                    }

                    const response = await fetch(endpoint, { method: 'DELETE' });
                    if (response.ok) {
                        loadAllData();
                    } else {
                        throw new Error(await response.text());
                    }
                } catch (error) {
                    alert(`Delete failed: ${error.message}`);
                }
            }
        }

        // Проигрывание звуков
        if (e.target.classList.contains('play-btn')) {
            const audio = new Audio(e.target.dataset.src);
            audio.play().catch(e => console.error("Playback failed:", e));
        }

        // Скачивание файлов
        if (e.target.classList.contains('download-btn')) {
            const type = e.target.dataset.type;
            const name = e.target.dataset.name;

            try {
                let endpoint;
                switch (type) {
                    case 'model': endpoint = `/api/files/models/${encodeURIComponent(name)}`; break;
                    case 'sound': endpoint = `/api/files/sounds/${encodeURIComponent(name)}`; break;
                    case 'image': endpoint = `/api/files/images/${encodeURIComponent(name)}`; break;
                    case 'description': endpoint = `/api/files/descriptions/${encodeURIComponent(name)}`; break;
                    case 'pattern': endpoint = `/api/files/patterns/${encodeURIComponent(name)}`; break;
                    default: throw new Error('Unknown file type');
                }

                const link = document.createElement('a');
                link.href = endpoint;
                link.download = name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                alert(`Download failed: ${error.message}`);
            }
        }
    });

    // Обработка загрузки файлов
    uploadModelForm.addEventListener('submit', (e) => handleFileUpload(e, modelFileInput, modelUploadStatus, 'model', ['.glb']));
    uploadSoundForm.addEventListener('submit', (e) => handleFileUpload(e, soundFileInput, soundUploadStatus, 'sound', ['.mp3']));
    uploadImageForm.addEventListener('submit', (e) => handleFileUpload(e, imageFileInput, imageUploadStatus, 'image', ['.png', '.jpg', '.jpeg']));
    uploadDescriptionForm.addEventListener('submit', (e) => handleFileUpload(e, descriptionFileInput, descriptionUploadStatus, 'description', ['.txt']));
    uploadPatternForm.addEventListener('submit', (e) => handleFileUpload(e, patternFileInput, patternUploadStatus, 'pattern', ['.patt']));

    async function handleFileUpload(e, input, statusElement, type, allowedExtensions) {
        e.preventDefault();

        if (!input.files?.length) {
            showStatus('Please select a file first', 'error', statusElement);
            return;
        }

        const file = input.files[0];
        const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            showStatus(`Only ${allowedExtensions.join(', ')} files are allowed`, 'error', statusElement);
            return;
        }

        try {
            showStatus('Uploading...', 'info', statusElement);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);

            const response = await fetch('/api/files/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(await response.text());

            showStatus('Загрузка прошла успешно!', 'success', statusElement);
            input.value = '';
            loadAllData();
        } catch (error) {
            showStatus(`Ошибка загрузки: ${error.message}`, 'error', statusElement);
        }
    }

    // Вспомогательные функции
    function showStatus(message, type, element) {
        element.innerHTML = `<div class="${type}">${message}</div>`;
        if (type === 'error') console.error(message);
    }

    function showError(message) {
        const errorHtml = `<div class="error">${message}</div>`;
        [modelList, soundList, imageList, descriptionList, patternList].forEach(list => {
            if (list) list.innerHTML = errorHtml;
        });
    }

    // Инициализация
    switchTab('models');
    loadAllData();
});