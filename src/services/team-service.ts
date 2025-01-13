import apiClient from '@/lib/api-client';

export type TeamRole = 'ADMIN' | 'MEMBER';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
}

export const teamService = {
  inviteMember: async (email: string, role: TeamRole) => {
    const response = await apiClient.post('/team/invite', { email, role });
    return response.data;
  },

  getMembers: async () => {
    const response = await apiClient.get('/team/members');
    return response.data as TeamMember[];
  },

  updateMemberRole: async (memberId: string, role: TeamRole) => {
    const response = await apiClient.patch(`/team/members/${memberId}/role`, { role });
    return response.data;
  },

  removeMember: async (memberId: string) => {
    const response = await apiClient.delete(`/team/members/${memberId}`);
    return response.data;
  },
}; 