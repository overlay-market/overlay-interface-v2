import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { ZODIAC_ROLES_SUBGRAPH_URL } from '../constants/zodiac';
import { SHIVA_ADDRESS } from '../constants/applications';

const MEMBER_OF_QUERY = gql`
  query MemberOf($member: String!) {
    memberOf(member: $member) {
      rolesModifier {
        avatar
        address
      }
      chainId
      targets {
        address
      }
    }
  }
`;

export interface RolesModifier {
    avatar: string;
    address: string;
}

export interface MemberOfItem {
    rolesModifier: RolesModifier;
    chainId: number | string;
    targets?: { address: string }[] | null;
}

export interface MemberOfResponse {
    memberOf: MemberOfItem[];
}

export const useZodiacRoles = (address?: string) => {
    return useQuery<MemberOfResponse>({
        queryKey: ['zodiacRoles', address],
        queryFn: async () => {
            if (!address) throw new Error("Missing address");
            const data = await request<MemberOfResponse>(ZODIAC_ROLES_SUBGRAPH_URL, MEMBER_OF_QUERY, { member: address.toLowerCase() });

            const filteredMemberOf = data.memberOf.filter(item => {
                const shivaAddr = SHIVA_ADDRESS[Number(item.chainId)];
                if (!shivaAddr) return false;
                return item.targets?.some(target => target.address.toLowerCase() === shivaAddr.toLowerCase()) || false;
            });

            return { memberOf: filteredMemberOf };
        },
        enabled: !!address,
        refetchOnWindowFocus: false,
    });
};

import { useZodiacContext } from '../providers/ZodiacProvider';

// ... (keep MEMBER_OF_QUERY and interfaces)

export const useAvatarTrading = () => {
    const context = useZodiacContext();
    return {
        isAvatarTradingActive: context.isAvatarTradingActive,
        activeAvatar: context.activeAvatar,
        setStatus: context.setStatus,
        setActiveAvatar: context.setActiveAvatar,
    };
};
