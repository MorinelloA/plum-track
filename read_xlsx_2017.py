import pandas as pd

girls_file = r"C:\Users\tmorinello\Downloads\Plum Girls's - 2017.xlsx"
boys_file  = r"C:\Users\tmorinello\Downloads\Plum Boy's - 2017.xlsx"

for label, path in [("GIRLS", girls_file), ("BOYS", boys_file)]:
    print(f"\n=== {label} FILE ===")
    xl = pd.ExcelFile(path)
    print("Sheets:", xl.sheet_names)
    for sname in xl.sheet_names:
        if sname in ("Relays", "4x4 Splits", "Relay Splits"):
            continue
        df = xl.parse(sname, header=None)
        print(f"\n--- Sheet: {sname} ---")
        print(df.to_string(max_rows=20))
