import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * 🔥 Remove all oklch() from styles temporarily
 */
const disableOklchStyles = () => {
    const styleTags = document.querySelectorAll("style");
    const backups = [];

    styleTags.forEach((tag) => {
        const original = tag.innerHTML;

        // replace oklch() with safe color
        const safeCSS = original.replace(/oklch\([^)]+\)/g, "#000");

        backups.push({ tag, original });
        tag.innerHTML = safeCSS;
    });

    return () => {
        // 🔁 restore original styles
        backups.forEach(({ tag, original }) => {
            tag.innerHTML = original;
        });
    };
};

/**
 * 📄 Download PDF function
 */
export const DownloadPdf = async () => {
    const element = document.getElementById("pdf-content");

    if (!element) {
        console.error("❌ Element #pdf-content not found");
        return;
    }

    try {
        // ✅ Step 1: Disable oklch BEFORE rendering
        const restoreStyles = disableOklchStyles();

        // ⏳ small delay ensures CSS applied
        await new Promise((r) => setTimeout(r, 100));

        // ✅ Step 2: Capture UI
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        // ✅ Step 3: Restore original styles
        restoreStyles();

        const imgData = canvas.toDataURL("image/png");

        // 📄 Create PDF
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const margin = 10;
        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // 🧾 Multi-page support
        while (heightLeft > 0) {
            pdf.addImage(
                imgData,
                "PNG",
                margin,
                position + margin,
                imgWidth,
                imgHeight
            );

            heightLeft -= pdfHeight;

            if (heightLeft > 0) {
                pdf.addPage();
                position -= pdfHeight;
            }
        }

        // 💾 Download
        pdf.save("download.pdf");

    } catch (err) {
        console.error("❌ PDF failed:", err);
    }
};