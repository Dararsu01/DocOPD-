package com.docopd.app

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.webkit.DownloadListener
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import java.io.File

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true

        // JavaScript Interface for Native Android Bridge
        webView.addJavascriptInterface(WebAppInterface(this), "AndroidBridge")

        // Handle Download Listener for any APK / file links in WebView
        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, contentLength ->
            if (url.endsWith(".apk") || url.contains("/download/") || mimetype == "application/vnd.android.package-archive") {
                ApkInstallerHelper.downloadAndInstall(this@MainActivity, url, object : ApkInstallerHelper.DownloadCallback {
                    override fun onProgress(percentage: Int) {
                        webView.evaluateJavascript("if (window.onApkDownloadProgress) window.onApkDownloadProgress($percentage);", null)
                    }
                    override fun onSuccess(apkFile: File) {
                        webView.evaluateJavascript("if (window.onApkDownloadSuccess) window.onApkDownloadSuccess();", null)
                    }
                    override fun onError(error: String) {
                        webView.evaluateJavascript("if (window.onApkDownloadError) window.onApkDownloadError('${error.replace("'", "\\'")}');", null)
                    }
                })
            } else {
                try {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                } catch (e: Exception) {
                    Toast.makeText(this@MainActivity, "Could not open download link", Toast.LENGTH_SHORT).show()
                }
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                if (url.startsWith("https://wa.me") || url.startsWith("whatsapp://") || url.startsWith("https://api.whatsapp.com") || url.startsWith("mailto:")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "Could not open link: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
                    }
                    return true
                } else if (url.endsWith(".apk") || url.contains("/releases/latest/download/") || url.contains("/releases/download/")) {
                    ApkInstallerHelper.downloadAndInstall(this@MainActivity, url, object : ApkInstallerHelper.DownloadCallback {
                        override fun onProgress(percentage: Int) {
                            webView.evaluateJavascript("if (window.onApkDownloadProgress) window.onApkDownloadProgress($percentage);", null)
                        }
                        override fun onSuccess(apkFile: File) {
                            webView.evaluateJavascript("if (window.onApkDownloadSuccess) window.onApkDownloadSuccess();", null)
                        }
                        override fun onError(error: String) {
                            webView.evaluateJavascript("if (window.onApkDownloadError) window.onApkDownloadError('${error.replace("'", "\\'")}');", null)
                        }
                    })
                    return true
                }
                return false
            }
        }

        webView.webChromeClient = WebChromeClient()

        // Load offline bundled asset
        webView.loadUrl("file:///android_asset/index.html")

        // Handle hardware back press
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    /**
     * Native JavaScript interface exposed to the WebView JS
     */
    inner class WebAppInterface(private val activity: MainActivity) {

        @JavascriptInterface
        fun sendWhatsAppMessage(phoneNumber: String, messageText: String) {
            activity.runOnUiThread {
                WhatsAppHelper.sendTextMessage(activity, phoneNumber, messageText)
            }
        }

        @JavascriptInterface
        fun generateAndSharePdf(ticketJson: String, doctorJson: String, patientPhone: String?) {
            activity.runOnUiThread {
                val pdfFile = PdfGeneratorHelper.generateOpdPdf(activity, ticketJson, doctorJson)
                if (pdfFile != null) {
                    WhatsAppHelper.sharePdfFile(activity, pdfFile, patientPhone)
                } else {
                    Toast.makeText(activity, "Failed to generate PDF", Toast.LENGTH_SHORT).show()
                }
            }
        }

        @JavascriptInterface
        fun printDocument() {
            activity.runOnUiThread {
                try {
                    val printManager = activity.getSystemService(Context.PRINT_SERVICE) as? PrintManager
                    val printAdapter = webView.createPrintDocumentAdapter("DocOPD_Prescription")
                    printManager?.print("DocOPD_Prescription", printAdapter, PrintAttributes.Builder().build())
                } catch (e: Exception) {
                    Toast.makeText(activity, "Printing not supported: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
                }
            }
        }

        @JavascriptInterface
        fun downloadAndInstallApk(apkUrl: String) {
            ApkInstallerHelper.downloadAndInstall(activity, apkUrl, object : ApkInstallerHelper.DownloadCallback {
                override fun onProgress(percentage: Int) {
                    webView.evaluateJavascript("if (window.onApkDownloadProgress) window.onApkDownloadProgress($percentage);", null)
                }
                override fun onSuccess(apkFile: File) {
                    webView.evaluateJavascript("if (window.onApkDownloadSuccess) window.onApkDownloadSuccess();", null)
                }
                override fun onError(error: String) {
                    webView.evaluateJavascript("if (window.onApkDownloadError) window.onApkDownloadError('${error.replace("'", "\\'")}');", null)
                }
            })
        }

        @JavascriptInterface
        fun showToast(message: String) {
            activity.runOnUiThread {
                Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
            }
        }
    }
}
