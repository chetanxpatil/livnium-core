library;

class Vec3 {
  final int x, y, z;
  const Vec3(this.x, this.y, this.z);

  Vec3 add(Vec3 o) => Vec3(x + o.x, y + o.y, z + o.z);
  Vec3 sub(Vec3 o) => Vec3(x - o.x, y - o.y, z - o.z);
  int dot(Vec3 o) => x * o.x + y * o.y + z * o.z;

  @override
  String toString() => '($x,$y,$z)';

  @override
  bool operator ==(Object other) =>
      other is Vec3 && x == other.x && y == other.y && z == other.z;

  @override
  int get hashCode => Object.hash(x, y, z);
}
