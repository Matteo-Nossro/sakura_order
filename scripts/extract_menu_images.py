#!/usr/bin/env python3
"""
Extract dish thumbnails from Sakura restaurant menu photos.

Usage:
    python extract_menu_images.py          # crop all dishes
    python extract_menu_images.py --debug  # also save annotated source images

Place source images in scripts/sources/ before running:
    scripts/sources/IMG_3584.jpg  -> Sushi + Soir uniquement
    scripts/sources/IMG_3585.jpg  -> Maki + Temaki + California
    scripts/sources/IMG_3586.jpg  -> Entree + Yakitori

Outputs:
    public/dishes/*.jpg             cropped thumbnails (JPEG 90%)
    scripts/extraction_report.json  processing report
"""

import sys
import json
import re
import unicodedata
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).parent.parent
SOURCES_DIR = Path(__file__).parent / "sources"
OUTPUT_DIR = ROOT / "public" / "dishes"
REPORT_PATH = Path(__file__).parent / "extraction_report.json"

DEBUG = "--debug" in sys.argv


def normalize_name(name: str) -> str:
    """Convert display name to snake_case ASCII filename segment."""
    ligatures = {"oe": "oe", "ae": "ae", "Oe": "Oe", "Ae": "Ae"}
    for char, rep in ligatures.items():
        name = name.replace(char, rep)
    nfkd = unicodedata.normalize("NFKD", name)
    ascii_str = nfkd.encode("ASCII", "ignore").decode("ASCII")
    return re.sub(r"[^a-z0-9]+", "_", ascii_str.lower()).strip("_")


def make_filename(number: str, name: str) -> str:
    return f"{number}_{normalize_name(name)}.jpg"


