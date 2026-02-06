import 'dart:convert';
import 'dart:io';

import 'package:livnium_core/livnium_core.dart';

/// Interactive Livnium Vision Server: the bridge between the Crystal Brain and the screen.
///
/// * GET /       → Serves the retina UI (5×5 grid).
/// * GET /vision → Returns Z=0 face state (grid, energy, sane).
/// * POST /stimulate → Body {x, y}; calls mind.perceive(coord, 2, 1).
///
/// Run: dart run example/livnium_server.dart
/// Open the printed URL — click the Cyan box (Left Eye), watch the Magenta box (Right Eye).
/// If port 8080 is in use, falls back to 8081, 8082, etc.
void main() async {
  final n = 5;
  final mind = GrowthMind(n);

  mind.entangleConcepts(
    LatticeCoord(n, 1, 1, 0),
    LatticeCoord(n, 3, 1, 0),
    strength: 1.0,
  );

  print('=== LIVNIUM VISION SERVER ONLINE ===');

  HttpServer server;
  var port = 8080;
  while (true) {
    try {
      server = await HttpServer.bind(InternetAddress.loopbackIPv4, port);
      break;
    } on SocketException catch (e) {
      final code = e.osError?.errorCode;
      final inUse = code == 48 || code == 10048 || e.message.contains('in use');
      if (inUse) {
        port++;
        if (port > 8099) rethrow;
        print('Port ${port - 1} in use, trying $port...');
      } else {
        rethrow;
      }
    }
  }

  print('The Eye is Open at: http://localhost:$port');
  print('Use CTRL+C to close the eye.');

  await for (final request in server) {
    request.response.headers.add('Access-Control-Allow-Origin', '*');
    request.response.headers
        .add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    request.response.headers
        .add('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method == 'OPTIONS') {
      request.response.statusCode = HttpStatus.noContent;
      request.response.close();
      continue;
    }

    if (request.method == 'GET' && request.uri.path == '/') {
      request.response
        ..headers.contentType = ContentType.html
        ..write(_htmlContent)
        ..close();
    } else if (request.method == 'GET' && request.uri.path == '/vision') {
      final grid = List.generate(n, (y) {
        return List.generate(n, (x) {
          final coord = LatticeCoord(n, x, y, 0);
          return mind.state.getCellAt(coord).swEffective;
        });
      });

      request.response
        ..headers.contentType = ContentType.json
        ..write(jsonEncode({
          'grid': grid,
          'energy': mind.state.totalEffectiveWeight,
          'sane': mind.isSane,
        }))
        ..close();
    } else if (request.method == 'POST' && request.uri.path == '/stimulate') {
      try {
        final content = await utf8.decoder.bind(request).join();
        if (content.isEmpty) {
          request.response.statusCode = HttpStatus.badRequest;
          request.response.write(jsonEncode({'error': 'empty body'}));
          request.response.close();
          continue;
        }
        final data = jsonDecode(content) as Map<String, Object?>;
        final x = (data['x'] is num) ? (data['x'] as num).toInt() : null;
        final y = (data['y'] is num) ? (data['y'] as num).toInt() : null;
        if (x == null || y == null || x < 0 || x >= n || y < 0 || y >= n) {
          request.response.statusCode = HttpStatus.badRequest;
          request.response.write(jsonEncode({'error': 'invalid x,y'}));
          request.response.close();
          continue;
        }

        final coord = LatticeCoord(n, x, y, 0);
        final result = mind.perceive(coord, 2, 1);
        print('Touch ($x,$y) → ${result.syncsFired} syncs');

        request.response
          ..headers.contentType = ContentType.json
          ..write(
              jsonEncode({'status': 'perceived', 'syncs': result.syncsFired}))
          ..close();
      } catch (e, st) {
        print('Stimulate error: $e\n$st');
        request.response
          ..statusCode = HttpStatus.internalServerError
          ..headers.contentType = ContentType.json
          ..write(jsonEncode({'error': e.toString()}))
          ..close();
      }
    } else {
      request.response.statusCode = HttpStatus.notFound;
      request.response.close();
    }
  }
}

