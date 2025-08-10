// lib/src/embedding.dart
abstract class Embedder {
  String get modelId;      // e.g. "openai/text-3-large-1024"
  int get dim;             // embedding dimension
  Future<List<double>> embed(String text);  // single
  Future<List<List<double>>> embedBatch(List<String> texts) async =>
      Future.wait(texts.map(embed)); // naive default
  bool get l2Normalized => true;     // enforce cosine-compat
}

// normalizer (cosine-safe)
List<double> l2(List<double> v) {
  final s = v.fold<double>(0.0, (a, b) => a + b*b);
  final n = s == 0 ? 1.0 : Math.sqrt(s);
  return v.map((x) => x / n).toList();
}

// example: HTTP embedder adapter (pseudo)
class HttpEmbedder implements Embedder {
  final String modelId;
  final int dim;
  final Uri endpoint;
  HttpEmbedder({required this.modelId, required this.dim, required this.endpoint});

  @override bool get l2Normalized => true;

  @override Future<List<double>> embed(String text) async {
    // call your service / local model
    final vec = await _postJson(endpoint, {'model': modelId, 'text': text});
    return l2(vec.cast<double>()); // enforce normalization here
  }
}

// router with feature flag
class EmbedderRouter {
  final Map<String, Embedder> _byUsecase; // e.g. {'search': openai, 'note': local}
  final Map<String, String> _flags;       // e.g. {'search':'local-v2'}
  EmbedderRouter(this._byUsecase, this._flags);

  Embedder forUsecase(String usecase) {
    final id = _flags[usecase];
    return id != null ? _byUsecase[id]! : _byUsecase[usecase]!;
  }
}
