// Text chunking and context preservation for long texts
export interface TextChunk {
  id: string;
  content: string;
  startIndex: number;
  endIndex: number;
  type: "scene" | "chapter" | "act" | "dialogue";
  metadata: {
    characters: string[];
    location?: string;
    timeframe?: string;
    summary: string;
  };
}

export interface ContextMap {
  fullTextSummary: string;
  characterProfiles: Record<string, string>;
  plotOutline: string;
  thematicElements: string[];
  chunks: TextChunk[];
  totalTokens: number;
}

const MAX_TOKENS_PER_CHUNK = 30000; // Leave room for context
const OVERLAP_TOKENS = 2000; // Overlap between chunks

export class TextChunker {
  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 0.75 words for Arabic
    return Math.ceil(text.split(/\s+/).length * 1.33);
  }

  private findSceneBreaks(text: string): number[] {
    const breaks: number[] = [0];

    // Arabic scene indicators
    const scenePatterns = [
      /المشهد\s+\d+/g,
      /الفصل\s+\d+/g,
      /الجزء\s+\d+/g,
      /\n\s*\*\s*\*\s*\*\s*\n/g, // *** separators
      /\n\s*---+\s*\n/g, // --- separators
      /\n\s*===+\s*\n/g, // === separators
    ];

    scenePatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        breaks.push(match.index);
      }
    });

    breaks.push(text.length);
    return [...new Set(breaks)].sort((a, b) => a - b);
  }

  private extractCharacters(text: string): string[] {
    const characters = new Set<string>();

    // Arabic name patterns
    const namePatterns = [
      /([أ-ي]+)\s*:/g, // Name followed by colon
      /\(([أ-ي\s]+)\)/g, // Name in parentheses
    ];

    namePatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const name = match[1].trim();
        if (name.length > 2 && name.length < 20) {
          characters.add(name);
        }
      }
    });

    return Array.from(characters);
  }

  private generateSummary(text: string): string {
    // Simple extractive summary - take first and key sentences
    const sentences = text.split(/[.!?؟]/);
    const summary = sentences
      .slice(0, 3)
      .concat(sentences.slice(-2))
      .join(". ")
      .substring(0, 500);

    return summary + "...";
  }

  public chunkText(text: string): ContextMap {
    const totalTokens = this.estimateTokens(text);

    if (totalTokens <= MAX_TOKENS_PER_CHUNK) {
      // Text is small enough, no chunking needed
      return {
        fullTextSummary: this.generateSummary(text),
        characterProfiles: {},
        plotOutline: this.generateSummary(text),
        thematicElements: [],
        chunks: [
          {
            id: "full_text",
            content: text,
            startIndex: 0,
            endIndex: text.length,
            type: "scene",
            metadata: {
              characters: this.extractCharacters(text),
              summary: this.generateSummary(text),
            },
          },
        ],
        totalTokens,
      };
    }

    // Text needs chunking
    const sceneBreaks = this.findSceneBreaks(text);
    const chunks: TextChunk[] = [];

    for (let i = 0; i < sceneBreaks.length - 1; i++) {
      const start = sceneBreaks[i];
      const end = sceneBreaks[i + 1];
      const chunkText = text.substring(start, end);
      const chunkTokens = this.estimateTokens(chunkText);

      if (chunkTokens <= MAX_TOKENS_PER_CHUNK) {
        chunks.push({
          id: `chunk_${i + 1}`,
          content: chunkText,
          startIndex: start,
          endIndex: end,
          type: "scene",
          metadata: {
            characters: this.extractCharacters(chunkText),
            summary: this.generateSummary(chunkText),
          },
        });
      } else {
        // Further split large chunks
        const subChunks = this.splitLargeChunk(chunkText, start, i);
        chunks.push(...subChunks);
      }
    }

    return {
      fullTextSummary: this.generateSummary(text),
      characterProfiles: this.buildCharacterProfiles(chunks),
      plotOutline: this.buildPlotOutline(chunks),
      thematicElements: this.extractThemes(text),
      chunks,
      totalTokens,
    };
  }

  private splitLargeChunk(
    text: string,
    baseStart: number,
    chunkIndex: number
  ): TextChunk[] {
    const subChunks: TextChunk[] = [];
    const words = text.split(/\s+/);
    const wordsPerChunk = Math.floor(MAX_TOKENS_PER_CHUNK / 1.33);

    for (let i = 0; i < words.length; i += wordsPerChunk - 150) {
      // 150 word overlap
      const endIndex = Math.min(i + wordsPerChunk, words.length);
      const subChunkText = words.slice(i, endIndex).join(" ");

      subChunks.push({
        id: `chunk_${chunkIndex + 1}_${Math.floor(i / wordsPerChunk) + 1}`,
        content: subChunkText,
        startIndex: baseStart + text.indexOf(subChunkText),
        endIndex: baseStart + text.indexOf(subChunkText) + subChunkText.length,
        type: "dialogue",
        metadata: {
          characters: this.extractCharacters(subChunkText),
          summary: this.generateSummary(subChunkText),
        },
      });
    }

    return subChunks;
  }

  private buildCharacterProfiles(chunks: TextChunk[]): Record<string, string> {
    const profiles: Record<string, string> = {};

    chunks.forEach((chunk) => {
      chunk.metadata.characters.forEach((character) => {
        if (!profiles[character]) {
          profiles[character] = `شخصية تظهر في ${chunk.id}`;
        }
      });
    });

    return profiles;
  }

  private buildPlotOutline(chunks: TextChunk[]): string {
    return chunks
      .map((chunk, index) => `${index + 1}. ${chunk.metadata.summary}`)
      .join("\n");
  }

  private extractThemes(text: string): string[] {
    // Simple keyword-based theme extraction
    const themeKeywords = {
      الحب: ["حب", "عشق", "غرام", "هيام"],
      الصراع: ["صراع", "نزاع", "خلاف", "معركة"],
      العدالة: ["عدالة", "حق", "ظلم", "إنصاف"],
      الأسرة: ["أسرة", "عائلة", "أب", "أم", "ابن"],
      المجتمع: ["مجتمع", "ناس", "قوم", "شعب"],
    };

    const themes: string[] = [];

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const found = keywords.some(
        (keyword) =>
          text.includes(keyword) ||
          text.includes(keyword + "ة") ||
          text.includes(keyword + "ها")
      );
      if (found) themes.push(theme);
    });

    return themes;
  }

  public buildContextPrompt(
    contextMap: ContextMap,
    currentChunkId: string
  ): string {
    const currentChunk = contextMap.chunks.find((c) => c.id === currentChunkId);
    const chunkIndex = contextMap.chunks.findIndex(
      (c) => c.id === currentChunkId
    );

    let contextPrompt = `
## سياق النص الكامل:
**الملخص العام:** ${contextMap.fullTextSummary}

**الخط الدرامي:** ${contextMap.plotOutline}

**الشخصيات الرئيسية:** ${Object.keys(contextMap.characterProfiles).join(", ")}

**العناصر الثيمية:** ${contextMap.thematicElements.join(", ")}

## موقع الجزء الحالي:
**الجزء:** ${chunkIndex + 1} من ${contextMap.chunks.length}
**الشخصيات في هذا الجزء:** ${currentChunk?.metadata.characters.join(", ") || "غير محدد"}
`;

    // Add previous chunk context
    if (chunkIndex > 0) {
      const prevChunk = contextMap.chunks[chunkIndex - 1];
      contextPrompt += `\n**ملخص الجزء السابق:** ${prevChunk.metadata.summary}`;
    }

    // Add next chunk context
    if (chunkIndex < contextMap.chunks.length - 1) {
      const nextChunk = contextMap.chunks[chunkIndex + 1];
      contextPrompt += `\n**ملخص الجزء التالي:** ${nextChunk.metadata.summary}`;
    }

    return contextPrompt;
  }
}

export const textChunker = new TextChunker();
