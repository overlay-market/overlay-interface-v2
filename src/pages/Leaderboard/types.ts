export interface PrevWeekDetails {
  sessionId: string
  sessionStart: string
  sessionEnd: string
}
export interface UserData {
  _id: string
  totalPoints: number
  previousWeekPoints: number
  rank?: number
}
export interface ExtendedUserData extends UserData {
  username?: string
  avatar?: string
}

export interface LeaderboardPointsData {
  previousWeekDetails: PrevWeekDetails
  totalUsers: number
  leaderboardTable: [UserData]
  user?: UserData
}