import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { formatTime12Hour } from "../attendance-history/attendance-history-list";

import {
  AttendanceRecord,
  AttendanceSummaryPayload,
} from "@/types/attendanceTypes";

// export const attendancehistoryPDF = (
//   attendanceHistoryData: AttendanceRecord[],
//   attendanceSummaryData?: AttendanceSummaryPayload[],
//   leaveSummaryData?: {
//     leave_type: string;
//     used_days: number;
//     total_quota: number;
//     remaining: number;
//   }[],
//   leaveDetailData?: {
//     employee_id?: number;
//     full_name?: string;
//     annual?: string[];
//     sick?: string[];
//     casual?: string[];
//   }[],
//   dateRange?: { from: Date; to: Date }
// ) => {
//   const doc = new jsPDF("p", "mm", "a4");
//   const pageWidth = doc.internal.pageSize.getWidth();

//   // --- Header ---
//   doc.setFontSize(18);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor("#0074fc");
//   doc.text("Attendance History Report", pageWidth / 2, 15, { align: "center" });

//   const employeeName =
//     attendanceHistoryData[0]?.full_name || "Unknown Employee";
//   const employeeCode = attendanceHistoryData[0]?.employee_code || "---";
//   doc.setFontSize(12);
//   doc.setFont("helvetica", "normal");
//   doc.setTextColor(0);
//   doc.text(`Employee: ${employeeName}`, 14, 25);

//   const from = dateRange?.from ? format(dateRange.from, "dd-MMM-yyyy") : "---";
//   const to = dateRange?.to ? format(dateRange.to, "dd-MMM-yyyy") : "---";
//   doc.text(`Period: ${from} to ${to}`, 14, 32);

//   let currentY = 45;

//   // --- Attendance Summary ---
//   // if (attendanceSummaryData && attendanceSummaryData.length > 0) {
//   //   const summary = attendanceSummaryData[0];
//   //   doc.setFontSize(14);
//   //   doc.setFont("helvetica", "bold");
//   //   doc.text("Attendance Summary", 14, currentY);
//   //   currentY += 8;

//   //   const summaryData = [
//   //     ["Total Days", summary.total_days],
//   //     ["Working Days", summary.working_days],
//   //     ["Present Days", summary.present_days],
//   //     ["Absent Days", summary.absent_days],
//   //     ["Leave Days", summary.leave_days],
//   //     ["Weekend Attendance", summary.weekend_attendance_days],
//   //     ["Work From Home", summary.work_from_home_days],
//   //     ["On-Time Check-ins", summary.on_time_check_ins],
//   //     ["Late Check-ins", summary.late_check_ins],
//   //     ["Overtime Check-outs", summary.overtime_check_outs],
//   //     ["Expected Hours", summary.expected_work_hours],
//   //     ["Actual Hours", summary.actual_work_hours],
//   //   ];

//   //   autoTable(doc, {
//   //     startY: currentY,
//   //     head: [["Description", "Count"]],
//   //     body: summaryData,
//   //     theme: "grid",
//   //     styles: { fontSize: 8, cellPadding: 2 },
//   //     headStyles: { fillColor: [0, 116, 252], textColor: 255 },
//   //     alternateRowStyles: { fillColor: [245, 249, 253] },
//   //   });

//   //   currentY = (doc as any).lastAutoTable.finalY + 10;
//   // }

//   // --- Attendance Summary - 6 Cards Per Row (Improved Text Size) ---
//   if (attendanceSummaryData && attendanceSummaryData.length > 0) {
//     const summary = attendanceSummaryData[0];

//     doc.setFontSize(15);
//     doc.setFont("helvetica", "bold");
//     doc.setTextColor(0);
//     doc.text("Attendance Summary", 14, currentY);
//     currentY += 10;

//     const cards = [
//       { label: "Total Days", value: summary.total_days },
//       { label: "Working Days", value: summary.working_days },
//       { label: "Present Days", value: summary.present_days },
//       { label: "Absent Days", value: summary.absent_days },
//       { label: "Leave Days", value: summary.leave_days },
//       { label: "Weekend Att.", value: summary.weekend_attendance_days },
//       { label: "Work From Home", value: summary.work_from_home_days },
//       { label: "On-Time In", value: summary.on_time_check_ins },
//       { label: "Late In", value: summary.late_check_ins },
//       { label: "Overtime Out", value: summary.overtime_check_outs },
//       { label: "Expected Hrs", value: summary.expected_work_hours },
//       { label: "Actual Hrs", value: summary.actual_work_hours },
//     ];

