# 🩺 DocOPD - Doctor OPD Ticket & Digital Prescription Android App

[![Build Android APK](https://github.com/Doctor/DocOPD/actions/workflows/build-apk.yml/badge.svg)](https://github.com/Doctor/DocOPD/actions/workflows/build-apk.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-teal.svg)](https://github.com/Doctor/DocOPD/releases)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20PWA-0284C7.svg)](#)

A complete Android application built for doctors and medical clinics to configure custom clinic profiles, create comprehensive digital OPD tickets & prescriptions, generate printable PDF slips, and send them directly to patients via WhatsApp.

---

## 🌟 Key Features

1. **👨‍⚕️ Doctor Profile & Clinic Branding**:
   - Custom Doctor Name, Qualifications/Degrees, Medical Council Registration Number, Specialty.
   - Clinic/Hospital Name, Address, Contact/WhatsApp Phone, Email, Timings, Consultation Fee, and Disclaimer note.
2. **🎫 Complete Clinical Sections**:
   - Patient Info (Name, Age, Gender, Phone, UHID, OPD Token No, Date & Time).
   - Vitals & Health Metrics (BP, Pulse, Temperature, SpO2, Weight, Height, **Auto-calculated BMI**, Blood Sugar).
   - Chief Complaints & Symptoms with 1-tap quick chips + custom inputs.
   - Provisional Diagnosis & ICD/Common conditions picker.
   - Diagnostic & Lab Tests library (CBC, Sugar, HbA1c, Lipid, LFT, KFT, Thyroid, X-Ray, ECG, USG, etc.) with custom instructions (e.g. *12h Fasting*).
   - Rx Medications with auto-suggestions, dosage/frequency (1-0-1, SOS), timing (before/after food), duration, and notes.
   - Diet & General Lifestyle Advice.
   - Next Follow-Up Visit schedule.
3. **📱 Direct WhatsApp Integration**:
   - 1-tap WhatsApp message dispatcher with clean formatting, emojis, token number, prescribed tests, medications, diet advice, and clinic contact.
4. **📄 Digital PDF & Slip Generator**:
   - Professional medical slip layout ready to download as PDF or print.
5. **⚡ Clinical Kits & History**:
   - Pre-configured 1-click clinical kits (*Viral Fever*, *Gastroenteritis*, *Hypertension*, *Diabetes*).
   - Searchable OPD records queue to re-send to WhatsApp, duplicate, or reprint.
6. **🚀 Automated GitHub Actions CI/CD**:
   - Automatically builds installable Android APKs on every commit/push and publishes Releases!

---

## 🚀 How to Upload to GitHub & Get Automated APK Builds

### Step 1: Create a new repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `DocOPD`).
3. Set visibility to **Public** (recommended so you can download APK releases easily) or **Private**.
4. Leave "Initialize this repository with a README" **unchecked** (we already have all files ready).
5. Click **Create repository**.

### Step 2: Push your code from your computer
Open your computer Terminal and run these commands:

```bash
cd /Users/apple/.gemini/antigravity/scratch/DocOPDApp

# 1. Initialize git and commit files
git init
git add .
git commit -m "Initial commit: DocOPD Android app with WhatsApp and PDF support"

# 2. Rename branch to main
git branch -M main

# 3. Connect to your GitHub repository (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/DocOPD.git

# 4. Push code to GitHub
git push -u origin main
```

---

## 📥 How to Download & Install the APK on Your Android Phone

### Method A: Download the APK built automatically by GitHub Actions
1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/DocOPD`.
2. Click on the **"Actions"** tab at the top.
3. Click the latest workflow run (e.g., *"Initial commit..."*).
4. Under **Artifacts**, click **`DocOPD-Debug-APK`** to download the ready-to-install `.zip` / `.apk` file.
5. Transfer or open the `.apk` file on your Android phone and tap **Install**!

### Method B: Create a New Release & Share Update Links with Users
Whenever you want to release an update for doctors or staff:
1. Tag your code and push the tag:
   ```bash
   git tag v1.0.1
   git push origin v1.0.1
   ```
2. GitHub Actions will automatically compile the APK and attach it to a **GitHub Release** at:
   `https://github.com/YOUR_USERNAME/DocOPD/releases`
3. Users and doctors can download the updated `.apk` with 1 tap directly from the link!

---

## 🛠️ Local Development & Android Studio

- **Run in Browser / Local Server**:
  ```bash
  python3 /Users/apple/.gemini/antigravity/scratch/DocOPDApp/server.py
  ```
  Open `http://localhost:8085` in your browser.

- **Open in Android Studio**:
  Open the `/Users/apple/.gemini/antigravity/scratch/DocOPDApp/android` folder in Android Studio and click **Run (▶)**.

---

## 📄 License
This project is open-source and free to customize for clinics, doctors, and healthcare institutions.
