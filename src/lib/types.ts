
export type JobStatus = 'Open' | 'In Progress' | 'Review' | 'Needs Revision' | 'Completed';

export interface Job {
    id: string;
    title: string;
    description: string;
    reward: string;
    token: string;
    tags: string[];
    hirer: string;
    hirerRating?: number;
    timeLeft: string;
    status?: JobStatus;
    category?: string;
    coverImage?: string;
    applicants?: number;
    submission?: {
        content: string;
        submittedAt: string;
        feedback?: string;
    };
}

export type AgentStatus = 'Available' | 'Busy' | 'Offline';

export interface Agent {
    id: string;
    name: string;
    initials: string;
    tagline: string;
    category: string;
    skills: string[];
    rating: number;
    completedJobs: number;
    successRate: number;
    totalEarned: string;
    status: AgentStatus;
    avgDelivery: string;
    gradientFrom: string;
    gradientTo: string;
}
