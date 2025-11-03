"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkDiagnostics = void 0;
class NetworkDiagnostics {
  network;
  constructor(network) {
    this.network = network;
  }
  runAllDiagnostics() {
    const structuralIssues = this.analyzeStructuralIssues();
    const isolatedCharacters = this.findIsolatedCharacters();
    const abandonedConflicts = this.findAbandonedConflicts();
    const overloadedCharacters = this.findOverloadedCharacters();
    const weakConnections = this.findWeakConnections();
    const redundancies = this.findRedundancies();
    const overallHealthScore = this.calculateOverallHealth({
      structuralIssues,
      isolatedCharacters,
      abandonedConflicts,
      overloadedCharacters,
      weakConnections,
      redundancies,
    });
    return {
      overallHealthScore,
      criticalityLevel: this.determineCriticalityLevel(overallHealthScore),
      structuralIssues,
      isolatedCharacters,
      abandonedConflicts,
      overloadedCharacters,
      weakConnections,
      redundancies,
    };
  }
  analyzeStructuralIssues() {
    const issues = [];
    const components = this.findConnectedComponents();
    if (components.length > 1) {
      issues.push({
        type: "disconnected_components",
        severity: "high",
        description: `الشبكة مقسمة إلى ${components.length} مكونات منفصلة`,
        affectedElements: components.flat(),
      });
    }
    const criticalNodes = this.findCriticalNodes();
    if (criticalNodes.length > 0) {
      issues.push({
        type: "single_point_failure",
        severity: "medium",
        description: "توجد شخصيات حرجة قد تؤدي إزالتها لانهيار الشبكة",
        affectedElements: criticalNodes,
      });
    }
    return issues;
  }
  findIsolatedCharacters() {
    const isolatedChars = [];
    for (const character of this.network.characters.values()) {
      const relationships = this.getCharacterRelationships(character.id);
      const conflicts = this.getCharacterConflicts(character.id);
      if (relationships.length === 0 && conflicts.length === 0) {
        isolatedChars.push({
          characterName: character.name,
          characterId: character.id,
          isolationType: "completely_isolated",
          suggestedConnections: this.suggestConnectionsForCharacter(
            character.id
          ),
        });
      } else if (relationships.length <= 1 && conflicts.length === 0) {
        isolatedChars.push({
          characterName: character.name,
          characterId: character.id,
          isolationType: "weakly_connected",
          suggestedConnections: this.suggestConnectionsForCharacter(
            character.id
          ),
        });
      } else if (relationships.length > 0 && conflicts.length === 0) {
        isolatedChars.push({
          characterName: character.name,
          characterId: character.id,
          isolationType: "conflict_isolated",
          suggestedConnections: this.suggestConflictInvolvement(),
        });
      }
    }
    return {
      totalIsolated: isolatedChars.length,
      characters: isolatedChars,
    };
  }
  findAbandonedConflicts() {
    const abandonedConflicts = [];
    for (const conflict of this.network.conflicts.values()) {
      const daysSinceLastUpdate = this.calculateDaysSinceLastUpdate(conflict);
      if (daysSinceLastUpdate > 30) {
        abandonedConflicts.push({
          conflictName: conflict.name,
          conflictId: conflict.id,
          issueType: "stuck_in_phase",
          daysInactive: daysSinceLastUpdate,
          suggestedActions: this.suggestConflictActions(conflict),
        });
      } else if (conflict.strength < 3) {
        abandonedConflicts.push({
          conflictName: conflict.name,
          conflictId: conflict.id,
          issueType: "weak_involvement",
          daysInactive: daysSinceLastUpdate,
          suggestedActions: this.suggestConflictActions(conflict),
        });
      }
    }
    return {
      totalAbandoned: abandonedConflicts.length,
      conflicts: abandonedConflicts,
    };
  }
  findOverloadedCharacters() {
    const overloadedChars = [];
    for (const character of this.network.characters.values()) {
      const relationships = this.getCharacterRelationships(character.id);
      const conflicts = this.getCharacterConflicts(character.id);
      const totalLoad = relationships.length + conflicts.length * 2;
      if (totalLoad > 8) {
        overloadedChars.push({
          characterName: character.name,
          characterId: character.id,
          overloadType: "central_bottleneck",
          currentLoad: totalLoad,
          recommendedLoad: 6,
          suggestedDistribution: this.suggestLoadDistribution(character.id),
        });
      }
    }
    return {
      totalOverloaded: overloadedChars.length,
      characters: overloadedChars,
    };
  }
  findWeakConnections() {
    const weakConnections = [];
    for (const relationship of this.network.relationships.values()) {
      if (relationship.strength < 4) {
        weakConnections.push({
          connectionType: "relationship",
          elementId: relationship.id,
          weakness: "قوة العلاقة ضعيفة",
          strengthScore: relationship.strength,
          improvementSuggestions: [
            "أضف مشاهد تفاعل أكثر بين الشخصيتين",
            "طور الخلفية المشتركة للشخصيتين",
            "أنشئ صراعاً يجمع بينهما",
          ],
        });
      }
    }
    for (const conflict of this.network.conflicts.values()) {
      if (conflict.strength < 4) {
        weakConnections.push({
          connectionType: "conflict_involvement",
          elementId: conflict.id,
          weakness: "مشاركة ضعيفة في الصراع",
          strengthScore: conflict.strength,
          improvementSuggestions: [
            "زد من حدة الصراع",
            "أضف نقاط تحول مهمة",
            "اربط الصراع بدوافع الشخصيات الأساسية",
          ],
        });
      }
    }
    return {
      totalWeak: weakConnections.length,
      connections: weakConnections,
    };
  }
  findRedundancies() {
    const redundancies = [];
    const relationshipPairs = this.findDuplicateRelationships();
    for (const pair of relationshipPairs) {
      redundancies.push({
        redundancyType: "duplicate_relationships",
        affectedElements: pair,
        redundancyScore: 0.8,
        consolidationSuggestion: "دمج العلاقات المتشابهة في علاقة واحدة أقوى",
      });
    }
    const conflictGroups = this.findSimilarConflicts();
    for (const group of conflictGroups) {
      if (group.length > 1) {
        redundancies.push({
          redundancyType: "similar_conflicts",
          affectedElements: group,
          redundancyScore: 0.7,
          consolidationSuggestion:
            "دمج الصراعات المتشابهة في صراع واحد أكثر تعقيداً",
        });
      }
    }
    return {
      totalRedundant: redundancies.length,
      items: redundancies,
    };
  }
  getCharacterRelationships(characterId) {
    return Array.from(this.network.relationships.values()).filter(
      (rel) => rel.source === characterId || rel.target === characterId
    );
  }
  getCharacterConflicts(characterId) {
    return Array.from(this.network.conflicts.values()).filter((conflict) =>
      conflict.involvedCharacters.includes(characterId)
    );
  }
  findConnectedComponents() {
    const visited = new Set();
    const components = [];
    for (const charId of this.network.characters.keys()) {
      if (!visited.has(charId)) {
        const component = this.dfsComponent(charId, visited);
        components.push(component);
      }
    }
    return components;
  }
  dfsComponent(startId, visited) {
    const component = [];
    const stack = [startId];
    while (stack.length > 0) {
      const currentId = stack.pop();
      if (visited.has(currentId)) continue;
      visited.add(currentId);
      component.push(currentId);
      const relationships = this.getCharacterRelationships(currentId);
      for (const rel of relationships) {
        const otherId = rel.source === currentId ? rel.target : rel.source;
        if (!visited.has(otherId)) {
          stack.push(otherId);
        }
      }
    }
    return component;
  }
  findCriticalNodes() {
    const criticalNodes = [];
    for (const charId of this.network.characters.keys()) {
      const relationships = this.getCharacterRelationships(charId);
      if (relationships.length >= 3) {
        criticalNodes.push(charId);
      }
    }
    return criticalNodes;
  }
  suggestConnectionsForCharacter(characterId) {
    const suggestions = [];
    const character = this.network.characters.get(characterId);
    if (character) {
      for (const otherChar of this.network.characters.values()) {
        if (otherChar.id !== characterId) {
          suggestions.push(`ربط مع الشخصية: ${otherChar.name}`);
          if (suggestions.length >= 3) break;
        }
      }
    }
    return suggestions;
  }
  suggestConflictInvolvement() {
    const suggestions = [];
    const conflicts = Array.from(this.network.conflicts.values());
    for (const conflict of conflicts.slice(0, 2)) {
      suggestions.push(`إشراك في الصراع: ${conflict.name}`);
    }
    return suggestions;
  }
  calculateDaysSinceLastUpdate(conflict) {
    if (!conflict.timestamps || conflict.timestamps.length === 0) return 365;
    const lastUpdate = conflict.timestamps[conflict.timestamps.length - 1];
    if (!lastUpdate) return 365;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  suggestConflictActions(conflict) {
    return [
      "تطوير الصراع إلى المرحلة التالية",
      "إضافة نقطة تحول جديدة",
      "زيادة مشاركة الشخصيات",
      "ربط الصراع بصراعات أخرى",
    ];
  }
  suggestLoadDistribution(characterId) {
    return [
      "نقل بعض العلاقات لشخصيات أخرى",
      "تقسيم الصراعات الكبيرة",
      "إنشاء شخصيات مساعدة",
    ];
  }
  findDuplicateRelationships() {
    const duplicates = [];
    const relationships = Array.from(this.network.relationships.values());
    for (let i = 0; i < relationships.length; i++) {
      for (let j = i + 1; j < relationships.length; j++) {
        const rel1 = relationships[i];
        const rel2 = relationships[j];
        if (!rel1 || !rel2) continue;
        if (this.areRelationshipsSimilar(rel1, rel2)) {
          duplicates.push([rel1.id, rel2.id]);
        }
      }
    }
    return duplicates;
  }
  findSimilarConflicts() {
    const groups = [];
    const conflicts = Array.from(this.network.conflicts.values());
    const processed = new Set();
    for (const conflict of conflicts) {
      if (processed.has(conflict.id)) continue;
      const similarGroup = [conflict.id];
      processed.add(conflict.id);
      for (const otherConflict of conflicts) {
        if (
          otherConflict.id !== conflict.id &&
          !processed.has(otherConflict.id)
        ) {
          if (this.areConflictsSimilar(conflict, otherConflict)) {
            similarGroup.push(otherConflict.id);
            processed.add(otherConflict.id);
          }
        }
      }
      if (similarGroup.length > 1) {
        groups.push(similarGroup);
      }
    }
    return groups;
  }
  areRelationshipsSimilar(rel1, rel2) {
    return (
      rel1.type === rel2.type &&
      ((rel1.source === rel2.source && rel1.target === rel2.target) ||
        (rel1.source === rel2.target && rel1.target === rel2.source))
    );
  }
  areConflictsSimilar(conflict1, conflict2) {
    return (
      conflict1.subject === conflict2.subject &&
      conflict1.scope === conflict2.scope &&
      this.hasOverlappingCharacters(
        conflict1.involvedCharacters,
        conflict2.involvedCharacters
      )
    );
  }
  hasOverlappingCharacters(chars1, chars2) {
    return chars1.some((char) => chars2.includes(char));
  }
  calculateOverallHealth(issues) {
    let score = 100;
    score -= issues.structuralIssues.length * 15;
    score -= issues.isolatedCharacters.totalIsolated * 10;
    score -= issues.abandonedConflicts.totalAbandoned * 8;
    score -= issues.overloadedCharacters.totalOverloaded * 12;
    score -= issues.weakConnections.totalWeak * 5;
    score -= issues.redundancies.totalRedundant * 7;
    return Math.max(0, score);
  }
  determineCriticalityLevel(score) {
    if (score >= 85) return "healthy";
    if (score >= 70) return "minor_issues";
    if (score >= 50) return "moderate_issues";
    if (score >= 30) return "major_issues";
    return "critical";
  }
}
exports.NetworkDiagnostics = NetworkDiagnostics;
//# sourceMappingURL=network-diagnostics.js.map
