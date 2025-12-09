export interface KSeFConfig {
  environment: 'test' | 'production';
  token: string;
}

export interface KSeFSession {
  sessionToken: string;
  expiresAt: string;
}

export interface KSeFSendResult {
  success: boolean;
  referenceNumber?: string;
  ksefNumber?: string;
  errorMessage?: string;
}

export interface KSeFStatusResult {
  status: 'pending' | 'accepted' | 'rejected';
  ksefNumber?: string;
  upo?: string;
  errorMessage?: string;
}
