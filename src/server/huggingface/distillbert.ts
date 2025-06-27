import { pipeline, ZeroShotClassificationPipeline } from "@huggingface/transformers";

// Type definitions for zero-shot classification
export interface ZeroShotClassificationResult {
  sequence: string;
  labels: string[];
  scores: number[];
}

export interface ClassificationConfig {
  model?: string;
  device?: "cpu" | "webgpu" | "wasm";
  multiLabel?: boolean;
  hypothesisTemplate?: string;
}

// Default configuration
const DEFAULT_CONFIG: ClassificationConfig = {
  model: "MoritzLaurer/mDeBERTa-v3-base-mnli-xnli",
  device: "webgpu",
  multiLabel: false,
  hypothesisTemplate: "This example is {}."
};

// Global classifier instance
let classifierInstance: any | null = null;
let initializationPromise: Promise<any> | null = null;

/**
 * Initialize the zero-shot classification pipeline
 * @param config Configuration options for the classifier
 * @returns Promise that resolves to the initialized pipeline
 */
async function initializeClassifier(config: ClassificationConfig = DEFAULT_CONFIG): Promise<any> {
  if (classifierInstance) {
    return classifierInstance;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = (async () => {
    try {
      console.log(`Initializing zero-shot classifier with model: ${config.model}`);
      
      const pipelineOptions: any = {
        device: config.device || DEFAULT_CONFIG.device,
      };

      // Add additional configuration if needed
      if (config.hypothesisTemplate) {
        pipelineOptions.hypothesisTemplate = config.hypothesisTemplate;
      }

      classifierInstance = await pipeline(
        "zero-shot-classification", 
        config.model || DEFAULT_CONFIG.model,
        pipelineOptions
      ) as any;

      console.log("Zero-shot classifier initialized successfully");
      return classifierInstance!;
    } catch (error) {
      console.error("Failed to initialize zero-shot classifier:", error);
      
      // Fallback: try with CPU device if WebGPU fails
      if (config.device === "webgpu") {
        console.log("Retrying with CPU device...");
        try {
          classifierInstance = await pipeline(
            "zero-shot-classification", 
            config.model || DEFAULT_CONFIG.model,
            { device: "cpu" }
          ) as any;
          
          console.log("Zero-shot classifier initialized with CPU fallback");
          return classifierInstance!;
        } catch (cpuError) {
          console.error("CPU fallback also failed:", cpuError);
          throw new Error(`Failed to initialize classifier: ${cpuError}`);
        }
      }
      
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Perform zero-shot classification on text
 * @param text The input text to classify
 * @param candidateLabels Array of possible labels
 * @param config Optional configuration for classification
 * @returns Promise that resolves to classification results
 */
export async function classifyText(
  text: string, 
  candidateLabels: string[], 
  config: ClassificationConfig = {}
): Promise<ZeroShotClassificationResult> {
  if (!text || text.trim().length === 0) {
    throw new Error("Input text cannot be empty");
  }

  if (!candidateLabels || candidateLabels.length === 0) {
    throw new Error("Candidate labels cannot be empty");
  }

  try {
    // Initialize classifier if not already done
    const classifier = await initializeClassifier({ ...DEFAULT_CONFIG, ...config });
    
    // Perform classification
    const result = await classifier(text, candidateLabels, {
      multi_label: config.multiLabel || false,
    });

    // Ensure consistent return format
    if (Array.isArray(result)) {
      return result[0] as ZeroShotClassificationResult;
    }
    
    return result as ZeroShotClassificationResult;
  } catch (error) {
    console.error("Classification error:", error);
    
    // Return fallback result
    return {
      sequence: text,
      labels: candidateLabels,
      scores: candidateLabels.map(() => 1 / candidateLabels.length), // Equal probability
    };
  }
}

/**
 * Batch classify multiple texts
 * @param texts Array of texts to classify
 * @param candidateLabels Array of possible labels
 * @param config Optional configuration for classification
 * @returns Promise that resolves to array of classification results
 */
export async function batchClassifyText(
  texts: string[], 
  candidateLabels: string[], 
  config: ClassificationConfig = {}
): Promise<ZeroShotClassificationResult[]> {
  const results: ZeroShotClassificationResult[] = [];
  
  // Process texts sequentially to avoid overwhelming the model
  for (const text of texts) {
    try {
      const result = await classifyText(text, candidateLabels, config);
      results.push(result);
    } catch (error) {
      console.error(`Error classifying text: "${text.substring(0, 50)}..."`, error);
      
      // Add fallback result for failed classification
      results.push({
        sequence: text,
        labels: candidateLabels,
        scores: candidateLabels.map(() => 1 / candidateLabels.length),
      });
    }
  }
  
  return results;
}

/**
 * Get the top prediction from classification result
 * @param result Classification result
 * @returns Object with top label and score
 */
export function getTopPrediction(result: ZeroShotClassificationResult): { label: string; score: number } {
  if (!result.labels || !result.scores || result.labels.length === 0) {
    return { label: "unknown", score: 0 };
  }
  
  return {
    label: result.labels[0],
    score: result.scores[0]
  };
}

/**
 * Check if classifier is ready
 * @returns Boolean indicating if classifier is initialized
 */
export function isClassifierReady(): boolean {
  return classifierInstance !== null;
}

/**
 * Reset classifier instance (useful for testing or reconfiguration)
 */
export function resetClassifier(): void {
  classifierInstance = null;
  initializationPromise = null;
}

// Legacy export for backward compatibility
export const classifier = {
  classify: classifyText,
  batchClassify: batchClassifyText,
  getTopPrediction,
  isReady: isClassifierReady,
  reset: resetClassifier
};
