MIRACLE-AR
 
Структура проекта

```bash
miracle-ar/
├── 📁 apps/                   # Приложения
│   ├── frontend/              # React + TypeScript приложение
│   └── backend/               # Spring Boot приложение
│       ├── src/
│       ├── .mvn/
│       ├── target/
│       ├── pom.xml
│       ├── mvnw
│       ├── mvnw.cmd
│       └── Dockerfile
├── 📁 infrastructure/         # Инфраструктура
│   └── docker-compose.yml
├── 📁 storage/               # Файловое хранилище
│   ├── models/              # 3D модели
│   ├── markers/             # QR-коды/маркеры
│   └── previews/            # Превью изображения
├── .gitignore
├── .gitattributes
├── .drone.yaml
├── README.md
└── LICENSE
```