//     const cardsPerRow = 6;
//     const cardWidth = (pageWidth - 28) / cardsPerRow;
//     const cardHeight = 18; // Thoda height badhaya for better text visibility
//     const spacing = 8;
//     const padding = 5;

//     const rowsNeeded = Math.ceil(cards.length / cardsPerRow);

//     for (let i = 0; i < cards.length; i++) {
//       const card = cards[i];
//       const col = i % cardsPerRow;
//       const row = Math.floor(i / cardsPerRow);

//       const x = 14 + col * cardWidth;
//       const y = currentY + row * (cardHeight + spacing);

//       // Light background
//       doc.setFillColor(240, 248, 255);
//       doc.rect(x, y, cardWidth - 3, cardHeight, "F");

//       // Optional: Thin border (comment if not needed)
//       doc.setDrawColor(200, 220, 255);
//       doc.setLineWidth(0.4);
//       doc.rect(x, y, cardWidth - 3, cardHeight, "S");

//       // Label - Increased size, dark gray
//       doc.setFontSize(8);
//       doc.setFont("helvetica", "normal");
//       doc.setTextColor(70);
//       doc.text(card.label, x + padding, y + 7);

//       // Value - Bigger, bold, black
//       doc.setFontSize(10);
//       doc.setFont("helvetica", "bold");
//       doc.setTextColor(0);
//       doc.text(String(card.value), x + padding, y + 14);
//     }

//     currentY += rowsNeeded * (cardHeight + spacing) + 12;
//   }
//   //  --- Leave Summary ---
//   if (leaveSummaryData && leaveSummaryData.length > 0) {
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("Leave Summary", 14, currentY);
//     currentY += 8;

//     const leaveBody = leaveSummaryData.map((leave) => [
//       leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1),
//       leave.used_days,
//       leave.total_quota,
//       leave.remaining,
//     ]);

//     autoTable(doc, {
//       startY: currentY,
//       head: [["Leave Type", "Used", "Total Quota", "Remaining"]],
//       body: leaveBody,
//       theme: "grid",
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [0, 116, 252], textColor: 255 },
//     });

//     currentY = (doc as any).lastAutoTable.finalY + 10;
//   }
//   // // --- Leave Summary - 6 Cards Per Row (Same Clean Style) ---
//   // if (leaveSummaryData && leaveSummaryData.length > 0) {
//   //   doc.setFontSize(15);
//   //   doc.setFont("helvetica", "bold");
//   //   doc.setTextColor(0);
//   //   doc.text("Leave Summary", 14, currentY);
//   //   currentY += 10;

//   //   // Flatten all leave metrics into cards
//   //   const cards: { label: string; value: number }[] = [];
//   //   leaveSummaryData.forEach((leave) => {
//   //     const type = leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1);
//   //     cards.push({ label: `${type} Used`, value: leave.used_days });
//   //     cards.push({ label: `${type} Total`, value: leave.total_quota });
//   //     cards.push({ label: `${type} Remain`, value: leave.remaining });
//   //   });

//   //   const cardsPerRow = 6;
//   //   const cardWidth = (pageWidth - 28) / cardsPerRow;
//   //   const cardHeight = 18;
//   //   const spacing = 8;
//   //   const padding = 5;

//   //   const rowsNeeded = Math.ceil(cards.length / cardsPerRow);

//   //   for (let i = 0; i < cards.length; i++) {
//   //     const card = cards[i];
//   //     const col = i % cardsPerRow;
//   //     const row = Math.floor(i / cardsPerRow);

//   //     const x = 14 + col * cardWidth;
//   //     const y = currentY + row * (cardHeight + spacing);

//   //     doc.setFillColor(240, 248, 255);
//   //     doc.rect(x, y, cardWidth - 3, cardHeight, "F");

