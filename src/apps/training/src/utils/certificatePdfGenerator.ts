import { CertificateRecord, Course } from '../types';
import { CERTIFICATES_DATABASE } from '../data/mockData';

/**
 * Escapes characters for PDF literal strings (parentheses and backslashes)
 */
function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Generates or retrieves an official CertificateRecord for an enrolled course
 */
export function getCertificateForCourse(
  course: Course, 
  studentName = 'Chiamaka Ngozi Eze',
  studentEmail = 'chiamaka.eze@danielsconsult.com'
): CertificateRecord {
  // Check if a pre-existing certificate matches this course title or id
  const existing = CERTIFICATES_DATABASE.find(
    (c) => c.courseTitle.toLowerCase() === course.title.toLowerCase() ||
           c.certificateId.toLowerCase().includes(course.id.toLowerCase())
  );

  if (existing) {
    return existing;
  }

  // Generate a realistic, verified certificate record for completed course
  const cleanId = course.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const certId = `MSME-CERT-2026-${cleanId.slice(0, 5)}904`;
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return {
    certificateId: certId,
    studentName,
    studentEmail,
    courseTitle: course.title,
    credentialType: 'Professional Practitioner Certification',
    issueDate: today,
    expiryDate: 'October 30, 2028',
    scorePercentage: 98,
    instructorName: course.instructor?.name || 'Dr. Folashade Adeyemi, FCA',
    verificationUrl: `https://www.msmebooks.org/academy/verify-certificate?id=${certId}`,
    status: 'valid',
    skillsValidated: [
      course.category,
      'Enterprise Software Reconciliation',
      'Multi-Branch Financial Controls',
      'SaaS Sandbox Operations',
      'Audit Trail Verification'
    ]
  };
}

/**
 * Generates an official, standard-compliant vector PDF (PDF-1.4) in A4 Landscape (842 x 595 pt)
 * with golden accreditation borders, security seal, signatures, and verifiable credential data.
 */
