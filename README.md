# Node-React Automation Challenge

![CI](https://github.com/Zulqarnainhayder/node-react-automation-challange/actions/workflows/ci.yml/badge.svg)

## 🚀 Project Overview
This project is a **full-stack web application** featuring a modern React frontend and a robust Node.js (Express, PostgreSQL) backend, designed with best practices for code quality, maintainability, and **comprehensive automated testing**.

- **Frontend:** React, modular UI components, responsive and accessible
- **Backend:** Node.js, Express, PostgreSQL, JWT authentication
- **Testing:** Cypress (UI/E2E), Jest + Supertest (API)
- **DevOps:** Docker Compose for seamless multi-service orchestration

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+
- npm or yarn

## 🐳 Quick Start with Docker Compose

### 1. Build & Run Everything
```sh
docker compose up --build
```
- Launches backend, frontend, and database in isolated containers
- Hot reload for local development

### 2. Access the App
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **PgAdmin:** [http://localhost:5050](http://localhost:5050) (email: admin@admin.com, password: admin)

## 🏗️ Project Structure

```
├── backend/           # Node.js + Express API
│   ├── src/
│   └── package.json
├── frontend/          # React frontend
│   ├── public/
│   ├── src/
│   └── package.json
├── tests/             # Test suites
│   ├── api/           # Backend API tests
│   └── e2e/           # Cypress UI tests
├── docker-compose.yml # Docker setup
└── README.md          # This file
```

## 🤖 CI/CD & Automated Quality

This project uses **GitHub Actions** and **Docker Compose** for professional, automated CI/CD:
- Every push or pull request automatically triggers a workflow that:
  - Builds the full stack (backend, frontend, database) with Docker Compose
  - Waits for all services to be healthy
  - Installs and runs all backend API tests (Jest + Supertest)
  - Installs and runs all frontend UI tests (Cypress)
  - Shuts down all containers after testing
- See `.github/workflows/ci.yml` for full workflow details.
- Status badge above shows live results for every commit/PR.

## 🧪 Automated Testing Suite

### 1. **Backend API Tests** (Jest + Supertest)
- Location: `tests/api/`
- Covers: Authentication, token validation, CRUD, security, error handling
- Run:
  ```sh
  cd tests
  npm run test:api
  ```

### 2. **Frontend UI Tests** (Cypress)
- Location: `tests/e2e/`
- Covers: Login/logout, CRUD UI, form validation, user flows
- Run:
  ```sh
  cd tests
  npm run test:ui
  ```

### 3. **Run All Tests Together**
- From `tests` directory:
  ```sh
  npm run test:all
  ```
- Runs backend API and Cypress UI tests sequentially

### 4. **Test Data & Fixtures**
- Consistent test users and items seeded automatically
- Custom Cypress commands for clean, readable tests
- Test reports and screenshots available in `tests/cypress/` after test runs

## 🏆 Key Features & Best Practices

- **Reusable UI Components:** Button, Input, Textarea, Message, Card (with modular CSS)
- **Full CRUD:** Create, read, update, delete items from UI and API
- **Robust Validation:** Both frontend and backend validation with clear error messages
- **Authentication:** Secure login, JWT-based session, protected routes
- **Edge Case Handling:** Negative tests, security checks, error boundaries
- **Clean Code:** Separation of concerns, maintainable structure, modern patterns
- **CI Ready:** Test suite can be easily integrated with GitHub Actions or any CI

## 🔧 Troubleshooting

### Common Issues
- **Port conflicts**: Ensure ports 3000, 4000, 5432, 5050 are free
- **Database issues**: Run `docker compose down -v` to reset volumes
- **Test failures**: Check logs in `tests/cypress/videos/` and `tests/cypress/screenshots/`
- **Environment variables**: Ensure `.env` files are properly configured

### Reset Everything
```sh
docker compose down -v  # Remove containers and volumes
rm -rf node_modules    # Remove node modules
npm install            # Reinstall dependencies
```

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📄 Author & Contact

- **Zulqarnain Hayder**
- [GitHub Profile](https://github.com/Zulqarnainhayder)
- [Project Repository](https://github.com/Zulqarnainhayder/node-react-automation-challange)

---

⭐️ From [Zulqarnain Hayder](https://github.com/Zulqarnainhayder)

> **This project demonstrates advanced automation skills, code quality, and a professional approach to full-stack web development and testing.**