//   //     doc.setFontSize(8);
//   //     doc.setFont("helvetica", "normal");
//   //     doc.setTextColor(70);
//   //     doc.text(card.label, x + padding, y + 7);

//   //     doc.setFontSize(10);
//   //     doc.setFont("helvetica", "bold");
//   //     doc.setTextColor(0);
//   //     doc.text(String(card.value), x + padding, y + 14);
//   //   }

//   //   currentY += rowsNeeded * (cardHeight + spacing) + 12;
//   // }
//   // --- Leave Details Table ---
//   if (leaveDetailData && leaveDetailData.length > 0) {
//     doc.setFontSize(14);
//     doc.setFont("helvetica", "bold");
//     doc.text("Leave Details", 14, currentY);
//     currentY += 8;

//     // Prepare table data
//     const detail = leaveDetailData[0]; // Assuming 1 employee
//     const annual = detail.annual || [];
//     const sick = detail.sick || [];
//     const casual = detail.casual || [];

//     // Calculate max number of rows
//     const maxRows = Math.max(annual.length, sick.length, casual.length);

//     const leaveRows: string[][] = [];
//     for (let i = 0; i < maxRows; i++) {
//       leaveRows.push([annual[i] || "", sick[i] || "", casual[i] || ""]);
//     }

//     autoTable(doc, {
//       startY: currentY,
//       head: [["Annual Leave", "Sick Leave", "Casual Leave"]],
//       body: leaveRows,
//       theme: "grid",
//       styles: { fontSize: 8, cellPadding: 2 },
//       headStyles: { fillColor: [0, 116, 252], textColor: 255 },
//       alternateRowStyles: { fillColor: [245, 249, 253] },
//     });

//     currentY = (doc as any).lastAutoTable.finalY + 10;
//   }

//   // --- Daily Attendance Records ---
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.setTextColor(0);
//   doc.text("Daily Attendance Records", 14, currentY);
//   currentY += 8;

//   const tableColumn = [
//     "Name",
//     "Day",
//     "Date",
//     "Check-In",
//     "In Status",
//     "Check-Out",
//     "Out Status",
//     "Hours",
//     "Day Status",
//   ];

//   const sortedData = [...attendanceHistoryData].sort(
//     (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
//   );

//   const tableRows = sortedData.map((row) => {
//     const dateObj = new Date(row.date);
//     const day = format(dateObj, "EEEE");
//     const dateStr = format(dateObj, "dd-MMM-yyyy");

//     const formatStatus = (status: string | null) => {
//       if (!status) return "---";
//       return status
//         .split("_")
//         .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
//         .join(" ");
//     };

//     return [
//       row.full_name || "---",
//       day,
//       dateStr,
//       formatTime12Hour(row.check_in_time),
//       formatStatus(row.check_in_status),
//       formatTime12Hour(row.check_out_time),
//       formatStatus(row.check_out_status),
//       row.work_hours || "---",
//       formatStatus(row.day_status),
//     ];
//   });

//   autoTable(doc, {
//     head: [tableColumn],
//     body: tableRows,
//     startY: currentY,
//     styles: { fontSize: 8, cellPadding: 2 },
//     headStyles: { fillColor: [0, 116, 252], textColor: 255 },
//     alternateRowStyles: { fillColor: [236, 240, 241] },
//     columnStyles: {
//       0: { cellWidth: 30 },
//       2: { cellWidth: 22 },
//       3: { cellWidth: 20 },
//       5: { cellWidth: 20 },
//     },
//     pageBreak: "auto",
//     margin: { top: 10 },
//     didParseCell: (data) => {
//       if (data.section === "body") {
//         const rowIndex = data.row.index;
//         const rowData = tableRows[rowIndex];
//         if ((rowData[4] || "").toLowerCase() === "late") {
//           data.cell.styles.fillColor = [255, 200, 200];
//           data.cell.styles.textColor = 0;
//         }
//       }
//     },
//   });

//   // --- File name with date range ---
//   const fileName = `Attendance_Report_${employeeName.replace(
//     /\s+/g,
//     "_"
//   )}_${from}_to_${to}.pdf`;
//   doc.save(fileName);
// };

