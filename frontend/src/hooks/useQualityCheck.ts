import { useMutation, useQuery } from '@tanstack/react-query';

interface QualityCheckRequest {
    videoBlob: Blob;
    roomId: string;
    username: string;
}

interface QualityCheckResponse {
    requestId: string;
    status: 'processing';
    message: string;
    estimatedTime: string;
}

interface QualityCheckResult {
    requestId: string;
    status: 'processing' | 'completed' | 'error';
    videoQuality?: {
        overall: 'good' | 'fair' | 'poor';
        issues: string[];
        details: {
            brightness: 'good' | 'too_dark' | 'too_bright';
            clarity: 'clear' | 'blurry' | 'pixelated';
            lighting: 'good' | 'poor' | 'uneven';
        };
    };
    audioQuality?: {
        overall: 'good' | 'fair' | 'poor';
        issues: string[];
        details: {
            clarity: 'clear' | 'distorted' | 'muffled';
            volume: 'good' | 'too_low' | 'too_high';
            echo: 'none' | 'slight' | 'significant';
            background_noise: 'none' | 'low' | 'high';
        };
    };
    recommendations?: string[];
    error?: string;
}

// API function to send video for quality check
const sendQualityCheck = async ({ videoBlob, roomId, username }: QualityCheckRequest): Promise<QualityCheckResponse> => {
    const formData = new FormData();
    formData.append('media', videoBlob, `quality-check-${Date.now()}.webm`);
    formData.append('roomId', roomId);
    formData.append('username', username);

    const response = await fetch('/api/quality-check', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// API function to get quality check result
const getQualityCheckResult = async (requestId: string): Promise<QualityCheckResult> => {
    const response = await fetch(`/api/quality-check/result/${requestId}`);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// Hook to send video for quality check
export const useQualityCheckMutation = () => {
    return useMutation({
        mutationFn: sendQualityCheck,
        onError: (error) => {
            console.error('Error sending video for quality check:', error);
        },
        onSuccess: (data) => {
            console.log('Video sent successfully for quality check:', data);
        },
    });
};

// Hook to get quality check result
export const useQualityCheckResult = (requestId: string | null, enabled: boolean = true) => {
    return useQuery<QualityCheckResult>({
        queryKey: ['qualityCheckResult', requestId],
        queryFn: () => getQualityCheckResult(requestId!),
        enabled: enabled && !!requestId,
        refetchInterval: (data) => {
            return data?.status === 'processing' ? 2000 : false;
        },
        refetchIntervalInBackground: false,
        staleTime: 0,
        retry: (failureCount, error: any) => {
            if (error?.message?.includes('404')) {
                return false;
            }
            return failureCount < 3;
        },
    });
};

// Combined hook for the complete quality check flow
export const useQualityCheck = () => {
    const mutation = useQualityCheckMutation();

    const sendQualityCheck = (data: QualityCheckRequest) => {
        return mutation.mutate(data);
    };

    return {
        sendQualityCheck,
        isLoading: mutation.isPending,
        error: mutation.error,
        data: mutation.data,
        reset: mutation.reset,
    };
};