# ---------------------------------------------------------------------------
# Crop coordinates (x1, y1, x2, y2) extraites depuis les annotations rouges
# de l'utilisateur sur les images sources 2160x2880.
# ---------------------------------------------------------------------------
CROPS: dict = {
    # ------------------------------------------------------------------
    "IMG_3584.jpg": {
        "section_info": "Sushi + Soir uniquement",
        "items": [
            # SUSHI — 3 colonnes, 2 rangees
            {"number": "13",  "name": "Omelette",                      "box": ( 300,  379,  630,  599)},
            {"number": "13A", "name": "Sushi surimi",                  "box": ( 683,  371, 1011,  595)},
            {"number": "16",  "name": "Saumon",                        "box": (1079,  344, 1400,  563)},
            {"number": "17",  "name": "Thon",                          "box": ( 290,  634,  581,  861)},
            {"number": "18",  "name": "Daurade",                       "box": ( 688,  622,  983,  854)},
            {"number": "19",  "name": "Crevette",                      "box": (1090,  609, 1404,  836)},
            # SOIR UNIQUEMENT (item 58 indisponible -> ignore)
            {"number": "48",  "name": "Gambas",                        "box": ( 582, 1319,  848, 1565)},
            {"number": "49",  "name": "Thon",                          "box": ( 901, 1317, 1190, 1556)},
            {"number": "50",  "name": "Saumon",                        "box": (1239, 1316, 1524, 1560)},
            {"number": "51",  "name": "Nem crevettes",                 "box": (1595, 1309, 1857, 1583)},
            {"number": "48A", "name": "Maki tomate sechee chevre",     "box": ( 230, 1649,  505, 1924)},
            {"number": "28A", "name": "Maki saumon cheese",            "box": ( 570, 1647,  842, 1923)},
            {"number": "52",  "name": "Dragon roll",                   "box": ( 905, 1648, 1183, 1925)},
            {"number": "53",  "name": "Tarte saumon",                  "box": (1248, 1645, 1528, 1930)},
            {"number": "54",  "name": "Sushi saumon cheese",           "box": (1599, 1653, 1899, 1936)},
            {"number": "55",  "name": "Oeuf saumon",                   "box": ( 219, 1967,  487, 2257)},
            {"number": "56",  "name": "Sushi anguille",                "box": ( 568, 1968,  813, 2262)},
            {"number": "57",  "name": "Sashimi saumon",                "box": ( 894, 1973, 1180, 2269)},
            {"number": "64",  "name": "Maki egg cheese",               "box": (1261, 1984, 1530, 2274)},
            {"number": "65",  "name": "California oignon thon",        "box": (1612, 1981, 1911, 2281)},
            {"number": "66",  "name": "California saumon fume cheese", "box": ( 206, 2305,  501, 2625)},
            {"number": "67",  "name": "California tempura",            "box": ( 658, 2314,  961, 2624)},
            {"number": "68",  "name": "Sushi saumon braise",           "box": (1102, 2325, 1451, 2647)},
            {"number": "69",  "name": "Sushi thon braise",             "box": (1568, 2335, 1929, 2649)},
        ],
    },
    # ------------------------------------------------------------------
    "IMG_3585.jpg": {
        "section_info": "Maki + Temaki + California",
        "items": [
            # MAKI — 4 colonnes, 2 rangees
            {"number": "26",  "name": "Fotu maki",             "box": ( 276,  264,  533,  515)},
            {"number": "27",  "name": "Thon",                  "box": ( 583,  266,  816,  501)},
            {"number": "28",  "name": "Saumon",                "box": ( 885,  275, 1110,  503)},
            {"number": "30",  "name": "Saumon avocat",         "box": (1171,  280, 1411,  509)},
            {"number": "32",  "name": "Concombre cheese",      "box": ( 264,  535,  516,  779)},
            {"number": "33",  "name": "Fromage",               "box": ( 570,  538,  804,  765)},
            {"number": "33A", "name": "Avocat cheese",         "box": ( 867,  539, 1117,  779)},
            {"number": "34",  "name": "Avocat crevette",       "box": (1172,  545, 1407,  785)},
            # TEMAKI
            {"number": "44",  "name": "Saumon avocat",         "box": ( 241,  957,  625, 1215)},
            {"number": "45",  "name": "Thon avocat",           "box": ( 803,  962, 1167, 1219)},
            {"number": "46",  "name": "Surimi avocat",         "box": (1355,  966, 1735, 1217)},
            # CALIFORNIA — 2 premiers items a droite de la rangee Temaki
            {"number": "29",  "name": "Saumon cheddar",        "box": (1235, 1334, 1505, 1600)},
            {"number": "31",  "name": "Poulet curry",          "box": (1581, 1337, 1837, 1603)},
            # California rangees 2-4
            {"number": "35",  "name": "Avocat thon",           "box": ( 548, 1655,  819, 1925)},
            {"number": "36",  "name": "Avocat saumon",         "box": ( 897, 1655, 1163, 1928)},
            {"number": "37",  "name": "Avocat thon cuit",      "box": (1246, 1654, 1520, 1928)},
            {"number": "38",  "name": "Poulet mayonnaise",     "box": (1590, 1649, 1855, 1923)},
            {"number": "39",  "name": "Avocat crevettes",      "box": ( 186, 1989,  452, 2276)},
            {"number": "40",  "name": "Maki royal",            "box": ( 539, 1985,  811, 2276)},
            {"number": "41",  "name": "Concombre fromage",     "box": ( 887, 1977, 1166, 2277)},
            {"number": "42",  "name": "Printemps saumon",      "box": (1245, 1975, 1532, 2274)},
            {"number": "42A", "name": "Printemps tempura",     "box": (1599, 1961, 1878, 2274)},
            {"number": "43",  "name": "Masago saumon",         "box": ( 156, 2339,  439, 2652)},
            {"number": "60",  "name": "Neige saumon cheese",   "box": ( 522, 2331,  811, 2656)},
            {"number": "61",  "name": "Oignons saumon avocat", "box": ( 891, 2335, 1172, 2655)},
            {"number": "62",  "name": "California cheese",     "box": (1248, 2329, 1548, 2654)},
            {"number": "63",  "name": "California surimi",     "box": (1601, 2328, 1909, 2649)},
        ],
    },
    # ------------------------------------------------------------------
    "IMG_3586.jpg": {
        "section_info": "Entree + Yakitori",
        "items": [
            # ENTREE
            {"number": "1",  "name": "Beignets fromage",    "box": ( 139,  380,  409,  624)},
            {"number": "2",  "name": "Samoussa boeuf",      "box": ( 465,  369,  746,  609)},
            {"number": "3",  "name": "Samoussa legumes",    "box": ( 136,  655,  410,  905)},
            {"number": "4",  "name": "Beignets crevettes",  "box": ( 470,  640,  739,  895)},
            {"number": "5",  "name": "Beignets poisson",    "box": ( 798,  629, 1087,  881)},
            {"number": "6",  "name": "Beignets poulet",     "box": ( 118,  942,  390, 1201)},
            {"number": "7",  "name": "Beignets calamars",   "box": ( 461,  937,  746, 1196)},
            {"number": "8",  "name": "Nems poulet",         "box": ( 801,  924, 1100, 1189)},
            {"number": "8A", "name": "Potatoes",            "box": (1135,  910, 1442, 1155)},
            {"number": "9",  "name": "Raviolis japonais",   "box": ( 116, 1253,  361, 1513)},
            {"number": "10", "name": "Raviolis crevettes",  "box": ( 453, 1236,  736, 1507)},
            {"number": "11", "name": "Bouchees crevettes",  "box": ( 801, 1231, 1099, 1499)},
            {"number": "14", "name": "Riz nature",          "box": (1151, 1211, 1454, 1464)},
            {"number": "15", "name": "Riz vinagre",         "box": (1512, 1204, 1812, 1469)},
            # YAKITORI
            {"number": "12", "name": "Courgette",           "box": ( 796, 1650, 1116, 1933)},
            {"number": "20", "name": "Poulet",              "box": ( 792, 1980, 1126, 2288)},
            {"number": "21", "name": "Aile poulet",         "box": (1172, 1978, 1508, 2288)},
            {"number": "22", "name": "Boulettes poulet",    "box": (1551, 1974, 1883, 2285)},
            {"number": "23", "name": "Champignon",          "box": ( 793, 2341, 1127, 2665)},
            {"number": "24", "name": "Boeuf",               "box": (1168, 2339, 1511, 2663)},
            {"number": "25", "name": "Boeuf fromage",       "box": (1565, 2334, 1901, 2668)},
        ],
    },
}