export const attendancehistoryPDF = (
  attendanceHistoryData: AttendanceRecord[],
  attendanceSummaryData?: AttendanceSummaryPayload[],
  leaveSummaryData?: {
    leave_type: string;
    used_days: number;
    total_quota: number;
    remaining: number;
  }[],
  leaveDetailData?: {
    employee_id?: number;
    full_name?: string;
    annual?: string[];
    sick?: string[];
    casual?: string[];
  }[],
  dateRange?: { from: Date; to: Date }
) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#0074fc");
  doc.text("Attendance & Leave Report", pageWidth / 2, 15, { align: "center" });
  const employeeName =
    attendanceHistoryData[0]?.full_name || "Unknown Employee";
  // const employeeCode = attendanceHistoryData[0]?.employee_code || "---";
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text(`Name: ${employeeName}`, 14, 25);
  const from = dateRange?.from ? format(dateRange.from, "dd-MMM-yyyy") : "---";
  const to = dateRange?.to ? format(dateRange.to, "dd-MMM-yyyy") : "---";
  doc.text(`Period: ${from} to ${to}`, 14, 32);

  let currentY = 45;
  if (attendanceSummaryData && attendanceSummaryData.length > 0) {
    const summary = attendanceSummaryData[0];
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Attendance Summary", 14, currentY);
    currentY += 10;
    const cards = [
      { label: "Total Days", value: summary.total_days },
      { label: "Working Days", value: summary.working_days },
      { label: "Present Days", value: summary.present_days },
      { label: "Absent Days", value: summary.absent_days },
      { label: "Leave Days", value: summary.leave_days },
      { label: "Weekend Att.", value: summary.weekend_attendance_days },
      { label: "Work From Home", value: summary.work_from_home_days },
      { label: "On-Time In", value: summary.on_time_check_ins },
      { label: "Late In", value: summary.late_check_ins },
      { label: "Overtime Out", value: summary.overtime_check_outs },
      { label: "Expected Hrs", value: summary.expected_work_hours },
      { label: "Actual Hrs", value: summary.actual_work_hours },
    ];
    const cardsPerRow = 6;
    const cardWidth = (pageWidth - 28) / cardsPerRow;
    const cardHeight = 18;
    const spacing = 8;
    const padding = 5;
    const rowsNeeded = Math.ceil(cards.length / cardsPerRow);
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const col = i % cardsPerRow;
      const row = Math.floor(i / cardsPerRow);
      const x = 14 + col * cardWidth;
      const y = currentY + row * (cardHeight + spacing);
      doc.setFillColor(240, 248, 255);
      doc.rect(x, y, cardWidth - 3, cardHeight, "F");
      doc.setDrawColor(200, 220, 255);
      doc.setLineWidth(0.4);
      doc.rect(x, y, cardWidth - 3, cardHeight, "S");
      const centerX = x + (cardWidth - 3) / 2;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70);
      doc.text(card.label, centerX, y + 7, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(String(card.value), centerX, y + 14, { align: "center" });
    }
    currentY += rowsNeeded * (cardHeight + spacing) + 12;
  }
  if (leaveSummaryData && leaveSummaryData.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Leave Summary", 14, currentY);
    currentY += 8;

    const leaveBody = leaveSummaryData.map((leave) => [
      leave.leave_type.charAt(0).toUpperCase() + leave.leave_type.slice(1),
      leave.used_days,
      leave.total_quota,
      leave.remaining,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [["Leave Type", "Used", "Total Quota", "Remaining"]],
      body: leaveBody,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 116, 252], textColor: 255 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }
  if (leaveDetailData && leaveDetailData.length > 0) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Leave Details", 14, currentY);
    currentY += 8;
    const detail = leaveDetailData[0];
    const annual = detail.annual || [];
    const sick = detail.sick || [];
    const casual = detail.casual || [];
    const maxRows = Math.max(annual.length, sick.length, casual.length);

    const leaveRows: string[][] = [];
    for (let i = 0; i < maxRows; i++) {
      leaveRows.push([annual[i] || "", sick[i] || "", casual[i] || ""]);
    }
    autoTable(doc, {
      startY: currentY,
      head: [["Annual Leave", "Sick Leave", "Casual Leave"]],
      body: leaveRows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [0, 116, 252], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 249, 253] },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }
  doc.addPage();
  currentY = 20;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#0074fc");
  doc.text("Attendance Records", pageWidth / 2, currentY, {
    align: "center",
  });
  currentY += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text(`Name: ${employeeName}`, 14, currentY);
  currentY += 7;
  doc.text(`Period: ${from} to ${to}`, 14, currentY);
  currentY += 10;

  const tableColumn = [
    "Day",
    "Date",
    "Check-In",
    "In Status",
    "Check-Out",
    "Out Status",
    "Hours",
    "Day Status",
  ];

  const sortedData = [...attendanceHistoryData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const tableRows = sortedData.map((row) => {
    const dateObj = new Date(row.date);
    const day = format(dateObj, "EEEE");
    const dateStr = format(dateObj, "dd-MMM-yyyy");

    const formatStatus = (status: string | null) => {
      if (!status) return "---";
      return status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    return [
      day,
      dateStr,
      formatTime12Hour(row.check_in_time),
      formatStatus(row.check_in_status),
      formatTime12Hour(row.check_out_time),
      formatStatus(row.check_out_status),
      row.work_hours || "---",
      formatStatus(row.day_status),
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: currentY,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 116, 252], textColor: 255 },
    alternateRowStyles: { fillColor: [236, 240, 241] },
    columnStyles: {
      0: { cellWidth: 22 },
      2: { cellWidth: 22 },
      3: { cellWidth: 20 },
      5: { cellWidth: 20 },
    },
    pageBreak: "auto",
    margin: { top: 10 },
    didParseCell: (data) => {
      if (data.section === "body") {
        const rowIndex = data.row.index;
        const rowData = tableRows[rowIndex];
        if ((rowData[3] || "").toLowerCase() === "late") {
          data.cell.styles.fillColor = [255, 200, 200];
          data.cell.styles.textColor = 0;
        }
      }
    },
  });
  const fileName = `Attendance_Report_${employeeName.replace(
    /\s+/g,
    "_"
  )}_${from}_to_${to}.pdf`;
  doc.save(fileName);
};

