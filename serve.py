#!/usr/bin/env python3
"""Serve static files and print path-search results to terminal when buttons are used."""
import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8888
ROOT = os.path.dirname(os.path.abspath(__file__))


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_POST(self):
        if self.path == "/log":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8", errors="replace")
            try:
                data = json.loads(body)
                source = data.get("source", "?")
                grid_size = data.get("gridSize")
                start_pt = data.get("start", {})
                end_pt = data.get("end", {})
                walls_count = data.get("walls")
                opt = data.get("optimalLen")
                d = data.get("dijkstra", {})
                a = data.get("astar", {})
                l = data.get("livnium", {})

                def row(name, algo):
                    exp = algo.get("expanded", algo.get("visits", 0))
                    found = algo.get("found", None)
                    plen = algo.get("pathLen")
                    gap = algo.get("gap")
                    found_s = "true" if found else "false" if found is False else "?"
                    plen_s = "N/A" if (plen is None or plen == -1) else str(plen)
                    gap_s = "N/A" if gap is None else (f"+{gap}" if gap > 0 else "0")
                    return f"{name:8} → exp {exp:4} | len {plen_s:>3} | gap {gap_s:>3} | found {found_s}"

                print(f"\n[{source}]")
                if grid_size is not None:
                    print(f"gridSize: {grid_size}")
                if start_pt and "x" in start_pt and "y" in start_pt:
                    print(f"start: ({start_pt['x']},{start_pt['y']})")
                if end_pt and "x" in end_pt and "y" in end_pt:
                    print(f"end: ({end_pt['x']},{end_pt['y']})")
                if walls_count is not None:
                    print(f"walls: {walls_count}")
                wall_pct = data.get("wallPct")
                if wall_pct is not None:
                    print(f"wallPct: {wall_pct}%")
                solvable = data.get("solvable")
                if solvable is not None:
                    print(f"solvable: {solvable}")
                seed_val = data.get("seed")
                if seed_val is not None:
                    print(f"seed: {seed_val}")
                if opt is None or opt == -1:
                    print("Optimal length: N/A (no path)")
                else:
                    print(f"Optimal length: {opt}")
                print()
                print(row("Dijkstra", d))
                print(row("A*", a))
                print(row("Livnium", l))
            except Exception as e:
                print("[log]", body[:200], "->", e)
            self.send_response(204)
            self.end_headers()
            return
        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        pass  # quiet


if __name__ == "__main__":
    print(f"Serving at http://localhost:{PORT}/")
    print("Open http://localhost:{PORT}/example/path_search_visualizer.html")
    print("Results will print here when you tap a button.\n")
    HTTPServer(("", PORT), Handler).serve_forever()
