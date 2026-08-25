package com.docopd.app

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.Settings
import android.widget.Toast
import androidx.core.content.FileProvider
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

object ApkInstallerHelper {

    interface DownloadCallback {
        fun onProgress(percentage: Int)
        fun onSuccess(apkFile: File)
        fun onError(error: String)
    }

    /**
     * Download APK with redirect handling and trigger installation
     */
    fun downloadAndInstall(activity: Activity, apkUrl: String, callback: DownloadCallback? = null) {
        // Check Install Unknown Apps Permission on Android 8.0+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!activity.packageManager.canRequestPackageInstalls()) {
                activity.runOnUiThread {
                    Toast.makeText(
                        activity,
                        "Please allow 'Install unknown apps' for DocOPD to complete updates",
                        Toast.LENGTH_LONG
                    ).show()
                    try {
                        val intent = Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES).apply {
                            data = Uri.parse("package:${activity.packageName}")
                        }
                        activity.startActivity(intent)
                    } catch (e: Exception) {
                        e.printStackTrace()
                    }
                }
            }
        }

        activity.runOnUiThread {
            Toast.makeText(activity, "⏳ Downloading DocOPD update...", Toast.LENGTH_SHORT).show()
        }

        thread {
            var connection: HttpURLConnection? = null
            var input: InputStream? = null
            var output: FileOutputStream? = null
            try {
                var targetUrl = apkUrl
                var redirects = 0
                var responseCode: Int

                // Follow up to 5 HTTP redirects (GitHub Releases redirect to AWS S3)
                while (redirects < 5) {
                    val url = URL(targetUrl)
                    connection = url.openConnection() as HttpURLConnection
                    connection.instanceFollowRedirects = true
                    connection.connectTimeout = 20000
                    connection.readTimeout = 60000
                    connection.setRequestProperty("User-Agent", "DocOPD-Updater/1.1")
                    connection.connect()

                    responseCode = connection.responseCode
                    if (responseCode == HttpURLConnection.HTTP_MOVED_PERM ||
                        responseCode == HttpURLConnection.HTTP_MOVED_TEMP ||
                        responseCode == 307 ||
                        responseCode == 308 ||
                        responseCode == 303
                    ) {
                        val newUrl = connection.getHeaderField("Location")
                        if (!newUrl.isNullOrEmpty()) {
                            targetUrl = newUrl
                            redirects++
                            connection.disconnect()
                            continue
                        }
                    }

                    if (responseCode != HttpURLConnection.HTTP_OK) {
                        throw Exception("Server returned HTTP $responseCode: ${connection.responseMessage}")
                    }
                    break
                }

                val fileLength = connection?.contentLength ?: -1
                val downloadDir = activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS) ?: activity.cacheDir
                val apkFile = File(downloadDir, "DocOPD_Latest_Update.apk")

                if (apkFile.exists()) {
                    apkFile.delete()
                }

                input = connection!!.inputStream
                output = FileOutputStream(apkFile)

                val data = ByteArray(4096)
                var total: Long = 0
                var count: Int
                var lastReportedProgress = 0

                while (input.read(data).also { count = it } != -1) {
                    total += count.toLong()
                    if (fileLength > 0) {
                        val progress = ((total * 100) / fileLength).toInt()
                        if (progress - lastReportedProgress >= 10 || progress == 100) {
                            lastReportedProgress = progress
                            activity.runOnUiThread {
                                callback?.onProgress(progress)
                            }
                        }
                    }
                    output.write(data, 0, count)
                }

                output.flush()

                activity.runOnUiThread {
                    Toast.makeText(activity, "✅ Download complete! Opening installer...", Toast.LENGTH_SHORT).show()
                    callback?.onSuccess(apkFile)
                    installApk(activity, apkFile)
                }

            } catch (e: Exception) {
                e.printStackTrace()
                activity.runOnUiThread {
                    val errMsg = "Failed to download update: ${e.localizedMessage ?: e.message}"
                    Toast.makeText(activity, errMsg, Toast.LENGTH_LONG).show()
                    callback?.onError(errMsg)
                }
            } finally {
                try {
                    output?.close()
                    input?.close()
                    connection?.disconnect()
                } catch (ignored: Exception) {}
            }
        }
    }

    /**
     * Launch the Android Package Installer for the downloaded APK file
     */
    fun installApk(context: Context, apkFile: File) {
        try {
            if (!apkFile.exists()) {
                Toast.makeText(context, "APK file not found on device", Toast.LENGTH_SHORT).show()
                return
            }

            val apkUri = FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                apkFile
            )

            val installIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(apkUri, "application/vnd.android.package-archive")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }

            context.startActivity(installIntent)
        } catch (e: Exception) {
            Toast.makeText(context, "Error opening installer: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
        }
    }
}
