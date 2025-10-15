document.addEventListener('DOMContentLoaded', () => {
    const modelsGallery = document.getElementById('models-gallery');
    const adminBtn = document.getElementById('admin-btn');

    // Загрузка всех данных для галереи
    async function loadGallery() {
        try {
            modelsGallery.innerHTML = '<div class="loading">Loading models...</div>';

            const [modelsResponse, imagesResponse, descriptionsResponse, patternsResponse] = await Promise.all([
                fetch('/api/models'),
                fetch('/api/models/images'),
                fetch('/api/models/descriptions'),
                fetch('/api/models/patterns')
            ]);

            const models = await modelsResponse.json();
            const images = await imagesResponse.json();
            const descriptions = await descriptionsResponse.json();
            const patterns = await patternsResponse.json();

            // Загружаем содержимое описаний
            const descriptionsContent = await Promise.all(
                descriptions.map(async desc => {
                    try {
                        const response = await fetch(`/api/models/description/${desc}`);
                        return {
                            filename: desc,
                            content: await response.text()
                        };
                    } catch (error) {
                        return {
                            filename: desc,
                            content: 'Описание недоступно'
                        };
                    }
                })
            );

            renderGallery(models, images, descriptionsContent, patterns);
        } catch (error) {
            modelsGallery.innerHTML = `<div class="error">Error loading gallery: ${error.message}</div>`;
        }
    }

    // Отображение галереи
    function renderGallery(models, images, descriptions, patterns) {
        modelsGallery.innerHTML = models.length ? '' : '<div class="no-models">No models available</div>';

        models.forEach(model => {
            const modelName = model.replace('.glb', '');
            const image = images.find(img => img.replace(/\.[^/.]+$/, "") === modelName);
            const description = descriptions.find(desc => desc.filename.replace('.txt', '') === modelName);
            const pattern = patterns.find(patt => patt.replace('.patt', '') === modelName);

            const card = document.createElement('div');
            card.className = 'model-card';
            card.innerHTML = `
                <div class="image-container">
                    ${image ? `<img src="/api/files/images/${image}" alt="${modelName}" class="model-image" onload="handleImageLoad(this)">` :
                '<div class="no-image">Картинка отсутствует</div>'}
                </div>
                <div class="model-content">
                    <h3 class="model-title">${modelName}</h3>
                    ${description ? `<p class="model-description">${description.content}</p>` :
                '<p class="no-description">Описание отсутствует</p>'}
                    ${pattern ? `<p class="pattern-info"></p>` :
                '<p class="pattern-warning">⚠ Паттерн отсутствует</p>'}
                    <button class="view-btn" data-model="${model}">Просмотр в AR</button>
                </div>
            `;

            modelsGallery.appendChild(card);
        });

        // Добавляем обработчики для кнопок
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => selectModel(btn.dataset.model));
        });
    }

    // Функция для обработки загрузки изображений
    window.handleImageLoad = function(img) {
        const container = img.closest('.image-container');
        const aspectRatio = img.naturalWidth / img.naturalHeight;

        if (aspectRatio > 1.5) {
            // Широкая картинка - показываем по ширине
            img.style.width = '100%';
            img.style.height = 'auto';
        } else {
            // Высокая картинка - показываем по высоте
            img.style.width = 'auto';
            img.style.height = '100%';
        }
    };

    // Выбор модели для просмотра
    async function selectModel(model) {
        try {
            const response = await fetch('/api/models/set-current', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `model=${encodeURIComponent(model)}`
            });

            if (response.ok) {
                window.location.href = '/ar-view';
            } else {
                throw new Error('Failed to select model');
            }
        } catch (error) {
            alert(error.message);
        }
    }

    // Переход в админ-панель
    adminBtn.addEventListener('click', () => {
        const password = prompt("Введите пароль администратора:");
        if (password) {
            window.location.href = `/admin?password=${encodeURIComponent(password)}`;
        }
    });

    // Инициализация
    loadGallery();
});