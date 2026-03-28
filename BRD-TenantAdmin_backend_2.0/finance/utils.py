from datetime import date
import calendar


def yearly_view(fy):
    return {
        "label": fy.name,
        "start_date": fy.start_date,
        "end_date": fy.end_date,
    }


def half_yearly_view(fy):
    return [
        {
            "label": "H1",
            "start_date": fy.start_date,
            "end_date": date(fy.start_date.year, 9, 30),
        },
        {
            "label": "H2",
            "start_date": date(fy.start_date.year, 10, 1),
            "end_date": fy.end_date,
        },
    ]


def quarterly_view(fy):
    return [
        {
            "label": "Q1",
            "start_date": fy.start_date,
            "end_date": date(fy.start_date.year, 6, 30),
        },
        {
            "label": "Q2",
            "start_date": date(fy.start_date.year, 7, 1),
            "end_date": date(fy.start_date.year, 9, 30),
        },
        {
            "label": "Q3",
            "start_date": date(fy.start_date.year, 10, 1),
            "end_date": date(fy.start_date.year, 12, 31),
        },
        {
            "label": "Q4",
            "start_date": date(fy.end_date.year, 1, 1),
            "end_date": fy.end_date,
        },
    ]


def monthly_view(fy):
    months = []

    start_year = fy.start_date.year
    end_year = fy.end_date.year

    fiscal_months = [
        (start_year, 4), (start_year, 5), (start_year, 6),
        (start_year, 7), (start_year, 8), (start_year, 9),
        (start_year, 10), (start_year, 11), (start_year, 12),
        (end_year, 1), (end_year, 2), (end_year, 3),
    ]

    for year, month in fiscal_months:
        last_day = calendar.monthrange(year, month)[1]
        months.append({
            "label": f"{calendar.month_abbr[month]} {year}",
            "start_date": date(year, month, 1),
            "end_date": date(year, month, last_day),
        })

    return months
