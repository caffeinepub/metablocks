import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface RequireSignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RequireSignInDialog({ open, onOpenChange }: RequireSignInDialogProps) {
  const { login } = useInternetIdentity();

  const handleSignIn = () => {
    onOpenChange(false);
    login();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign In Required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to sign in to save your progress and compete on the leaderboard. Sign in now to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSignIn}>Sign In</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
