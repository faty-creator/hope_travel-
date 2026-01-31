# Hope Travel - Modern Travel Agency

A modern travel agency website built with React, Vite, and Supabase.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/M-Abdelkabir/Hope_Travel2.git
   ```

## 🛠️ Local Development & Automation

### Using the `local.bat` Script (Windows Only)

The project includes a `local.bat` script designed to automate the local development setup.

**What `local.bat` does:**
- **Checks for Dependencies:** It automatically detects if the `node_modules` folder is missing and runs `npm install` for you.
- **Starts the Server:** It launches the Vite development server using `npm run dev`.
- **Automatic Browser Opening:** It automatically opens your default web browser to the local application URL (usually `http://localhost:3000`).
- **One-Click Execution:** You can simply double-click the file to skip manual terminal commands.

**How to use it:**
1. Navigate to the project folder.
2. Double-click `local.bat`.
3. Wait for the browser to open automatically.

### Manual Startup

If you prefer using the terminal:
```bash
npm install
npm run dev
```

---

## 🔑 Environment Variables Guide

The following variables must be configured in your `.env` file (locally) and in Netlify (production).

### 1. Supabase Configuration
Used for database management and authentication.

| Variable | Description | How to get it |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Your Project URL | Go to **Supabase Dashboard > Project Settings > API**. |
| `VITE_SUPABASE_ANON_KEY` | Your Anonymous Key | Go to **Supabase Dashboard > Project Settings > API > `anon` `public` key**. |

### 2. EmailJS Configuration
Used for sending reservation emails to both the admin and the customer.

| Variable | Description | How to get it |
| :--- | :--- | :--- |
| `VITE_EMAILJS_SERVICE_ID` | Email Service ID | **EmailJS Dashboard > Email Services**. (e.g., `service_xxxxxx`) |
| `VITE_EMAILJS_ADMIN_TEMPLATE_ID` | Admin Notification Template | **EmailJS Dashboard > Email Templates**. Create a template for admin alerts. |
| `VITE_EMAILJS_USER_TEMPLATE_ID` | User Confirmation Template | **EmailJS Dashboard > Email Templates**. Create a template for customer confirmation. |
| `VITE_EMAILJS_PUBLIC_KEY` | Account Public Key | **EmailJS Dashboard > Account > API Keys > Public Key**. |

> [!IMPORTANT]
> Ensure all variables in your `.env` file start with the `VITE_` prefix, otherwise Vite will not load them into the application.

---

## 🌐 Deployment on Netlify

### Automated Deployment

1. Push your code to a GitHub repository.
2. Connect your repository to Netlify.
3. Netlify will use the `netlify.toml` configuration:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. **Crucial:** Add all variables from the [Environment Variables Guide](#-environment-variables-guide) in **Site settings > Build & deploy > Environment variables**.

### Manual Deployment (CLI)

```bash
npm install -g netlify-cli
ntl deploy --prod
```

## 📄 License

This project is private and for internal use only.
