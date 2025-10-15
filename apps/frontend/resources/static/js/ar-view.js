document.addEventListener('DOMContentLoaded', () => {
    console.log('AR View initialized');

    const audioElement = new Audio();
    let audioPlaying = false;
    let currentSoundUrl = '';

    // Регистрируем компонент для управления звуком
    AFRAME.registerComponent('sound-handler', {
        init: function() {
            console.log('Sound handler initialized');
        },

        tick: function() {
            const marker = document.querySelector('a-marker');
            if (!marker) return;

            const markerVisible = marker.object3D.visible;

            if (markerVisible) {
                if (!audioPlaying && currentSoundUrl) {
                    console.log('Playing audio');
                    audioElement.play().catch(e => {
                        console.error('Playback failed:', e);
                    });
                }
            } else {
                if (audioPlaying) {
                    console.log('Pausing audio');
                    audioElement.pause();
                }
            }
        }
    });

    // Загрузка модели, звука и паттерна
    function loadModelSoundAndPattern() {
        Promise.all([
            fetch('/api/models/current'),
            fetch('/api/models/current-pattern')
        ])
            .then(([modelResponse, patternResponse]) => {
                if (!modelResponse.ok) throw new Error('Failed to load model');
                if (!patternResponse.ok) throw new Error('Failed to load pattern');

                return Promise.all([modelResponse.text(), patternResponse.text()]);
            })
            .then(([modelName, patternName]) => {
                if (!modelName) {
                    throw new Error('No model selected');
                }

                console.log('Loading model:', modelName);
                console.log('Loading pattern:', patternName);

                // Устанавливаем источник модели
                const asset = document.getElementById('current-model');
                asset.setAttribute('src', `/api/files/models/${modelName}`);

                // Устанавливаем паттерн
                const marker = document.querySelector('a-marker');
                if (patternName && patternName !== 'null' && patternName !== '') {
                    marker.setAttribute('url', `/api/files/patterns/${patternName}`);
                    console.log('Pattern URL set to:', `/api/files/patterns/${patternName}`);
                } else {
                    console.warn('No pattern available for model:', modelName);
                    // Можно использовать дефолтный паттерн или показать сообщение
                }

                // Загружаем звук
                const soundName = modelName.replace('.glb', '.mp3');
                currentSoundUrl = `/api/files/sounds/${soundName}`;
                console.log('Loading sound from:', currentSoundUrl);

                audioElement.src = currentSoundUrl + '?t=' + new Date().getTime();
                audioElement.load();

                // Проверяем загрузку звука
                audioElement.addEventListener('canplaythrough', () => {
                    console.log('Sound is ready to play');
                });

                audioElement.addEventListener('error', (e) => {
                    console.error('Audio error:', audioElement.error);
                });

                // Обновляем модель в A-Frame
                const entity = document.getElementById('model-entity');
                entity.removeAttribute('gltf-model');

                setTimeout(() => {
                    entity.setAttribute('gltf-model', '#current-model');
                    console.log('Model entity updated');
                }, 100);
            })
            .catch(error => {
                console.error('Error loading model:', error);
                alert(`Error: ${error.message}. Returning to menu.`);
                setTimeout(() => {
                    window.location.href = '/menu';
                }, 3000);
            });
    }

    // Проверяем наличие необходимых элементов
    const requiredElements = ['current-model', 'model-entity'];
    let allElementsPresent = true;

    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`Element with id ${id} not found`);
            allElementsPresent = false;
        }
    });

    if (!allElementsPresent) {
        alert('System error: Required elements missing. Check console for details.');
        return;
    }

    // Загружаем модель, звук и паттерн
    loadModelSoundAndPattern();
});