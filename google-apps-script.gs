/**
 * Google Apps Script — Task Reminder API
 * Deploy as Web App from your Google Sheet.
 *
 * SETUP:
 * 1. Open your Google Sheet → Extensions → Apps Script
 * 2. Paste this code → Deploy → New Deployment → Web app
 * 3. Execute as: Me | Who has access: Anyone
 * 4. Copy the URL into dashboard.html
 */

function doGet(e) {
  try {
    // Open the spreadsheet by ID (works in both standalone and container-bound scripts)
    var ss = SpreadsheetApp.openById("1UBkVXIV3-gW2X8Q4YUU_ksDP6pBxlEYzXeDJPwv641Q");

    // Read Tasks from first sheet
    var tasksSheet = ss.getSheets()[0];
    var tasksData = tasksSheet.getDataRange().getValues();
    var headers = tasksData[0];
    var tasks = [];

    for (var i = 1; i < tasksData.length; i++) {
      var row = tasksData[i];
      if (!row[0] && !row[1]) continue;
      var task = {};
      for (var j = 0; j < headers.length; j++) {
        var h = headers[j].toString().trim();
        var v = row[j];
        if (v instanceof Date) v = Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
        task[h] = v ? v.toString() : "";
      }
      tasks.push(task);
    }

    // Read Logs from second sheet (if exists)
    var logs = [];
    var allSheets = ss.getSheets();
    if (allSheets.length > 1) {
      var logsSheet = allSheets[1];
      var logsData = logsSheet.getDataRange().getValues();
      var lHeaders = logsData[0];
      for (var i = 1; i < logsData.length; i++) {
        var row = logsData[i];
        if (!row[0] && !row[1]) continue;
        var log = {};
        for (var j = 0; j < lHeaders.length; j++) {
          var h = lHeaders[j].toString().trim();
          var v = row[j];
          if (v instanceof Date) v = Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm");
          log[h] = v ? v.toString() : "";
        }
        logs.push(log);
      }
    }

    var res = {
      success: true,
      timestamp: new Date().toISOString(),
      sheetName: ss.getName(),
      data: { tasks: tasks, logs: logs }
    };
    return ContentService.createTextOutput(JSON.stringify(res)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
