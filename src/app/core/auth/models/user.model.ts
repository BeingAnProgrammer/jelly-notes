export type AvatarGradient =
  | 'gradient-1'
  | 'gradient-2'
  | 'gradient-3'
  | 'gradient-4';

export interface AppUser {
  readonly id: string;
  displayName: string;
  avatar: AvatarGradient;
  isGuest: boolean;
}
