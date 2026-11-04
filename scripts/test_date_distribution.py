# -*- coding: utf-8 -*-
import datetime, sys

sys.stdout.reconfigure(encoding='utf-8')

def distribute_dates(d_start, d_end, n_plans):
    cur = d_start
    school_days = []
    while cur <= d_end:
        if cur.weekday() < 5: # Monday (0) to Friday (4)
            school_days.append(cur)
        cur += datetime.timedelta(days=1)
    
    if len(school_days) == 0:
        return []
    if n_plans == 1:
        return [school_days[0]]
    if len(school_days) >= n_plans:
        indices = [round(i * (len(school_days) - 1) / (n_plans - 1)) for i in range(n_plans)]
        return [school_days[idx] for idx in indices]
    else:
        res = []
        c = school_days[0]
        for _ in range(n_plans):
            res.append(c)
            c += datetime.timedelta(days=1)
            while c.weekday() >= 5:
                c += datetime.timedelta(days=1)
        return res

# 1. 78 plans in Semester 1 (19 Oct 2026 to 20 Feb 2027)
dates_78 = distribute_dates(datetime.date(2026, 10, 19), datetime.date(2027, 2, 20), 78)
print("=== 78 plans in Semester 1 (19 Oct 2026 to 20 Feb 2027) ===")
print("Plan 1:", dates_78[0].strftime("%a %d %b %Y"))
print("Plan 2:", dates_78[1].strftime("%a %d %b %Y"))
print("Plan 3:", dates_78[2].strftime("%a %d %b %Y"))
print("Plan 5:", dates_78[4].strftime("%a %d %b %Y"))
print("Plan 78:", dates_78[-1].strftime("%a %d %b %Y"))

# 2. Lesson 1 (5 plans) in 2 weeks (19 Oct to 30 Oct 2026)
dates_5 = distribute_dates(datetime.date(2026, 10, 19), datetime.date(2026, 10, 30), 5)
print("\n=== Lesson 1 (5 plans in 2 weeks: 19 Oct to 30 Oct 2026) ===")
for i, d in enumerate(dates_5):
    print(f"Plan {i+1}: {d.strftime('%a %d %b %Y')}")
