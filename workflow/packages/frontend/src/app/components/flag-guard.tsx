import { flagsHooks } from '@/hooks/flags-hooks';
import { ApFlagId } from 'workflow-shared';

type FlagGuardProps = {
  children: React.ReactNode;
  flag: ApFlagId;
};
const FlagGuard = ({ children, flag }: FlagGuardProps) => {
  const { data: flagValue } = flagsHooks.useFlag<boolean>(flag);
  if (!flagValue) {
    return null;
  }
  return children;
};

FlagGuard.displayName = 'FlagGuard';
export { FlagGuard };
