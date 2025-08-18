import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import GoogleIcon from '@mui/icons-material/Google';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { auth } from '../firebase.ts';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { db } from '../firebase.ts';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const mapAuthError = (code?: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-blocked':
      return 'Popup blocked by the browser. We will try redirect sign‑in.';
    default:
      return 'Authentication failed. Please try again.';
  }
};

const SignIn: React.FC = () => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loading, currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Builder');
  const [agree, setAgree] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);

  // Snackbar state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const prevUser = useRef<typeof currentUser | null>(null);

  useEffect(() => {
    if (!prevUser.current && currentUser) {
      setSnackMsg('Logged in successfully.');
      setSnackOpen(true);
      navigate('/', { replace: true });
    }
    prevUser.current = currentUser;
  }, [currentUser, navigate]);

  const handleEmailAuth = async () => {
    try {
      setError(null);
      const trimmedEmail = email.trim();
      if (mode === 'signin') {
        await signInWithEmail(trimmedEmail, password);
        setSnackMsg('Logged in successfully.');
        setSnackOpen(true);
        navigate('/', { replace: true });
        return;
      }

      if (!fullName.trim()) { setError('Please enter your full name.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
      if (!agree) { setError('You must accept the Terms to continue.'); return; }

      await signUpWithEmail(trimmedEmail, password);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fullName });
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          uid: auth.currentUser.uid,
          email: trimmedEmail,
          displayName: fullName,
          company: company || null,
          role,
          createdAt: serverTimestamp(),
        }, { merge: true });
      }

      setSnackMsg('Account created successfully.');
      setSnackOpen(true);
      navigate('/', { replace: true });
    } catch (e: any) {
      setError(mapAuthError(e?.code));
    }
  };

  const handleGoogle = async () => {
    try {
      setError(null);
      await signInWithGoogle();
      setSnackMsg('Logged in successfully.');
      setSnackOpen(true);
      navigate('/', { replace: true });
    } catch (e: any) {
      setError(mapAuthError(e?.code));
    }
  };

  const handleReset = async () => {
    try {
      const trimmedEmail = email.trim();
      if (!trimmedEmail) { setError('Enter your email to reset the password.'); return; }
      await sendPasswordResetEmail(auth, trimmedEmail);
      setSnackMsg('Password reset email sent.');
      setSnackOpen(true);
    } catch (e: any) {
      setError(mapAuthError(e?.code));
    }
  };

  const isSignup = mode === 'signup';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)', p: 2 }}>
      <Card sx={{ width: 480, background: '#121212', border: '1px solid #242424' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Welcome</Typography>
          <Typography variant="body2" sx={{ color: '#9e9e9e', mb: 3 }}>
            {isSignup ? 'Create an account to get started.' : 'Sign in to continue to DeFi Guardian AI.'}
          </Typography>

          <Stack spacing={2}>
            <Button onClick={handleGoogle} variant="contained" startIcon={<GoogleIcon />} sx={{ backgroundColor: '#fff', color: '#000', '&:hover': { backgroundColor: '#f2f2f2' } }}>
              Continue with Google
            </Button>

            <Divider sx={{ borderColor: '#2a2a2a' }}>or</Divider>

            {isSignup && (
              <TextField label="Full name" size="small" value={fullName} onChange={(e) => setFullName(e.target.value)} fullWidth />
            )}
            <TextField label="Email" type="email" size="small" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
            <TextField label="Password" type="password" size="small" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
            {!isSignup && (
              <Button onClick={handleReset} variant="text" sx={{ justifyContent: 'flex-start', color: '#9e9e9e' }}>
                Forgot password?
              </Button>
            )}
            {isSignup && (
              <>
                <TextField label="Confirm password" type="password" size="small" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth />
                <TextField label="Company (optional)" size="small" value={company} onChange={(e) => setCompany(e.target.value)} fullWidth />
                <TextField label="Role" select size="small" value={role} onChange={(e) => setRole(e.target.value)} fullWidth>
                  {['Builder', 'Security Researcher', 'Protocol Team', 'Investor', 'Other'].map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </TextField>
                <FormControlLabel control={<Checkbox checked={agree} onChange={(e) => setAgree(e.target.checked)} />} label={<Typography variant="caption" sx={{ color: '#9e9e9e' }}>I agree to the Terms and Privacy Policy</Typography>} />
              </>
            )}

            {error && <Typography variant="caption" color="error">{error}</Typography>}

            <Button onClick={handleEmailAuth} disabled={loading} variant="contained" sx={{ backgroundColor: '#00d4aa', color: '#000', fontWeight: 700, '&:hover': { backgroundColor: '#00c4a0' } }}>
              {isSignup ? 'Create account' : 'Sign In'}
            </Button>

            <Button onClick={() => setMode(isSignup ? 'signin' : 'signup')} variant="text" sx={{ color: '#9e9e9e' }}>
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <MuiAlert elevation={6} variant="filled" severity="success" onClose={() => setSnackOpen(false)}>
          {snackMsg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default SignIn;
