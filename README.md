# 🩺 DocOPD - Doctor OPD Ticket & Digital Prescription Android App

[![Build Android APK](https://github.com/Doctor/DocOPD/actions/workflows/build-apk.yml/badge.svg)](https://github.com/Doctor/DocOPD/actions/workflows/build-apk.yml)
[![Version](https://img.shields.io/badge/version-1.1.0-teal.svg)](https://github.com/Doctor/DocOPD/releases)
[![Author](https://img.shields.io/badge/Developer-ARSALAN%20YOUSUF%20DAR-0284C7.svg)](#-project-creator--developer-contact)
[![Platform](https://img.shields.io/badge/platform-Android%20%7C%20PWA-0284C7.svg)](#)

A complete Android application built for doctors and medical clinics to configure custom clinic profiles, create comprehensive digital OPD tickets & prescriptions, generate high-resolution vector PDF slips, print A4 prescriptions, and send them directly to patients via WhatsApp.

---

## 👨‍💻 Project Creator & Developer Contact

- **Lead Developer**: **ARSALAN YOUSUF DAR**
- **Email**: [dararsu01@gmail.com](mailto:dararsu01@gmail.com)
- **Academic Project**: B.Tech Major Capstone Project • Digital Healthcare & EMR System

---

## 🌟 What's New in Version 1.1.0

- 🖨️ **Fixed PDF Download & Printing**: Built a pure, offline-capable vector PDF generation engine (`application/pdf`) and an isolated print iframe that prints crisp, professional A4 prescription slips with zero external dependencies.
- 🩺 **Doctor Symbol App Icon**: High-resolution medical Caduceus, Stethoscope & Cross badges in SVG and PNG formats for Android and Web.
- 👨‍💻 **Creator Section**: Dedicated Developer card in the Settings tab with 1-click email and contact links.
- 📱 **Android Print & Share Bridge**: Native integration with Android `PrintManager` and `PdfDocument` for instant PDF sharing on mobile.

---

## 🚀 How to Send This Update to All Users via GitHub

Since you have already uploaded your project to GitHub, follow these simple steps to push the new version (`v1.1.0`) so that GitHub automatically builds the new `.apk` and your users receive the update:

### 1. Commit and Push the Updates to GitHub
Run these commands in your Mac Terminal:

```bash
cd ~/.gemini/antigravity/scratch/DocOPDApp

# Stage and commit all changes
git add .
git commit -m "feat: v1.1.0 release - fixed PDF & print engine, added doctor icon and creator contact"

# Push to your main branch
git push origin main
```

### 2. Create the Version Tag (Triggers Automatic APK Release)
```bash
# Create the v1.1.0 release tag and push it
git tag v1.1.0
git push origin v1.1.0
```

### 3. How Users Receive the Update
1. **Automated GitHub Actions Build**: GitHub will automatically compile the new `.apk` and attach it to your **GitHub Releases** page:  
   `https://github.com/YOUR_USERNAME/DocOPD/releases`
2. **In-App Auto-Update**: Existing doctors and users can open their app, go to **"Dr Setup"** > **"App Version & GitHub Updates"**, and tap **"🔍 Check for Updates"**. The app will detect `v1.1.0` and show a 1-tap **"📥 Download Latest APK"** button!

---

## 🛠️ Features Overview

1. **👨‍⚕️ Doctor Profile Customization**: Full Name, Degrees, Registration Number, Clinic Name, Address, WhatsApp Contact, Consultation Timings & Fee.
2. **🎫 Complete Clinical Sections**: Patient Info, Vitals with Auto-Calculated BMI, Chief Complaints, Provisional Diagnosis, Recommended Lab Tests with fasting instructions, Rx Medicines with dosage/timing, Diet Advice, and Follow-up.
3. **📱 WhatsApp 1-Tap Sharing**: Direct WhatsApp message dispatcher with clean medical table formatting.
4. **📄 Pure Vector PDF & Clean A4 Printing**: Instant download and isolated print dialog.
5. **⚡ 1-Click Clinical Kits**: Templates for *Viral Fever*, *Gastroenteritis*, *Hypertension*, and *Diabetes*.

---

## 📄 License & Attribution
Designed and Developed by **ARSALAN YOUSUF DAR** ([dararsu01@gmail.com](mailto:dararsu01@gmail.com)).
Free to use and customize for clinics, doctors, and academic projects.
