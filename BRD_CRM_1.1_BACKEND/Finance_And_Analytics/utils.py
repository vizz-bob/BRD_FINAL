import csv
import io
from openpyxl import Workbook
from django.http import HttpResponse

def export_csv(filename, headers, rows):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{filename}.csv"'

    writer = csv.writer(response)
    writer.writerow(headers)
    for row in rows:
        writer.writerow(row)

    return response

def export_excel(filename, headers, rows):
    wb = Workbook()
    ws = wb.active
    ws.title = "Report"

    ws.append(headers)
    for row in rows:
        ws.append(row)

    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = f'attachment; filename="{filename}.xlsx"'
    wb.save(response)

    return response