const _htmlContent = r'''
<!DOCTYPE html>
<html>
<head>
    <title>Livnium Vision</title>
    <style>
        body { background: #000; color: #0f0; font-family: 'Courier New', monospace; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        h1 { text-shadow: 0 0 10px #0f0; margin-bottom: 10px; }
        p { color: #888; font-size: 0.9em; }
        .retina { display: grid; grid-template-columns: repeat(5, 80px); gap: 10px; background: #111; padding: 20px; border: 2px solid #333; box-shadow: 0 0 30px #004400; border-radius: 10px; }
        .cell {
            width: 80px; height: 80px;
            background: #222; border: 1px solid #444;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; font-size: 0.8em; color: #555; user-select: none;
            transition: all 0.1s;
        }
        .cell:hover { border-color: #fff; transform: scale(1.05); }
        .cell:active { transform: scale(0.95); }

        .status-panel { margin-top: 20px; text-align: left; background: #111; padding: 10px; border: 1px solid #333; width: 400px; }
        .stat { display: flex; justify-content: space-between; margin: 5px 0; }
        .val { font-weight: bold; color: #fff; }

        .entangled { border: 2px dashed #0ff !important; }
        .entangled-partner { border: 2px dashed #f0f !important; }
    </style>
</head>
<body>
    <h1>LIVNIUM VISION</h1>
    <p>Click the <b>Cyan Box</b> (Left Eye). Watch the <b>Magenta Box</b> (Right Eye).</p>

    <div id="retina" class="retina"></div>

    <div class="status-panel">
        <div class="stat"><span>Total Energy:</span> <span id="energy" class="val">...</span></div>
        <div class="stat"><span>Physics Integrity:</span> <span id="sane" class="val">...</span></div>
        <div class="stat"><span>Last Syncs:</span> <span id="syncs" class="val">0</span></div>
        <div class="stat"><span>Status:</span> <span id="msg" class="val">—</span></div>
    </div>

    <script>
        const N = 5;
        const retina = document.getElementById('retina');
        let lastSyncs = 0;

        function setMsg(s, isErr) {
            var el = document.getElementById('msg');
            el.textContent = s;
            el.style.color = isErr ? '#f66' : '#0f0';
        }

        function pulsePartner(clickedX, clickedY) {
            var px = -1, py = -1, glow = '#f0f';
            if (clickedX === 1 && clickedY === 1) { px = 3; py = 1; glow = '#f0f'; }
            else if (clickedX === 3 && clickedY === 1) { px = 1; py = 1; glow = '#0ff'; }
            if (px < 0) return;
            var cell = document.getElementById('c-' + px + '-' + py);
            cell.style.boxShadow = '0 0 25px ' + glow + ', inset 0 0 15px ' + glow + '66';
            setTimeout(function(){ cell.style.boxShadow = ''; }, 600);
        }

        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = 'c-' + x + '-' + y;
                cell.onclick = () => stimulate(x, y);

                if (x===1 && y===1) { cell.classList.add('entangled'); cell.title = "Left Eye (Trigger)"; }
                if (x===3 && y===1) { cell.classList.add('entangled-partner'); cell.title = "Right Eye (Reactor)"; }

                retina.appendChild(cell);
            }
        }

        async function stimulate(x, y) {
            var cell = document.getElementById('c-' + x + '-' + y);
            cell.style.boxShadow = 'inset 0 0 20px #0ff';
            setMsg('Sending...', false);

            try {
                const res = await fetch('/stimulate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ x: x, y: y })
                });
                const data = await res.json();
                setTimeout(function(){ cell.style.boxShadow = ''; }, 150);

                if (!res.ok) {
                    setMsg('Error: ' + (data.error || res.status), true);
                    return;
                }
                lastSyncs = data.syncs || 0;
                document.getElementById('syncs').innerText = lastSyncs;
                setMsg('Synced! ' + lastSyncs + ' hop(s)', false);
                if (lastSyncs > 0) pulsePartner(x, y);
                updateVision();
            } catch (e) {
                cell.style.boxShadow = '';
                setMsg('Network error', true);
                console.error(e);
            }
        }

        async function updateVision() {
            try {
                const res = await fetch('/vision');
                const data = await res.json();

                document.getElementById('energy').innerText = data.energy.toFixed(4);
                document.getElementById('sane').innerText = data.sane ? "STABLE" : "CRITICAL FAILURE";
                document.getElementById('sane').style.color = data.sane ? '#fff' : 'red';

                var min = 1e9, max = -1e9;
                for (let y = 0; y < N; y++)
                    for (let x = 0; x < N; x++) {
                        var v = data.grid[y][x];
                        if (v < min) min = v;
                        if (v > max) max = v;
                    }
                var range = (max - min) || 1;

                for (let y = 0; y < N; y++) {
                    for (let x = 0; x < N; x++) {
                        const val = data.grid[y][x];
                        const cell = document.getElementById('c-' + x + '-' + y);
                        var t = (val - min) / range;
                        var intensity = Math.round(255 * t);
                        cell.style.backgroundColor = 'rgb(0, ' + intensity + ', 0)';
                        cell.innerText = val.toFixed(2);
                        cell.style.color = t > 0.5 ? '#fff' : '#555';
                    }
                }
            } catch (e) {
                console.error("Connection Lost", e);
            }
        }

        setInterval(updateVision, 300);
        updateVision();
    </script>
</body>
</html>
''';