def process_image(source_path: Path, items: list, debug: bool = False) -> tuple:
    processed = []
    missing = []

    if not source_path.exists():
        print(f"  [SOURCE MANQUANTE] {source_path}")
        for item in items:
            missing.append({
                "number": item["number"],
                "name": item["name"],
                "reason": f"Image source introuvable : {source_path.name}",
            })
        return processed, missing

    img = Image.open(source_path)
    w, h = img.size
    print(f"  Chargee : {source_path.name} ({w}x{h})")

    debug_img = img.copy() if debug else None
    draw = ImageDraw.Draw(debug_img) if debug else None

    for item in items:
        number = item["number"]
        name = item["name"]
        x1, y1, x2, y2 = item["box"]

        x1, y1 = max(0, x1), max(0, y1)
        x2, y2 = min(w, x2), min(h, y2)

        if x2 <= x1 or y2 <= y1:
            missing.append({"number": number, "name": name, "reason": "Boite de crop invalide"})
            continue

        filename = make_filename(number, name)
        out_path = OUTPUT_DIR / filename

        crop = img.crop((x1, y1, x2, y2)).convert("RGB")
        crop.save(out_path, "JPEG", quality=90)

        if draw:
            draw.rectangle([x1, y1, x2, y2], outline="red", width=6)
            draw.text((x1 + 8, y1 + 8), f"{number}", fill="red")

        processed.append({"number": number, "name": name, "file": filename})
        print(f"    OK  {filename}")

    if debug and debug_img:
        debug_path = SOURCES_DIR / f"debug_{source_path.name}"
        debug_img.save(debug_path)
        print(f"  Debug sauvegarde : {debug_path}")

    return processed, missing


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    all_processed: list = []
    all_missing: list = []

    for image_name, config in CROPS.items():
        source_path = SOURCES_DIR / image_name
        print(f"\n--- {image_name} ({config['section_info']}) ---")
        proc, miss = process_image(source_path, config["items"], DEBUG)
        all_processed.extend(proc)
        all_missing.extend(miss)

    report = {
        "total": len(all_processed) + len(all_missing),
        "processed": len(all_processed),
        "missing": len(all_missing),
        "items_processed": all_processed,
        "items_missing": all_missing,
    }
    REPORT_PATH.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"\n{'='*50}")
    print(f"Traites : {len(all_processed)} / {len(all_processed) + len(all_missing)}")
    if all_missing:
        print(f"Manquants ({len(all_missing)}) :")
        for m in all_missing:
            print(f"  - {m['number']} {m['name']} : {m['reason']}")
    print(f"Rapport  : {REPORT_PATH}")
    print(f"Sortie   : {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
