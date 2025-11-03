"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Station3NetworkBuilder =
  exports.NetworkDiagnostics =
  exports.ConflictNetworkImpl =
  exports.ConflictPhase =
  exports.ConflictScope =
  exports.ConflictSubject =
  exports.RelationshipDirection =
  exports.RelationshipNature =
  exports.RelationshipType =
    void 0;
const base_station_1 = require("./base-station");
const gemini_service_1 = require("./gemini-service");
const text_utils_1 = require("../utils/text-utils");
var RelationshipType;
(function (RelationshipType) {
  RelationshipType["FAMILY"] = "family";
  RelationshipType["FRIENDSHIP"] = "friendship";
  RelationshipType["ROMANTIC"] = "romantic";
  RelationshipType["PROFESSIONAL"] = "professional";
  RelationshipType["ANTAGONISTIC"] = "antagonistic";
  RelationshipType["MENTORSHIP"] = "mentorship";
  RelationshipType["OTHER"] = "other";
})(RelationshipType || (exports.RelationshipType = RelationshipType = {}));
var RelationshipNature;
(function (RelationshipNature) {
  RelationshipNature["POSITIVE"] = "positive";
  RelationshipNature["NEGATIVE"] = "negative";
  RelationshipNature["NEUTRAL"] = "neutral";
  RelationshipNature["VOLATILE"] = "volatile";
})(
  RelationshipNature || (exports.RelationshipNature = RelationshipNature = {})
);
var RelationshipDirection;
(function (RelationshipDirection) {
  RelationshipDirection["UNIDIRECTIONAL"] = "unidirectional";
  RelationshipDirection["BIDIRECTIONAL"] = "bidirectional";
})(
  RelationshipDirection ||
    (exports.RelationshipDirection = RelationshipDirection = {})
);
var ConflictSubject;
(function (ConflictSubject) {
  ConflictSubject["RELATIONSHIP"] = "relationship";
  ConflictSubject["POWER"] = "power";
  ConflictSubject["IDEOLOGY"] = "ideology";
  ConflictSubject["RESOURCES"] = "resources";
  ConflictSubject["INFORMATION"] = "information";
  ConflictSubject["TERRITORY"] = "territory";
  ConflictSubject["HONOR"] = "honor";
  ConflictSubject["OTHER"] = "other";
})(ConflictSubject || (exports.ConflictSubject = ConflictSubject = {}));
var ConflictScope;
(function (ConflictScope) {
  ConflictScope["PERSONAL"] = "personal";
  ConflictScope["GROUP"] = "group";
  ConflictScope["SOCIETAL"] = "societal";
})(ConflictScope || (exports.ConflictScope = ConflictScope = {}));
var ConflictPhase;
(function (ConflictPhase) {
  ConflictPhase["EMERGING"] = "emerging";
  ConflictPhase["ESCALATING"] = "escalating";
  ConflictPhase["PEAK"] = "peak";
  ConflictPhase["RESOLVING"] = "resolving";
  ConflictPhase["RESOLVED"] = "resolved";
})(ConflictPhase || (exports.ConflictPhase = ConflictPhase = {}));
class ConflictNetworkImpl {
  id;
  name;
  characters = new Map();
  relationships = new Map();
  conflicts = new Map();
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
  addCharacter(character) {
    this.characters.set(character.id, character);
  }
  addRelationship(relationship) {
    this.relationships.set(relationship.id, relationship);
  }
  addConflict(conflict) {
    this.conflicts.set(conflict.id, conflict);
  }
  createSnapshot(description) {}
}
exports.ConflictNetworkImpl = ConflictNetworkImpl;
class NetworkDiagnostics {
  network;
  constructor(network) {
    this.network = network;
  }
  runAllDiagnostics() {
    return {
      overallHealthScore: 0.8,
      criticalityLevel: "medium",
      structuralIssues: [],
      isolatedCharacters: { totalIsolated: 0, characters: [] },
      abandonedConflicts: { totalAbandoned: 0, conflicts: [] },
      overloadedCharacters: { totalOverloaded: 0, characters: [] },
      weakConnections: { totalWeak: 0, connections: [] },
      redundancies: { totalRedundant: 0, items: [] },
    };
  }
}
exports.NetworkDiagnostics = NetworkDiagnostics;
class RelationshipInferenceEngine {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async inferRelationships(characters, context, station2Summary) {
    const charactersList = characters
      .map((c) => `'${c.name}' (ID: ${c.id})`)
      .join(", ");
    const promptContext = this.buildContextSummary(context, station2Summary);
    const prompt = `
استنادًا إلى السياق المقدم، قم باستنتاج العلاقات الرئيسية بين الشخصيات.

الشخصيات المتاحة: ${charactersList}

اكتب تحليلاً مفصلاً للعلاقات الرئيسية بين الشخصيات.
    `;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 25000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.7,
    });
    const analysisText = (0, text_utils_1.toText)(result.content) || "";
    const inferredRelationships = this.parseRelationshipsFromText(
      analysisText,
      characters
    );
    return inferredRelationships.length > 0
      ? inferredRelationships
      : this.createDefaultRelationships(characters);
  }
  parseRelationshipsFromText(text, characters) {
    const relationships = [];
    const charNameToId = new Map(characters.map((c) => [c.name, c.id]));
    const relationshipPatterns = [
      /(\w+)\s+و\s+(\w+)\s+:\s+(.+?)(?=\n|$)/gi,
      /بين\s+(\w+)\s+و\s+(\w+)\s+توجد\s+(.+?)(?=\n|$)/gi,
      /(\w+)\s+ترتبط\s+بـ\s+(\w+)\s+بـ(.+?)(?=\n|$)/gi,
    ];
    for (const pattern of relationshipPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const char1Name = match[1]?.trim();
        const char2Name = match[2]?.trim();
        const relationshipDesc = match[3]?.trim();
        if (!char1Name || !char2Name || !relationshipDesc) continue;
        const char1Id = charNameToId.get(char1Name);
        const char2Id = charNameToId.get(char2Name);
        if (char1Id && char2Id && char1Id !== char2Id) {
          const relationship = {
            id: `rel_${char1Id}_${char2Id}_${Date.now()}`,
            source: char1Id,
            target: char2Id,
            type: this.inferRelationshipType(relationshipDesc),
            nature: this.inferRelationshipNature(relationshipDesc),
            direction: this.inferRelationshipDirection(relationshipDesc),
            strength: this.inferRelationshipStrength(relationshipDesc),
            description: relationshipDesc,
            triggers: this.extractTriggers(relationshipDesc),
            metadata: {
              source: "AI_Text_Analysis",
              inferenceTimestamp: new Date().toISOString(),
            },
          };
          relationships.push(relationship);
        }
      }
    }
    return relationships;
  }
  createDefaultRelationships(characters) {
    const relationships = [];
    for (let i = 0; i < Math.min(characters.length, 3); i++) {
      for (let j = i + 1; j < Math.min(characters.length, 3); j++) {
        const relationship = {
          id: `rel_default_${characters[i]?.id}_${characters[j]?.id}_${Date.now()}`,
          source: characters[i]?.id ?? "",
          target: characters[j]?.id ?? "",
          type: RelationshipType.OTHER,
          nature: RelationshipNature.NEUTRAL,
          direction: RelationshipDirection.BIDIRECTIONAL,
          strength: 5,
          description: "علاقة محتملة تحتاج تطوير",
          triggers: [],
          metadata: {
            source: "Default_Inference",
            inferenceTimestamp: new Date().toISOString(),
          },
        };
        relationships.push(relationship);
      }
    }
    return relationships;
  }
  inferRelationshipType(description) {
    const desc = description.toLowerCase();
    if (
      desc.includes("أسرة") ||
      desc.includes("أب") ||
      desc.includes("أم") ||
      desc.includes("أخ") ||
      desc.includes("أخت")
    ) {
      return RelationshipType.FAMILY;
    } else if (desc.includes("صديق") || desc.includes("رفاق")) {
      return RelationshipType.FRIENDSHIP;
    } else if (
      desc.includes("حب") ||
      desc.includes("علاقة عاطفية") ||
      desc.includes("زواج")
    ) {
      return RelationshipType.ROMANTIC;
    } else if (
      desc.includes("عمل") ||
      desc.includes("زميل") ||
      desc.includes("مدير")
    ) {
      return RelationshipType.PROFESSIONAL;
    } else if (
      desc.includes("عدو") ||
      desc.includes("خصم") ||
      desc.includes("منافس")
    ) {
      return RelationshipType.ANTAGONISTIC;
    } else if (
      desc.includes("معلم") ||
      desc.includes("تلميذ") ||
      desc.includes("مرشد")
    ) {
      return RelationshipType.MENTORSHIP;
    }
    return RelationshipType.OTHER;
  }
  inferRelationshipNature(description) {
    const desc = description.toLowerCase();
    if (
      desc.includes("إيجابي") ||
      desc.includes("داعم") ||
      desc.includes("جيد")
    ) {
      return RelationshipNature.POSITIVE;
    } else if (
      desc.includes("سلبي") ||
      desc.includes("معادي") ||
      desc.includes("سيء")
    ) {
      return RelationshipNature.NEGATIVE;
    } else if (
      desc.includes("متغير") ||
      desc.includes("متبدل") ||
      desc.includes("غير مستقر")
    ) {
      return RelationshipNature.VOLATILE;
    }
    return RelationshipNature.NEUTRAL;
  }
  inferRelationshipDirection(description) {
    const desc = description.toLowerCase();
    if (
      desc.includes("أثر") ||
      desc.includes("يسيطر") ||
      desc.includes("يؤثر على")
    ) {
      return RelationshipDirection.UNIDIRECTIONAL;
    }
    return RelationshipDirection.BIDIRECTIONAL;
  }
  inferRelationshipStrength(description) {
    const desc = description.toLowerCase();
    if (
      desc.includes("قوي جداً") ||
      desc.includes("عميق") ||
      desc.includes("وثيق")
    ) {
      return 9;
    } else if (desc.includes("قوي") || desc.includes("مهم")) {
      return 7;
    } else if (desc.includes("ضعيف") || desc.includes("سطحي")) {
      return 3;
    }
    return 5;
  }
  extractTriggers(description) {
    const triggers = [];
    const triggerPatterns = [
      /عندما\s+(.+?)(?=\n|،|و)/gi,
      /إذا\s+(.+?)(?=\n|،|و)/gi,
      /بسبب\s+(.+?)(?=\n|،|و)/gi,
    ];
    for (const pattern of triggerPatterns) {
      let match;
      while ((match = pattern.exec(description)) !== null) {
        if (match[1]) {
          triggers.push(match[1].trim());
        }
      }
    }
    return triggers;
  }
  buildContextSummary(context, station2Summary) {
    const characterProfiles = Array.from(
      context.characterProfiles?.entries() ?? []
    ).map(([name, profile]) => ({
      name,
      personalityTraits: profile?.personalityTraits ?? "",
      motivationsGoals: profile?.motivationsGoals ?? "",
      narrativeFunction: profile?.narrativeFunction ?? "",
      keyRelationshipsBrief: profile?.keyRelationshipsBrief ?? "",
    }));
    const relationshipHints = (context.relationshipData || [])
      .filter(
        (item) => item && typeof item === "object" && "characters" in item
      )
      .map((item) => {
        const data = item;
        return {
          characters: data.characters ?? [],
          dynamic: data.dynamic ?? "",
          narrativeImportance: data.narrativeImportance ?? "",
        };
      });
    return {
      majorCharacters: context.majorCharacters,
      characterProfiles,
      relationshipHints,
      conceptualHighlights: {
        storyStatement: station2Summary.storyStatement,
        hybridGenre: station2Summary.hybridGenre,
        elevatorPitch: station2Summary.elevatorPitch,
      },
    };
  }
}
class ConflictInferenceEngine {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async inferConflicts(characters, relationships, context, station2Summary) {
    const charactersSummary = characters.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
    }));
    const relationshipsSummary = relationships.slice(0, 5).map((r) => {
      const source = characters.find((c) => c.id === r.source);
      const target = characters.find((c) => c.id === r.target);
      return {
        characters: [source?.name, target?.name],
        type: r.type,
        nature: r.nature,
      };
    });
    const conceptualSummary = this.buildConflictContext(
      context,
      station2Summary
    );
    const prompt = `
استنادًا إلى السياق، قم باستنتاج الصراعات الرئيسية (3-5 صراعات).

اكتب تحليلاً مفصلاً للصراعات الرئيسية في النص.
    `;
    const result = await this.geminiService.generate({
      prompt,
      context: (0, text_utils_1.safeSub)(context.fullText, 0, 25000),
      model: gemini_service_1.GeminiModel.FLASH,
      temperature: 0.7,
    });
    const analysisText = (0, text_utils_1.toText)(result.content) || "";
    const inferredConflicts = this.parseConflictsFromText(
      analysisText,
      characters
    );
    return inferredConflicts.length > 0
      ? inferredConflicts
      : this.createDefaultConflicts(characters);
  }
  parseConflictsFromText(text, characters) {
    const conflicts = [];
    const charNameToId = new Map(characters.map((c) => [c.name, c.id]));
    const conflictPatterns = [
      /صراع\s+(.+?)\s+بين\s+(.+?)\s+و\s+(.+?)(?=\n|$)/gi,
      /(.+?)\s+يواجه\s+(.+?)(?=\n|$)/gi,
      /الصراع\s+الرئيسي\s+هو\s+(.+?)(?=\n|$)/gi,
    ];
    for (const pattern of conflictPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        let conflictName, involvedChars, conflictDesc;
        if (match.length === 4) {
          conflictName = match[1]?.trim() ?? "صراع غير مسمى";
          involvedChars = [match[2]?.trim() ?? "", match[3]?.trim() ?? ""];
          conflictDesc = `صراع ${conflictName} بين ${involvedChars.join(" و ")}`;
        } else if (match.length === 3) {
          conflictName = `صراع ${match[1]?.trim()}`;
          involvedChars = [match[1]?.trim() ?? ""];
          conflictDesc = match[2]?.trim() ?? "";
        } else {
          conflictName = "الصراع الرئيسي";
          conflictDesc = match[1]?.trim() ?? "";
          involvedChars = this.extractCharactersFromDescription(
            conflictDesc,
            characters
          );
        }
        const involvedIds = involvedChars
          .map((name) => charNameToId.get(name ?? ""))
          .filter((id) => id !== undefined);
        if (involvedIds.length > 0) {
          const conflict = {
            id: `conflict_${Date.now()}_${Math.random()}`,
            name: conflictName,
            description: conflictDesc,
            involvedCharacters: involvedIds,
            subject: this.inferConflictSubject(conflictDesc),
            scope: this.inferConflictScope(conflictDesc),
            phase: ConflictPhase.EMERGING,
            strength: this.inferConflictStrength(conflictDesc),
            relatedRelationships: this.findRelatedRelationships(
              involvedIds,
              characters
            ),
            pivotPoints: [],
            timestamps: [new Date()],
            metadata: {
              source: "AI_Text_Analysis",
              inferenceTimestamp: new Date().toISOString(),
            },
          };
          conflicts.push(conflict);
        }
      }
    }
    return conflicts;
  }
  createDefaultConflicts(characters) {
    const conflicts = [];
    if (characters.length >= 2) {
      const mainConflict = {
        id: `conflict_main_${Date.now()}`,
        name: "الصراع الرئيسي",
        description: "صراع مركزي يحرك القصة",
        involvedCharacters: [characters[0]?.id ?? "", characters[1]?.id ?? ""],
        subject: ConflictSubject.OTHER,
        scope: ConflictScope.PERSONAL,
        phase: ConflictPhase.EMERGING,
        strength: 7,
        relatedRelationships: [],
        pivotPoints: [],
        timestamps: [new Date()],
        metadata: {
          source: "Default_Inference",
          inferenceTimestamp: new Date().toISOString(),
        },
      };
      conflicts.push(mainConflict);
    }
    for (let i = 2; i < Math.min(characters.length, 4); i++) {
      const subConflict = {
        id: `conflict_sub_${characters[i]?.id}_${Date.now()}`,
        name: `صراع ${characters[i]?.name}`,
        description: `صراع فرعي يتعلق بشخصية ${characters[i]?.name}`,
        involvedCharacters: [characters[i]?.id ?? ""],
        subject: ConflictSubject.OTHER,
        scope: ConflictScope.PERSONAL,
        phase: ConflictPhase.EMERGING,
        strength: 5,
        relatedRelationships: [],
        pivotPoints: [],
        timestamps: [new Date()],
        metadata: {
          source: "Default_Inference",
          inferenceTimestamp: new Date().toISOString(),
        },
      };
      conflicts.push(subConflict);
    }
    return conflicts;
  }
  extractCharactersFromDescription(description, characters) {
    const mentionedChars = [];
    for (const character of characters) {
      if (description.includes(character.name)) {
        mentionedChars.push(character.name);
      }
    }
    return mentionedChars.length > 0
      ? mentionedChars
      : [characters[0]?.name].filter((name) => !!name);
  }
  findRelatedRelationships(involvedIds, characters) {
    return [];
  }
  inferConflictSubject(description) {
    const desc = description.toLowerCase();
    if (
      desc.includes("حب") ||
      desc.includes("علاقة") ||
      desc.includes("زواج")
    ) {
      return ConflictSubject.RELATIONSHIP;
    } else if (
      desc.includes("سلطة") ||
      desc.includes("سيطرة") ||
      desc.includes("حكم")
    ) {
      return ConflictSubject.POWER;
    } else if (
      desc.includes("معتقد") ||
      desc.includes("رأي") ||
      desc.includes("فكر")
    ) {
      return ConflictSubject.IDEOLOGY;
    } else if (
      desc.includes("مورد") ||
      desc.includes("مال") ||
      desc.includes("كنز")
    ) {
      return ConflictSubject.RESOURCES;
    } else if (
      desc.includes("معلومات") ||
      desc.includes("سر") ||
      desc.includes("حقيقة")
    ) {
      return ConflictSubject.INFORMATION;
    } else if (
      desc.includes("مكان") ||
      desc.includes("أرض") ||
      desc.includes("منزل")
    ) {
      return ConflictSubject.TERRITORY;
    } else if (
      desc.includes("شرف") ||
      desc.includes("كرامة") ||
      desc.includes("سمعة")
    ) {
      return ConflictSubject.HONOR;
    }
    return ConflictSubject.OTHER;
  }
  inferConflictScope(description) {
    const desc = description.toLowerCase();
    if (
      desc.includes("عالم") ||
      desc.includes("مجتمع") ||
      desc.includes("دولة")
    ) {
      return ConflictScope.SOCIETAL;
    } else if (
      desc.includes("مجموعة") ||
      desc.includes("فريق") ||
      desc.includes("عائلة")
    ) {
      return ConflictScope.GROUP;
    }
    return ConflictScope.PERSONAL;
  }
  inferConflictStrength(description) {
    const desc = description.toLowerCase();
    if (
      desc.includes("شديد") ||
      desc.includes("عنيف") ||
      desc.includes("خطير")
    ) {
      return 8;
    } else if (desc.includes("معتدل") || desc.includes("متوسط")) {
      return 5;
    } else if (desc.includes("خفيف") || desc.includes("بسيط")) {
      return 3;
    }
    return 6;
  }
  buildConflictContext(context, station2Summary) {
    const relationshipHints = (context.relationshipData || [])
      .filter(
        (item) => item && typeof item === "object" && "characters" in item
      )
      .map((item) => {
        const data = item;
        return {
          characters: data.characters ?? [],
          dynamic: data.dynamic ?? "",
          narrativeImportance: data.narrativeImportance ?? "",
        };
      });
    return {
      majorCharacters: context.majorCharacters,
      relationshipInsights: relationshipHints,
      storyStatement: station2Summary.storyStatement,
      hybridGenre: station2Summary.hybridGenre,
      genreContributionMatrix: station2Summary.genreContributionMatrix,
      dynamicTone: station2Summary.dynamicTone,
    };
  }
}
class NetworkAnalyzer {
  geminiService;
  constructor(geminiService) {
    this.geminiService = geminiService;
  }
  async analyzeNetwork(network, context) {
    const maxPossibleConnections =
      (network.characters.size * (network.characters.size - 1)) / 2;
    const actualConnections = network.relationships.size;
    const density =
      maxPossibleConnections > 0
        ? actualConnections / maxPossibleConnections
        : 0;
    const avgConnectionsPerCharacter =
      network.characters.size > 0
        ? Array.from(network.relationships.values()).reduce((sum, rel) => {
            return (
              sum +
              (network.relationships.has(rel.source) ? 1 : 0) +
              (network.relationships.has(rel.target) ? 1 : 0)
            );
          }, 0) / network.characters.size
        : 0;
    const complexity = Math.min(avgConnectionsPerCharacter / 5, 1);
    const conflictDistribution = this.calculateConflictDistribution(network);
    const balance = 1 - this.calculateImbalance(conflictDistribution);
    const strengthValues = Array.from(network.relationships.values()).map(
      (rel) => rel.strength
    );
    const minStrength = Math.min(...strengthValues, 0);
    const maxStrength = Math.max(...strengthValues, 10);
    const dynamicRange = (maxStrength - minStrength) / 10;
    return {
      density: Math.round(density * 100) / 100,
      complexity: Math.round(complexity * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      dynamicRange: Math.round(dynamicRange * 100) / 100,
    };
  }
  calculateConflictDistribution(network) {
    const distribution = new Map();
    for (const character of network.characters.values()) {
      const conflictCount = Array.from(network.conflicts.values()).filter(
        (conflict) => conflict.involvedCharacters.includes(character.id)
      ).length;
      distribution.set(character.id, conflictCount);
    }
    return distribution;
  }
  calculateImbalance(distribution) {
    const values = Array.from(distribution.values());
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance =
      values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      values.length;
    const stdDev = Math.sqrt(variance);
    return Math.min(stdDev / mean, 1) || 0;
  }
  async analyzeConflicts(network, context) {
    const conflicts = Array.from(network.conflicts.values());
    const mainConflict = conflicts.reduce(
      (strongest, current) =>
        current.strength > strongest.strength ? current : strongest,
      conflicts[0] || this.createDefaultConflict()
    );
    const subConflicts = conflicts.filter(
      (conflict) => conflict.id !== mainConflict.id
    );
    const conflictTypes = new Map();
    for (const conflict of conflicts) {
      const typeName = conflict.subject.toString();
      conflictTypes.set(typeName, (conflictTypes.get(typeName) || 0) + 1);
    }
    const intensityProgression = this.calculateIntensityProgression(conflicts);
    return {
      mainConflict,
      subConflicts,
      conflictTypes,
      intensityProgression,
    };
  }
  calculateIntensityProgression(conflicts) {
    return conflicts.map((conflict) => conflict.strength / 10);
  }
  createDefaultConflict() {
    return {
      id: `conflict_default_${Date.now()}`,
      name: "صراع افتراضي",
      description: "صراع افتراضي للتحليل",
      involvedCharacters: [],
      subject: ConflictSubject.OTHER,
      scope: ConflictScope.PERSONAL,
      phase: ConflictPhase.EMERGING,
      strength: 5,
      relatedRelationships: [],
      pivotPoints: [],
      timestamps: [new Date()],
      metadata: {
        source: "Default_Analysis",
        inferenceTimestamp: new Date().toISOString(),
      },
    };
  }
  async generateCharacterArcs(network, context) {
    const characterArcs = new Map();
    for (const character of network.characters.values()) {
      const conflicts = Array.from(network.conflicts.values()).filter(
        (conflict) => conflict.involvedCharacters.includes(character.id)
      );
      const relationships = Array.from(network.relationships.values()).filter(
        (rel) => rel.source === character.id || rel.target === character.id
      );
      const arc = {
        characterId: character.id,
        characterName: character.name,
        arcType: this.inferArcType(character, conflicts, relationships),
        arcDescription: this.generateArcDescription(
          character,
          conflicts,
          relationships
        ),
        keyMoments: this.extractKeyMoments(character, conflicts, relationships),
        transformation: this.describeTransformation(
          character,
          conflicts,
          relationships
        ),
        confidence: this.calculateArcConfidence(
          character,
          conflicts,
          relationships
        ),
      };
      characterArcs.set(character.id, arc);
    }
    return characterArcs;
  }
  inferArcType(character, conflicts, relationships) {
    const conflictStrength = conflicts.reduce(
      (sum, conflict) => sum + conflict.strength,
      0
    );
    const relationshipBalance = relationships.reduce((sum, rel) => {
      return sum + (rel.nature === RelationshipNature.POSITIVE ? 1 : -1);
    }, 0);
    if (conflictStrength > 10 && relationshipBalance < 0) {
      return "fall";
    } else if (conflictStrength > 10 && relationshipBalance > 0) {
      return "transformational";
    } else if (conflictStrength > 5) {
      return relationshipBalance > 0 ? "positive" : "negative";
    }
    return "flat";
  }
  generateArcDescription(character, conflicts, relationships) {
    const conflictNames = conflicts.map((conflict) => conflict.name).join("، ");
    const relationshipTypes = relationships
      .map((rel) => rel.type.toString())
      .join("، ");
    return `قوس ${character.name} يتضمن الصراعات: ${conflictNames} والعلاقات: ${relationshipTypes}`;
  }
  extractKeyMoments(character, conflicts, relationships) {
    const keyMoments = [];
    for (const conflict of conflicts) {
      if (conflict.timestamps && conflict.timestamps.length > 0) {
        keyMoments.push({
          timestamp: conflict.timestamps?.[0] ?? new Date(),
          description: `بدء الصراع: ${conflict.name}`,
          impact: conflict.strength / 10,
        });
      }
    }
    for (const relationship of relationships) {
      keyMoments.push({
        timestamp: new Date(relationship.metadata.inferenceTimestamp),
        description: `تكوين علاقة: ${relationship.type.toString()}`,
        impact: relationship.strength / 10,
      });
    }
    return keyMoments.sort((a, b) => b.impact - a.impact).slice(0, 5);
  }
  describeTransformation(character, conflicts, relationships) {
    const positiveRelationships = relationships.filter(
      (rel) => rel.nature === RelationshipNature.POSITIVE
    ).length;
    const negativeRelationships = relationships.filter(
      (rel) => rel.nature === RelationshipNature.NEGATIVE
    ).length;
    if (positiveRelationships > negativeRelationships) {
      return `${character.name} يتحول نحو الأفضل من خلال العلاقات الإيجابية`;
    } else if (negativeRelationships > positiveRelationships) {
      return `${character.name} يواجه تحديات تؤثر على مساره سلباً`;
    }
    return `${character.name} يمر بتحولات معقدة بسبب الصراعات والعلاقات المتنوعة`;
  }
  calculateArcConfidence(character, conflicts, relationships) {
    const totalConnections = conflicts.length + relationships.length;
    if (totalConnections === 0) return 0.2;
    if (totalConnections < 3) return 0.5;
    if (totalConnections < 6) return 0.7;
    return 0.9;
  }
  async identifyPivotPoints(network, context) {
    const pivotPoints = [];
    for (const conflict of network.conflicts.values()) {
      if (conflict.strength > 7) {
        const affectedCharacters = conflict.involvedCharacters.map((charId) => {
          const character = network.characters.get(charId);
          return character ? character.name : charId;
        });
        pivotPoints.push({
          timestamp:
            conflict.timestamps?.[0]?.toISOString() || new Date().toISOString(),
          description: `نقطة تحول: ${conflict.name}`,
          impact: conflict.strength / 10,
          affectedElements: affectedCharacters,
        });
      }
    }
    for (const relationship of network.relationships.values()) {
      if (relationship.strength > 7) {
        const sourceChar = network.characters.get(relationship.source);
        const targetChar = network.characters.get(relationship.target);
        pivotPoints.push({
          timestamp: relationship.metadata.inferenceTimestamp,
          description: `نقطة تحول: علاقة ${relationship.type.toString()}`,
          impact: relationship.strength / 10,
          affectedElements: [
            sourceChar ? sourceChar.name : relationship.source,
            targetChar ? targetChar.name : relationship.target,
          ].filter(Boolean),
        });
      }
    }
    return pivotPoints.sort((a, b) => b.impact - a.impact);
  }
}
class Station3NetworkBuilder extends base_station_1.BaseStation {
  relationshipEngine;
  conflictEngine;
  networkAnalyzer;
  networkDiagnostics;
  constructor(geminiService) {
    super(geminiService, "Station 3: Network Builder", 3);
    this.relationshipEngine = new RelationshipInferenceEngine(geminiService);
    this.conflictEngine = new ConflictInferenceEngine(geminiService);
    this.networkAnalyzer = new NetworkAnalyzer(geminiService);
    this.networkDiagnostics = new NetworkDiagnostics(
      new ConflictNetworkImpl("temp", "temp")
    );
  }
  async execute(input, options) {
    if (
      !(
        "station1Output" in input &&
        "station2Output" in input &&
        "text" in input
      )
    ) {
      throw new Error("Invalid input for Station3NetworkBuilder");
    }
    const station3Input = input;
    const startTime = Date.now();
    const context = this.buildContext(station3Input);
    const network = new ConflictNetworkImpl(
      `network_${Date.now()}`,
      `${(0, text_utils_1.safeSub)(station3Input.station2Output.storyStatement, 0, 50)}...`
    );
    const characters = this.createCharactersFromStation1(
      station3Input.station1Output
    );
    characters.forEach((char) => network.addCharacter(char));
    const relationships = await this.relationshipEngine.inferRelationships(
      characters,
      context,
      station3Input.station2Output
    );
    relationships.forEach((rel) => network.addRelationship(rel));
    const conflicts = await this.conflictEngine.inferConflicts(
      characters,
      relationships,
      context,
      station3Input.station2Output
    );
    conflicts.forEach((conflict) => network.addConflict(conflict));
    network.createSnapshot("Initial network state after AI inference");
    const networkAnalysis = await this.networkAnalyzer.analyzeNetwork(
      network,
      context
    );
    const conflictAnalysis = await this.networkAnalyzer.analyzeConflicts(
      network,
      context
    );
    const characterArcs = await this.networkAnalyzer.generateCharacterArcs(
      network,
      context
    );
    const pivotPoints = await this.networkAnalyzer.identifyPivotPoints(
      network,
      context
    );
    this.networkDiagnostics = new NetworkDiagnostics(network);
    const diagnosticsReport = this.networkDiagnostics.runAllDiagnostics();
    const uncertaintyReport = this.calculateUncertainty(
      network,
      characters,
      relationships,
      conflicts
    );
    const buildTime = Date.now() - startTime;
    return {
      conflictNetwork: network,
      networkAnalysis,
      conflictAnalysis,
      characterArcs,
      pivotPoints,
      diagnosticsReport,
      uncertaintyReport,
      metadata: {
        analysisTimestamp: new Date(),
        status: "Success",
        buildTime,
        agentsUsed: [
          "RelationshipInferenceEngine",
          "ConflictInferenceEngine",
          "NetworkAnalyzer",
          "NetworkDiagnostics",
        ],
      },
    };
  }
  calculateUncertainty(network, characters, relationships, conflicts) {
    const uncertainties = [];
    let confidence = 0.8;
    if (characters.length < 3) {
      confidence -= 0.2;
      uncertainties.push({
        type: "epistemic",
        aspect: "شخصيات",
        note: "عدد الشخصيات محدود قد يؤثر على دقة التحليل",
      });
    }
    if (relationships.length < characters.length) {
      confidence -= 0.15;
      uncertainties.push({
        type: "epistemic",
        aspect: "علاقات",
        note: "عدد العلاقات محدود قد يؤثر على تحليل الشبكة",
      });
    }
    if (conflicts.length < 2) {
      confidence -= 0.15;
      uncertainties.push({
        type: "epistemic",
        aspect: "صراعات",
        note: "عدد الصراعات محدود قد يؤثر على تحليل القصة",
      });
    }
    const vagueRelationships = relationships.filter((rel) => rel.strength < 4);
    if (vagueRelationships.length > 0) {
      uncertainties.push({
        type: "aleatoric",
        aspect: "علاقات غامضة",
        note: `توجد ${vagueRelationships.length} علاقات غير واضحة`,
      });
    }
    const weakConflicts = conflicts.filter((conflict) => conflict.strength < 4);
    if (weakConflicts.length > 0) {
      uncertainties.push({
        type: "aleatoric",
        aspect: "صراعات ضعيفة",
        note: `توجد ${weakConflicts.length} صراعات ضعيفة`,
      });
    }
    confidence = Math.max(0.1, Math.min(0.95, confidence));
    return {
      confidence: Math.round(confidence * 100) / 100,
      uncertainties,
    };
  }
  buildContext(input) {
    const relationshipHints = [];
    return {
      majorCharacters: input.station1Output.majorCharacters.map((c) => c.name),
      characterProfiles: input.station1Output.characterAnalysis,
      relationshipData: relationshipHints,
      fullText: input.text,
    };
  }
  createCharactersFromStation1(s1Output) {
    return s1Output.majorCharacters.map((character, index) => {
      const analysis = s1Output.characterAnalysis.get(character.name);
      return {
        id: `char_${index + 1}`,
        name: character.name,
        description: analysis?.role || "شخصية رئيسية",
        profile: {
          personalityTraits: (analysis?.personalityTraits || []).join(", "),
          motivationsGoals: [
            ...(analysis?.motivations || []),
            ...(analysis?.goals || []),
          ].join(", "),
          potentialArc: analysis?.arc?.description || "",
        },
        metadata: {
          source: "Station1_Analysis",
          analysisTimestamp: s1Output.metadata.analysisTimestamp.toISOString(),
        },
      };
    });
  }
  extractRequiredData(input) {
    return {
      station1Characters: input.station1Output.majorCharacters.slice(0, 5),
      station2StoryStatement: input.station2Output.storyStatement,
      fullTextLength: input.text.length,
    };
  }
  getErrorFallback() {
    const emptyNetwork = new ConflictNetworkImpl(
      "error_network",
      "Error Network"
    );
    return {
      conflictNetwork: emptyNetwork,
      networkAnalysis: {
        density: 0,
        complexity: 0,
        balance: 0,
        dynamicRange: 0,
      },
      conflictAnalysis: {
        mainConflict: {
          id: "error_conflict",
          name: "خطأ في تحليل الصراع",
          description: "لم يمكن تحليل الصراعات",
          involvedCharacters: [],
          subject: ConflictSubject.OTHER,
          scope: ConflictScope.PERSONAL,
          phase: ConflictPhase.EMERGING,
          strength: 0,
          relatedRelationships: [],
          pivotPoints: [],
          timestamps: [new Date()],
          metadata: {
            source: "Error_Fallback",
            inferenceTimestamp: new Date().toISOString(),
          },
        },
        subConflicts: [],
        conflictTypes: new Map(),
        intensityProgression: [],
      },
      characterArcs: new Map(),
      pivotPoints: [],
      diagnosticsReport: {
        overallHealthScore: 0,
        criticalityLevel: "critical",
        structuralIssues: [],
        isolatedCharacters: {
          totalIsolated: 0,
          characters: [],
        },
        abandonedConflicts: {
          totalAbandoned: 0,
          conflicts: [],
        },
        overloadedCharacters: {
          totalOverloaded: 0,
          characters: [],
        },
        weakConnections: {
          totalWeak: 0,
          connections: [],
        },
        redundancies: {
          totalRedundant: 0,
          items: [],
        },
      },
      uncertaintyReport: {
        confidence: 0.1,
        uncertainties: [
          {
            type: "epistemic",
            aspect: "شامل",
            note: "فشل كامل في التحليل",
          },
        ],
      },
      metadata: {
        analysisTimestamp: new Date(),
        status: "Failed",
        buildTime: 0,
        agentsUsed: [],
      },
    };
  }
  getAgentsUsed() {
    return [
      "RelationshipInferenceEngine",
      "ConflictInferenceEngine",
      "NetworkAnalyzer",
      "NetworkDiagnostics",
    ];
  }
}
exports.Station3NetworkBuilder = Station3NetworkBuilder;
//# sourceMappingURL=station3-network-builder.js.map
