# Path Race Benchmark Results (2000 trials per mode)

> **Headline (30% regime):** At 30% obstacle density, Livnium reduces expansions by ~60% vs A* while increasing path length by only ~5% (avg gap +2.2 on path length ~40).

**Run:** `dart run example/benchmark_path_race.dart`  
**Grid:** 20×20, start (0,0), end (19,19).  
**Metrics:** solvableRate, successRate per algorithm, avg(expanded), avg(pathLen), avg(gap) conditional on success.

---

## 1. Random obstacles (easy) ~12% walls, no enforce

|            | successRate | avg(exp) | avg(pathLen) | avg(gap) |
|------------|-------------|----------|--------------|----------|
| Dijkstra   | 96.3%       | 351.7    | 38.0         | —        |
| A*         | 96.3%       | 300.3    | 38.0         | 0.0      |
| Livnium    | 96.3%       | 39.9     | 38.1         | 0.1      |

- **solvableRate:** 1925/2000 (96.3%)
- **wallPct (avg):** 12.0%
- **Takeaway:** Livnium expands ~40 vs 300+ for A*/Dijkstra and stays near-optimal (gap 0.1). “Open field with scattered rocks” — GBFS beelines.

---

## 2. Random obstacles (hard) 30% walls, enforce solvable

|            | successRate | avg(exp) | avg(pathLen) | avg(gap) |
|------------|-------------|----------|--------------|----------|
| Dijkstra   | 100.0%      | 258.2    | 39.3         | —        |
| A*         | 100.0%      | 140.6    | 39.3         | 0.0      |
| Livnium    | 100.0%      | 54.6     | 41.5         | **2.2**  |

- **solvableRate:** 2000/2000 (100%)
- **wallPct (avg):** 30.0%
- **Takeaway:** At 30% density Livnium still expands far less (54.6 vs 140/258) but **pays with longer paths: avg gap +2.2**. A* stays optimal (gap 0). This is the regime where greedy starts to show non-optimality.

---

## 3. Complicated maze (recursive division)

|            | successRate | avg(exp) | avg(pathLen) | avg(gap) |
|------------|-------------|----------|--------------|----------|
| Dijkstra   | 0.1%        | 45.0     | 38.0         | —        |
| A*         | 0.1%        | 43.0     | 38.0         | 0.0      |
| Livnium    | 0.1%        | 42.0     | 38.0         | 0.0      |

- **solvableRate:** 1/2000 (0.1%)
- **wallPct (avg):** 55.9%
- **Takeaway:** Recursive division with protected corners still isolates start/end almost every time. This mode is a **connectivity killer**, not a fair “race” benchmark unless you report solvable rate (as here). The single solvable case had all three optimal.

---

## 4. Winding maze (DFS backtracker)

|            | successRate | avg(exp) | avg(pathLen) | avg(gap) |
|------------|-------------|----------|--------------|----------|
| Dijkstra   | 100.0%      | 149.9    | 94.2         | —        |
| A*         | 100.0%      | 132.7    | 94.2         | 0.0      |
| Livnium    | 100.0%      | 102.7    | 94.2         | 0.0      |

- **solvableRate:** 2000/2000 (100%)
- **wallPct (avg):** 41.6%
- **Takeaway:** Long corridors, guaranteed solvable. Livnium expands ~103 vs 133 (A*) and 150 (Dijkstra) **and stays optimal** (gap 0). Best current benchmark for “fewer expansions, same path length.”

---

## Summary

- **Dijkstra gap N/A:** When there is no path, Dijkstra’s gap is now sent as `null` and printed as N/A (fixed in visualizer).
- **Random easy (12%):** Livnium looks great on expansions and is near-optimal.
- **Random hard (30%):** Livnium still wins on expansions but **avg gap +2.2** — the tradeoff is visible.
- **Complicated maze:** Use only with **solvable rate** reported; here 0.1%.
- **Winding maze:** Livnium is both expansion-efficient and optimal in these runs.

---

## 5. Weighted A* spectrum (f = g + w·h)

**30% walls:** w=1.0 (A*) 141 exp, gap 0; w=1.2 → 73.5, 0.2; w=1.5 → 67.3, 0.9; w=2.0 → 64.6, 1.7; Livnium → 55.1, 2.3. As w increases, expansions drop and gap rises; Livnium at the greedy end. **Winding maze:** All gap 0; Livnium 102 exp vs w=2.0 122 — polarity aligns with corridors.
