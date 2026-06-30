import { Request } from 'express';
import { SafeUser } from '@/common/constants/safe-user.constant.js';

export interface RequestWithUser extends Request {
  user: SafeUser;
}
