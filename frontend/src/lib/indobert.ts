import { INDOBERT_API_URL } from './constants';

export interface IndoBERTClassifyRequest {
  text: string;
}

export interface IndoBERTClassifyResponse {
  categories: Array<{
    label: string;
    confidence: number;
  }>;
  processing_time_ms: number;
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
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error('Not OK');
    return response.json();
  } catch {
    return { status: 'offline', model_name: 'IndoBERT', version: 'N/A' };
  }
}

// Classify text using IndoBERT
export async function classifyWithIndoBERT(
  text: string
): Promise<IndoBERTClassifyResponse | null> {
  try {
    const response = await fetch(`${INDOBERT_API_URL}/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Classification failed');
    return response.json();
  } catch {
    return null;
  }
}
