library;

export 'src/alphabet.dart'
    show
        kRadix,
        symbolToValue,
        valueToSymbol,
        stringToDigits,
        digitsToString,
        isValidWord;

export 'src/codec.dart'
    show
        encodeCsv,
        decodeCsv,
        encodeFixed,
        decodeFixed,
        encodeFixedInt,
        decodeFixedInt,
        encodeBigIntTail,
        decodeBigIntTail,
        encodeDecimal,
        decodeDecimal,
        encodeBigIntRaw,
        decodeBigIntRaw;

export 'src/rotation.dart'
    show
        RotationAxis,
        Rotation,
        rotateX,
        rotateY,
        rotateZ,
        applyRotations,
        invertRotations,
        Vec3;

export 'src/energy.dart'
    show
        SymbolClass,
        facesForGlyph,
        symbolEnergy9,
        wordEnergy9,
        symbolEnergyK,
        wordEnergyK,
        equilibriumConstant,
        perFaceUnitEnergy;

export 'src/grid.dart'
    show
        cube3Coords,
        isCore,
        isCenter,
        isEdge,
        isCorner,
        facesForVec3,
        l1,
        linf,
        l2;

export 'src/coupler.dart'
    show CouplerParams, couplingAt, rankTopCouplers, complexSumMagnitude;

export 'src/moves.dart'
    show Face, FaceMove, permutationFor, applyPerm, applyMoves;

export 'src/potts.dart' show Potts27, cosKernel;
export 'src/tree.dart' show CubePath, MicroCube, LivniumTree;
export 'src/corebit.dart' show CoreBit;
// New public exports for examples
export 'src/generate_mapping.dart' show generateExposureMapping;
export 'src/projection.dart' show dropAxis, radialBins, coarseGrain;
