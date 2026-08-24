package com.docopd.app

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Typeface
import android.graphics.pdf.PdfDocument
import android.os.Environment
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream

object PdfGeneratorHelper {

    /**
     * Generate native A4 PDF document from OPD Ticket JSON
     */
    fun generateOpdPdf(context: Context, ticketJsonString: String, doctorJsonString: String): File? {
        try {
            val ticket = JSONObject(ticketJsonString)
            val doctor = JSONObject(doctorJsonString)

            val pdfDocument = PdfDocument()
            val pageInfo = PdfDocument.PageInfo.Builder(595, 842, 1).create() // A4 at 72 dpi
            val page = pdfDocument.startPage(pageInfo)
            val canvas: Canvas = page.canvas

            val paint = Paint()
            val textPaint = Paint().apply {
                color = Color.DKGRAY
                textSize = 10f
                isAntiAlias = true
            }
            val titlePaint = Paint().apply {
                color = Color.parseColor("#0D9488")
                textSize = 16f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                isAntiAlias = true
            }
            val headerPaint = Paint().apply {
                color = Color.BLACK
                textSize = 12f
                typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
                isAntiAlias = true
            }

            var y = 40f

            // Clinic Name & Doctor Header
            canvas.drawText(doctor.optString("clinicName", "CLINIC").uppercase(), 30f, y, titlePaint)
            y += 18f
            canvas.drawText(doctor.optString("name", "Dr. Doctor"), 30f, y, headerPaint)
            y += 14f
            canvas.drawText("${doctor.optString("degrees", "")} • Reg No: ${doctor.optString("regNumber", "")}", 30f, y, textPaint)
            y += 14f
            canvas.drawText("Address: ${doctor.optString("address", "")} | Phone: ${doctor.optString("phone", "")}", 30f, y, textPaint)
            y += 12f

            // Line Separator
            paint.color = Color.parseColor("#0D9488")
            paint.strokeWidth = 2f
            canvas.drawLine(30f, y, 565f, y, paint)
            y += 18f

            // Patient Info Box
            val patient = ticket.optJSONObject("patient") ?: JSONObject()
            val token = ticket.optString("tokenNumber", "1")
            val date = ticket.optString("date", "")
            val patName = patient.optString("name", "Patient")
            val patAge = patient.optString("age", "--")
            val patGender = patient.optString("gender", "Male")
            val patPhone = patient.optString("phone", "")

            paint.color = Color.parseColor("#F1F5F9")
            canvas.drawRect(30f, y, 565f, y + 40f, paint)

            canvas.drawText("TOKEN: #$token", 40f, y + 16f, headerPaint)
            canvas.drawText("DATE: $date", 40f, y + 32f, textPaint)
            canvas.drawText("PATIENT: $patName", 200f, y + 16f, headerPaint)
            canvas.drawText("AGE/GENDER: $patAge Yrs / $patGender", 200f, y + 32f, textPaint)
            canvas.drawText("PHONE: $patPhone", 420f, y + 16f, textPaint)
            y += 55f

            // Vitals
            val vitals = ticket.optJSONObject("vitals") ?: JSONObject()
            val bp = vitals.optString("bp", "")
            val pulse = vitals.optString("pulse", "")
            val temp = vitals.optString("temp", "")
            val weight = vitals.optString("weight", "")

            if (bp.isNotEmpty() || pulse.isNotEmpty() || temp.isNotEmpty()) {
                val vitalsText = "Vitals: BP: $bp mmHg | Pulse: $pulse bpm | Temp: $temp °F | Wt: $weight kg"
                canvas.drawText(vitalsText, 30f, y, headerPaint)
                y += 18f
            }

            // Diagnosis
            val diagnosis = ticket.optString("diagnosis", "")
            if (diagnosis.isNotEmpty()) {
                canvas.drawText("Provisional Diagnosis: $diagnosis", 30f, y, headerPaint)
                y += 18f
            }

            // Rx Section Header
            val rxSymbolPaint = Paint().apply {
                color = Color.parseColor("#0D9488")
                textSize = 20f
                typeface = Typeface.create(Typeface.SERIF, Typeface.BOLD)
            }
            canvas.drawText("Rx", 30f, y + 10f, rxSymbolPaint)
            y += 26f

            // Medicines
            val medicines = ticket.optJSONArray("medicines")
            if (medicines != null && medicines.length() > 0) {
                for (i in 0 until medicines.length()) {
                    val med = medicines.getJSONObject(i)
                    val medLine = "${i + 1}. ${med.optString("name")}  [${med.optString("dose")}] - ${med.optString("timing")} (${med.optString("duration")})"
                    canvas.drawText(medLine, 40f, y, headerPaint)
                    y += 14f
                    val note = med.optString("instructions", "")
                    if (note.isNotEmpty()) {
                        canvas.drawText("   Note: $note", 40f, y, textPaint)
                        y += 14f
                    }
                }
            }

            // Tests
            val tests = ticket.optJSONArray("tests")
            if (tests != null && tests.length() > 0) {
                y += 10f
                canvas.drawText("Recommended Tests:", 30f, y, headerPaint)
                y += 16f
                for (i in 0 until tests.length()) {
                    val test = tests.getJSONObject(i)
                    canvas.drawText("• ${test.optString("name")}", 40f, y, textPaint)
                    y += 14f
                }
            }

            // Footer
            y = 780f
            paint.strokeWidth = 1f
            paint.color = Color.LTGRAY
            canvas.drawLine(30f, y, 565f, y, paint)
            y += 20f
            canvas.drawText(doctor.optString("footerNotes", ""), 30f, y, textPaint)
            canvas.drawText("Dr. Signature: __________________", 400f, y, headerPaint)

            pdfDocument.finishPage(page)

            // Save PDF to cache dir
            val outputDir = context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS) ?: context.cacheDir
            val fileName = "OPD_Ticket_${System.currentTimeMillis()}.pdf"
            val file = File(outputDir, fileName)

            val outputStream = FileOutputStream(file)
            pdfDocument.writeTo(outputStream)
            pdfDocument.close()
            outputStream.close()

            return file
        } catch (e: Exception) {
            e.printStackTrace()
            return null
        }
    }
}
