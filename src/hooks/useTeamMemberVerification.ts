import { useMutation } from "@tanstack/react-query";
import { DATA_API_BASE_URL } from "../constants/applications";

export const TEAM_MEMBER_VERIFICATION_TYPES = [
  "email",
  "telegram",
  "x",
  "discord",
  "linkedin",
  "url",
  "wallet",
  "phone",
  "other",
] as const;

export type TeamMemberVerificationType =
  (typeof TEAM_MEMBER_VERIFICATION_TYPES)[number];

export interface TeamMemberVerificationRecord {
  _id: string;
  type: TeamMemberVerificationType;
  value: string;
  normalizedValue: string;
  memberName: string;
  role?: string;
  profileUrl?: string;
  contactLabel?: string;
  notes?: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMemberVerificationResponse {
  verified: boolean;
  query: {
    value: string;
    type?: TeamMemberVerificationType;
    normalizedValue: string;
  };
  result?: TeamMemberVerificationRecord;
}

export interface TeamMemberVerificationRequest {
  value: string;
  type?: TeamMemberVerificationType;
}

const verifyTeamMember = async (
  payload: TeamMemberVerificationRequest
): Promise<TeamMemberVerificationResponse> => {
  const response = await fetch(
    `${DATA_API_BASE_URL}/team-member-verifications/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || `Verification request failed: ${response.status}`
    );
  }

  return response.json() as Promise<TeamMemberVerificationResponse>;
};

export const useTeamMemberVerification = () => {
  return useMutation({
    mutationFn: verifyTeamMember,
  });
};