export function generateCertificatePdfBlob(cert: CertificateRecord): Blob {
  const width = 842;
  const height = 595;

  const studentName = cert.studentName || 'Chiamaka Ngozi Eze';
  const courseTitle = cert.courseTitle || 'Mastering MsmeBooks Cloud Accounting';
  const certId = cert.certificateId || 'MSME-CERT-2026-90412';
  const issueDate = cert.issueDate || 'October 28, 2026';
  const score = cert.scorePercentage ? `${cert.scorePercentage}%` : '98%';
  const instructor = cert.instructorName || 'Dr. Folashade Adeyemi, FCA';
  const credType = cert.credentialType || 'Professional Practitioner Certification';

  // Construct PDF stream commands
  // Landscape A4 coordinates: (0,0) bottom-left, (842, 595) top-right.
  const streamCommands = [
    // Background fill (Warm ivory/parchment)
    'q',
    '0.988 0.984 0.968 rg',
    `0 0 ${width} ${height} re`,
    'f',
    'Q',

    // Outer Navy Border
    'q',
    '0.043 0.310 0.612 RG', // Primary Blue #0B4F9C
    '8 w',
    `20 20 ${width - 40} ${height - 40} re`,
    'S',
    'Q',

    // Inner Gold/Lemon Accent Border
    'q',
    '0.75 0.58 0.15 RG', // Gold accent #D4AF37
    '2 w',
    `28 28 ${width - 56} ${height - 56} re`,
    'S',
    'Q',

    // Thin inner boundary
    'q',
    '0.043 0.310 0.612 RG',
    '0.75 w',
    `34 34 ${width - 68} ${height - 68} re`,
    'S',
    'Q',

    // Corner Ornaments (decorative corner squares)
    'q',
    '0.75 0.58 0.15 rg',
    '22 22 10 10 re f',
    `${width - 32} 22 10 10 re f`,
    '22 563 10 10 re f',
    `${width - 32} 563 10 10 re f`,
    'Q',

    // Top Header - Organization Brand
    'BT',
    '/F2 20 Tf',
    '0.043 0.310 0.612 rg',
    `1 0 0 1 270 535 Tm`,
    `(${escapePdfText('MSMEBOOKS ACADEMY')}) Tj`,
    'ET',

    // Top Subheader - Pan African Credential
    'BT',
    '/F1 8 Tf',
    '0.3 0.35 0.4 rg',
    `1 0 0 1 245 520 Tm`,
    `(${escapePdfText('PAN-AFRICAN ENTERPRISE ACCREDITATION & SAAS CERTIFICATION AUTHORITY')}) Tj`,
    'ET',

    // Header divider line
    'q',
    '0.75 0.58 0.15 RG',
    '1 w',
    `180 508 m 662 508 l S`,
    'Q',

    // Certificate Title Badge
    'BT',
    '/F2 26 Tf',
    '0.08 0.12 0.22 rg',
    `1 0 0 1 200 470 Tm`,
    `(${escapePdfText('CERTIFICATE OF OPERATIONAL MASTERY')}) Tj`,
    'ET',

    // Credential Type
    'BT',
    '/F1 10 Tf',
    '0.45 0.69 0.11 rg', // Lemon/lime highlight
    `1 0 0 1 310 450 Tm`,
    `(${escapePdfText(credType.toUpperCase())}) Tj`,
    'ET',

    // "THIS IS TO CERTIFY THAT"
    'BT',
    '/F3 11 Tf',
    '0.4 0.45 0.5 rg',
    `1 0 0 1 345 422 Tm`,
    `(${escapePdfText('This is proudly presented to')}) Tj`,
    'ET',

    // Recipient Student Name (Prominent)
    'BT',
    '/F2 24 Tf',
    '0.043 0.310 0.612 rg',
    `1 0 0 1 240 388 Tm`,
    `(${escapePdfText(studentName)}) Tj`,
    'ET',

    // Recipient underline
    'q',
    '0.043 0.310 0.612 RG',
    '1.5 w',
    `200 380 m 642 380 l S`,
    'Q',

    // Fulfillment text
    'BT',
    '/F1 10 Tf',
    '0.25 0.28 0.33 rg',
    `1 0 0 1 120 355 Tm`,
    `(${escapePdfText('for successfully completing all rigorous curriculum modules, sandbox practical simulations,')}) Tj`,
    'ET',
    'BT',
    '/F1 10 Tf',
    '0.25 0.28 0.33 rg',
    `1 0 0 1 180 340 Tm`,
    `(${escapePdfText('and passing the comprehensive enterprise software certification examination in:')}) Tj`,
    'ET',

    // Course Title Box
    'q',
    '0.93 0.96 1.0 rg',
    '100 295 642 34 re f',
    '0.043 0.310 0.612 RG',
    '1 w',
    '100 295 642 34 re S',
    'Q',

    'BT',
    '/F2 14 Tf',
    '0.043 0.310 0.612 rg',
    `1 0 0 1 120 307 Tm`,
    `(${escapePdfText(courseTitle.length > 68 ? courseTitle.slice(0, 68) + '...' : courseTitle)}) Tj`,
    'ET',

    // Assessment Score & Honors
    'BT',
    '/F2 10 Tf',
    '0.15 0.55 0.25 rg',
    `1 0 0 1 270 270 Tm`,
    `(${escapePdfText(`Accredited Examination Score: ${score} · Distinction with Honors`)}) Tj`,
    'ET',

    // Competencies verified tag line
    'BT',
    '/F1 8.5 Tf',
    '0.45 0.48 0.55 rg',
    `1 0 0 1 180 252 Tm`,
    `(${escapePdfText('Competencies Validated: Multi-Branch Financial Controls · Bank Feed Reconciliation · Audit Trails')}) Tj`,
    'ET',

    // Signatures & Official Stamp Grid (Bottom section)
    // Divider
    'q',
    '0.8 0.82 0.85 RG',
    '0.75 w',
    `80 230 m 762 230 l S`,
    'Q',

    // Left Signature: Lead Instructor
    'BT',
    '/F4 13 Tf', // Times-Italic for cursive signature feel
    '0.1 0.15 0.2 rg',
    `1 0 0 1 110 160 Tm`,
    `(${escapePdfText(instructor)}) Tj`,
    'ET',
    'q',
    '0.2 0.25 0.3 RG',
    '1 w',
    `100 152 m 270 152 l S`,
    'Q',
    'BT',
    '/F2 9 Tf',
    '0.2 0.25 0.3 rg',
    `1 0 0 1 100 138 Tm`,
    `(${escapePdfText('LEAD INSTRUCTOR & PRACTITIONER')}) Tj`,
    'ET',
    'BT',
    '/F1 7.5 Tf',
    '0.4 0.45 0.5 rg',
    `1 0 0 1 100 126 Tm`,
    `(${escapePdfText('Faculty of Enterprise Financial Systems')}) Tj`,
    'ET',

    // Center: Official Gold Seal Badge
    'q',
    '0.75 0.58 0.15 RG',
    '2.5 w',
    // Circle seal at center (421, 155), radius 36
    // Approximate circle using 4 cubic bezier segments
    '421 191 m',
    '440.88 191 457 174.88 457 155 c',
    '457 135.12 440.88 119 421 119 c',
    '401.12 119 385 135.12 385 155 c',
    '385 174.88 401.12 191 421 191 c',
    'S',
    '0.95 0.88 0.65 rg',
    // Inner fill circle
    '421 187 m',
    '438.67 187 453 172.67 453 155 c',
    '453 137.33 438.67 123 421 123 c',
    '403.33 123 389 137.33 389 155 c',
    '389 172.67 403.33 187 421 187 c',
    'f',
    'Q',

    'BT',
    '/F2 7 Tf',
    '0.5 0.38 0.08 rg',
    `1 0 0 1 396 160 Tm`,
    `(${escapePdfText('OFFICIAL')}) Tj`,
    'ET',
    'BT',
    '/F2 7 Tf',
    '0.5 0.38 0.08 rg',
    `1 0 0 1 405 150 Tm`,
    `(${escapePdfText('SEAL')}) Tj`,
    'ET',
    'BT',
    '/F1 5.5 Tf',
    '0.4 0.3 0.05 rg',
    `1 0 0 1 394 140 Tm`,
    `(${escapePdfText('VERIFIED 2026')}) Tj`,
    'ET',

    // Right Signature: Academic Director
    'BT',
    '/F4 13 Tf',
    '0.1 0.15 0.2 rg',
    `1 0 0 1 580 160 Tm`,
    `(${escapePdfText('Chukwuemeka Nnadi, Ph.D.')}) Tj`,
    'ET',
    'q',
    '0.2 0.25 0.3 RG',
    '1 w',
    `570 152 m 740 152 l S`,
    'Q',
    'BT',
    '/F2 9 Tf',
    '0.2 0.25 0.3 rg',
    `1 0 0 1 570 138 Tm`,
    `(${escapePdfText('DIRECTOR OF ACADEMIC STANDARDS')}) Tj`,
    'ET',
    'BT',
    '/F1 7.5 Tf',
    '0.4 0.45 0.5 rg',
    `1 0 0 1 570 126 Tm`,
    `(${escapePdfText('MsmeBooks Academy Governing Council')}) Tj`,
    'ET',

    // Footer Accreditation Bar & Verifiable ID
    'q',
    '0.95 0.95 0.95 rg',
    `50 50 ${width - 100} 36 re f`,
    '0.85 0.87 0.9 RG',
    '0.5 w',
    `50 50 ${width - 100} 36 re S`,
    'Q',

    'BT',
    '/F2 8.5 Tf',
    '0.043 0.310 0.612 rg',
    `1 0 0 1 70 72 Tm`,
    `(${escapePdfText(`Certificate ID: ${certId}`)}) Tj`,
    'ET',

    'BT',
    '/F1 8 Tf',
    '0.3 0.35 0.4 rg',
    `1 0 0 1 70 59 Tm`,
    `(${escapePdfText(`Issue Date: ${issueDate} · Validated in MsmeBooks Blockchain Registry`)}) Tj`,
    'ET',

    'BT',
    '/F1 8 Tf',
    '0.043 0.310 0.612 rg',
    `1 0 0 1 500 66 Tm`,
    `(${escapePdfText('Verify Credential Online: msmebooks.org/academy/verify')}) Tj`,
    'ET'
  ];

  const streamContent = streamCommands.join('\n');
  const streamLength = streamContent.length;

  // Build PDF Objects
  const objects: string[] = [];

  // Object 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');

  // Object 2: Pages
  objects.push('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');

  // Object 3: Page (Landscape A4: 842 x 595)
  objects.push(
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R /F4 8 0 R >> >> >>\nendobj`
  );

  // Object 4: Content Stream
  objects.push(
    `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj`
  );

  // Object 5: Standard Helvetica font
  objects.push('5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');

  // Object 6: Helvetica-Bold font
  objects.push('6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj');

  // Object 7: Times-Roman font
  objects.push('7 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>\nendobj');

  // Object 8: Times-Italic font (for signatures)
  objects.push('8 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>\nendobj');

  // Calculate byte offsets for XRef table
  let pdfOutput = '%PDF-1.4\n%âãÏÓ\n';
  const offsets: number[] = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdfOutput.length);
    pdfOutput += objects[i] + '\n';
  }

  const xrefOffset = pdfOutput.length;
  pdfOutput += 'xref\n';
  pdfOutput += `0 ${objects.length + 1}\n`;
  pdfOutput += '0000000000 65535 f \n';

  for (const offset of offsets) {
    pdfOutput += String(offset).padStart(10, '0') + ' 00000 n \n';
  }

  pdfOutput += 'trailer\n';
  pdfOutput += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdfOutput += 'startxref\n';
  pdfOutput += `${xrefOffset}\n`;
  pdfOutput += '%%EOF';

  return new Blob([pdfOutput], { type: 'application/pdf' });
}

/**
 * Triggers a direct browser download of the certificate as a vector PDF file.
 */
export function downloadCertificatePdf(cert: CertificateRecord): void {
  const blob = generateCertificatePdfBlob(cert);
  const cleanTitle = (cert.courseTitle || 'Certificate')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40);
  const fileName = `MsmeBooks-Certificate-${cleanTitle}-${cert.certificateId}.pdf`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens an elegant print layout or window for users wishing to print directly or use system PDF export.
 */
export function printCertificate(cert: CertificateRecord): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    // If popup blocked, fallback to direct download
    downloadCertificatePdf(cert);
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MsmeBooks Academy Certificate - ${cert.certificateId}</title>
        <meta charset="utf-8" />
        <style>
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 24px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #fff;
            color: #0f172a;
            box-sizing: border-box;
          }
          .cert-container {
            border: 8px solid #0B4F9C;
            outline: 2px solid #D4AF37;
            outline-offset: -12px;
            padding: 40px;
            text-align: center;
            background: #fdfbf7;
            border-radius: 8px;
            min-height: 520px;
            box-sizing: border-box;
            position: relative;
          }
          .header-title {
            color: #0B4F9C;
            font-size: 26px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin: 0 0 4px 0;
          }
          .header-sub {
            color: #64748b;
            font-size: 11px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            font-weight: 600;
            margin-bottom: 24px;
          }
          .title-main {
            font-size: 28px;
            font-weight: 800;
            color: #1e293b;
            margin: 12px 0 6px 0;
          }
          .cert-type {
            color: #65a30d;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
          }
          .student-name {
            font-size: 32px;
            font-weight: 900;
            color: #0B4F9C;
            border-bottom: 2px solid #0B4F9C;
            display: inline-block;
            padding: 4px 30px;
            margin: 20px 0 12px 0;
          }
          .course-box {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 10px 24px;
            display: inline-block;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 800;
            color: #0B4F9C;
            margin: 12px 0;
          }
          .footer-grid {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #cbd5e1;
          }
          .sig-box {
            text-align: left;
          }
          .sig-line {
            font-family: Georgia, serif;
            font-style: italic;
            font-size: 16px;
            border-bottom: 1px solid #94a3b8;
            padding-bottom: 4px;
            margin-bottom: 4px;
          }
          .sig-label {
            font-size: 11px;
            font-weight: 700;
            color: #475569;
          }
          .seal-badge {
            width: 80px;
            height: 80px;
            border: 3px dashed #0B4F9C;
            border-radius: 50%;
            background: #dbeafe;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            color: #0B4F9C;
            font-weight: 800;
            font-size: 10px;
            margin: 0 auto;
          }
          .accreditation-bar {
            margin-top: 24px;
            padding: 10px 16px;
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="cert-container">
          <div class="header-title">MsmeBooks Academy</div>
          <div class="header-sub">Pan-African Enterprise Accreditation Authority</div>
          <div class="title-main">Certificate of Operational Mastery</div>
          <div class="cert-type">${cert.credentialType}</div>
          <p style="color: #64748b; font-size: 13px; margin: 16px 0 0 0;">This is proudly presented to</p>
          <div class="student-name">${cert.studentName}</div>
          <p style="color: #475569; font-size: 13px; margin: 6px 0;">for successfully satisfying all practical coursework, ERP sandbox drills, and examinations in</p>
          <div class="course-box">${cert.courseTitle}</div>
          <p style="color: #15803d; font-size: 12px; font-weight: 700; margin: 8px 0;">Graduated with Honors · Score: ${cert.scorePercentage}%</p>

          <div class="footer-grid">
            <div class="sig-box">
              <div class="sig-line">${cert.instructorName}</div>
              <div class="sig-label">Lead Enterprise Instructor, FCA</div>
            </div>
            <div>
              <div class="seal-badge">
                <span>OFFICIAL</span>
                <span>SEAL</span>
              </div>
            </div>
            <div class="sig-box" style="text-align: right;">
              <div class="sig-line">Chukwuemeka Nnadi, Ph.D.</div>
              <div class="sig-label">Director of Academic Standards</div>
            </div>
          </div>

          <div class="accreditation-bar">
            <span><strong>Certificate ID:</strong> ${cert.certificateId}</span>
            <span><strong>Issue Date:</strong> ${cert.issueDate}</span>
            <span><strong>Verify:</strong> msmebooks.org/academy/verify</span>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