export const attendancehistoryPDFV2 = (attendanceHistoryData) => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Header ---
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#0074fc");
  doc.text("Attendance History Report", pageWidth / 2, 15, { align: "center" });

  const employeeName =
    attendanceHistoryData[0]?.full_name || "Unknown Employee";
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0);
  doc.text(`Employee: ${employeeName}`, 14, 25);

  let currentY = 35;

  // --- Daily Attendance Records ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Daily Attendance Records", 14, currentY);
  currentY += 8;

  const tableColumn = [
    "Name",
    "Day",
    "Date",
    "Check-In",
    "In Status",
    "Check-Out",
    "Out Status",
    "Hours",
    "Day Status",
  ];

  const sortedData = [...attendanceHistoryData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const tableRows = sortedData.map((row) => {
    const dateObj = new Date(row.date);
    const day = format(dateObj, "EEEE");
    const dateStr = format(dateObj, "dd-MMM-yyyy");

    const formatStatus = (status: string | null) => {
      if (!status) return "---";
      return status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    };

    return [
      row.full_name || "---",
      day,
      dateStr,
      formatTime12Hour(row.check_in_time),
      formatStatus(row.check_in_status),
      formatTime12Hour(row.check_out_time),
      formatStatus(row.check_out_status),
      row.work_hours || "---",
      formatStatus(row.day_status),
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: currentY,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [0, 116, 252], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [236, 240, 241] },
    columnStyles: {
      0: { cellWidth: 30 },
      2: { cellWidth: 22 },
      3: { cellWidth: 20 },
      5: { cellWidth: 20 },
    },
    pageBreak: "auto",
    margin: { top: 10 },
    didParseCell: (data) => {
      if (data.section === "body") {
        const rowIndex = data.row.index;
        const rowData = tableRows[rowIndex];
        if ((rowData[4] || "").toLowerCase() === "late") {
          data.cell.styles.fillColor = [255, 200, 200]; // red for late
          data.cell.styles.textColor = 0;
        }
      }
    },
  });

  const fileName = `Attendance_Report_${employeeName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};
