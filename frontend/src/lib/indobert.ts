import { INDOBERT_API_URL } from './constants';

export interface IndoBERTClassifyRequest {
  title?: string;
  description?: string;
  text?: string;
}

export interface IndoBERTPrediction {
  label: string;
  category: string;
  confidence: number;
}

export interface IndoBERTClassifyResponse {
  categories: Array<{
    label: string;
    confidence: number;
    category?: string;
  }>;
  processing_time_ms?: number;
  model?: string;
}

export interface IndoBERTStatus {
  status: 'online' | 'offline' | 'loading';
  model_name: string;
  version: string;
}

// Check IndoBERT microservice status
export async function checkIndoBERTStatus(): Promise<IndoBERTStatus> {
  try {
    const response = await fetch(`${INDOBERT_API_URL}/health`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error('Not OK');
    return response.json();
  } catch {
    return { status: 'offline', model_name: 'IndoBERT Multi-Label', version: 'indobenchmark/indobert-base-p1' };
  }
}

// Classify proposal title & description using IndoBERT microservice
export async function classifyWithIndoBERT(
  payload: { title: string; description: string } | string
): Promise<IndoBERTClassifyResponse | null> {
  const body =
    typeof payload === 'string'
      ? { text: payload, title: '', description: payload }
      : {
          title: payload.title,
          description: payload.description,
          text: `${payload.title}. ${payload.description}`.trim(),
        };

  try {
    // Try FastAPI /predict endpoint as per thesis architecture (Section 2.3.3)
    const response = await fetch(`${INDOBERT_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      return response.json();
    }

    // Fallback to /classify endpoint
    const fallbackResponse = await fetch(`${INDOBERT_API_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (fallbackResponse.ok) {
      return fallbackResponse.json();
    }

    return null;
  } catch {
    // Return null without fabricating false predictions when service is offline
    return null;
  }
}
