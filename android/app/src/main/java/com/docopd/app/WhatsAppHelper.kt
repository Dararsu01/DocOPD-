package com.docopd.app

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.core.content.FileProvider
import java.io.File
import java.net.URLEncoder

object WhatsAppHelper {

    /**
     * Send direct WhatsApp text message to patient phone number
     */
    fun sendTextMessage(context: Context, phoneNumber: String, messageText: String) {
        try {
            var formattedPhone = phoneNumber.replace("+", "").replace(" ", "").replace("-", "").trim()
            if (!formattedPhone.startsWith("91") && formattedPhone.length == 10) {
                formattedPhone = "91$formattedPhone"
            }

            val encodedMessage = URLEncoder.encode(messageText, "UTF-8")
            val uri = Uri.parse("https://api.whatsapp.com/send?phone=$formattedPhone&text=$encodedMessage")
            
            val intent = Intent(Intent.ACTION_VIEW, uri).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
        } catch (e: Exception) {
            Toast.makeText(context, "Could not open WhatsApp: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
        }
    }

    /**
     * Share PDF OPD slip directly to WhatsApp or Android Share Sheet
     */
    fun sharePdfFile(context: Context, pdfFile: File, patientPhone: String? = null) {
        try {
            if (!pdfFile.exists()) {
                Toast.makeText(context, "PDF file not found", Toast.LENGTH_SHORT).show()
                return
            }

            val uri: Uri = FileProvider.getUriForFile(
                context,
                "${context.packageName}.fileprovider",
                pdfFile
            )

            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "application/pdf"
                putExtra(Intent.EXTRA_STREAM, uri)
                putExtra(Intent.EXTRA_SUBJECT, "OPD Ticket & Prescription")
                putExtra(Intent.EXTRA_TEXT, "Here is your digital OPD Ticket & Prescription.")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            val chooser = Intent.createChooser(shareIntent, "Share OPD Slip via...")
            chooser.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(chooser)
        } catch (e: Exception) {
            Toast.makeText(context, "Error sharing PDF: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
        }
    }
}
