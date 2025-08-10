library;

import 'vec3.dart';

Iterable<Vec3> cube3Coords() sync* {
  for (var x = -1; x <= 1; x++) {
    for (var y = -1; y <= 1; y++) {
      for (var z = -1; z <= 1; z++) {
        yield Vec3(x, y, z);
      }
    }
  }
}

bool isCore(Vec3 v) => v.x == 0 && v.y == 0 && v.z == 0;
bool isCenter(Vec3 v) =>
    ((v.x != 0) ? 1 : 0) + ((v.y != 0) ? 1 : 0) + ((v.z != 0) ? 1 : 0) == 1 &&
    !isCore(v);
bool isEdge(Vec3 v) =>
    ((v.x != 0) ? 1 : 0) + ((v.y != 0) ? 1 : 0) + ((v.z != 0) ? 1 : 0) == 2;
bool isCorner(Vec3 v) =>
    ((v.x != 0) ? 1 : 0) + ((v.y != 0) ? 1 : 0) + ((v.z != 0) ? 1 : 0) == 3;

int facesForVec3(Vec3 v) {
  if (isCore(v)) return 0;
  if (isCorner(v)) return 3;
  if (isEdge(v)) return 2;
  if (isCenter(v)) return 1;
  return -1;
}
