import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Replace unsupported CSS color functions like oklch()
 */
const sanitizeUnsupportedColors = () => {
    const elements = document.querySelectorAll("*");
    console.log(elements);

    // elements.forEach((el) => {
    //     const style = getComputedStyle(el);

    //     try {
    //         if (style.color && style.color.includes("oklch")) {
    //             el.style.color = "#000000";
    //         }

    //         if (style.backgroundColor && style.backgroundColor.includes("oklch")) {
    //             el.style.backgroundColor = "#ffffff";
    //         }

    //         if (style.borderColor && style.borderColor.includes("oklch")) {
    //             el.style.borderColor = "#000000";
    //         }

    //     } catch (e) {
    //         // ignore edge cases
    //     }
    // });
};

/**
 * Download HTML content as multi-page PDF
 */
export const DownloadPdf = async () => {
    const element = document.getElementById("pdf-content");

    if (!element) {
        console.error("Element #pdf-content not found");
        return;
    }

    // 🔥 Fix for oklch() crash
    sanitizeUnsupportedColors();

    // Capture DOM as canvas
    const canvas = await html2canvas(element, {
        scale: 2, // better quality
        useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages
    while (heightLeft > 0) {
        position = heightLeft - imgHeight;

        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

        heightLeft -= pdfHeight;
    }

    pdf.save("download.pdf");
};