package com.docopd.app

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity

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

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                if (url.startsWith("https://wa.me") || url.startsWith("whatsapp://") || url.startsWith("https://api.whatsapp.com")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        startActivity(intent)
                        return true
                    } catch (e: Exception) {
                        Toast.makeText(this@MainActivity, "WhatsApp not installed or error opening", Toast.LENGTH_SHORT).show()
                    }
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
        fun showToast(message: String) {
            activity.runOnUiThread {
                Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
            }
        }
    }
}
