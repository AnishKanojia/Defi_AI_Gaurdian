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
import { useTheme } from '@mui/material/styles';
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Logo from '../components/Logo.tsx';

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
  const theme = useTheme();
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
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        p: 3,
        background: `
          radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 255, 136, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          #0A0A0A
        `,
        backgroundAttachment: 'fixed',
      }}
    >
      <Card 
        sx={{ 
          width: { xs: '100%', sm: 480 }, 
          maxWidth: '100%',
          background: 'rgba(26, 26, 26, 0.95)',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          borderRadius: '24px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0, 212, 255, 0.2)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 136, 0.1) 100%)',
            pointerEvents: 'none',
          }
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          />
          <Box sx={{ mb: 3, position: 'relative', zIndex: 1 }}>
            <Logo variant="full" size="large" color="white" showTagline={false} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              color: '#000000',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {isSignup ? 'Join CryptoVault Sentinel' : 'Welcome Back'}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(0, 0, 0, 0.8)',
              fontWeight: 600,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {isSignup ? 'Create an account to get started with DeFi security.' : 'Sign in to continue to CryptoVault Sentinel.'}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Stack spacing={3}>
            <Button 
              onClick={handleGoogle} 
              variant="outlined" 
              startIcon={<GoogleIcon />} 
              sx={{ 
                borderRadius: '12px',
                py: 1.5,
                borderWidth: '2px',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#00D4FF',
                  background: 'rgba(0, 212, 255, 0.1)',
                  boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
                },
              }}
            >
              Continue with Google
            </Button>

            <Divider sx={{ 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              '&::before, &::after': {
                borderColor: 'inherit',
              },
            }}>
              <Typography variant="body2" sx={{ color: '#B3B3B3', px: 2 }}>
                or continue with email
              </Typography>
            </Divider>

            {isSignup && (
              <TextField 
                label="Full name" 
                size="medium" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                fullWidth
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: '#B3B3B3' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(34, 34, 34, 0.8)',
                    '& fieldset': {
                      borderColor: 'rgba(51, 51, 51, 0.8)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00D4FF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00D4FF',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#B3B3B3',
                    '&.Mui-focused': {
                      color: '#00D4FF',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#FFFFFF',
                  },
                }}
              />
            )}
            
            <TextField 
              label="Email" 
              type="email" 
              size="medium" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(34, 34, 34, 0.8)',
                  '& fieldset': {
                    borderColor: 'rgba(51, 51, 51, 0.8)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00D4FF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00D4FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#B3B3B3',
                  '&.Mui-focused': {
                    color: '#00D4FF',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            
            <TextField 
              label="Password" 
              type="password" 
              size="medium" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              fullWidth
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: '#B3B3B3' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'rgba(34, 34, 34, 0.8)',
                  '& fieldset': {
                    borderColor: 'rgba(51, 51, 51, 0.8)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#00D4FF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#00D4FF',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#B3B3B3',
                  '&.Mui-focused': {
                    color: '#00D4FF',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#FFFFFF',
                },
              }}
            />
            
            {!isSignup && (
              <Button 
                onClick={handleReset} 
                variant="text" 
                sx={{ 
                  justifyContent: 'flex-start', 
                  color: '#00D4FF',
                  fontWeight: 500,
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.1)',
                  },
                }}
              >
                Forgot password?
              </Button>
            )}
            
            {isSignup && (
              <>
                <TextField 
                  label="Confirm password" 
                  type="password" 
                  size="medium" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(34, 34, 34, 0.8)',
                      '& fieldset': {
                        borderColor: 'rgba(51, 51, 51, 0.8)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00D4FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00D4FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B3B3B3',
                      '&.Mui-focused': {
                        color: '#00D4FF',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#FFFFFF',
                    },
                  }}
                />
                <TextField 
                  label="Company (optional)" 
                  size="medium" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(34, 34, 34, 0.8)',
                      '& fieldset': {
                        borderColor: 'rgba(51, 51, 51, 0.8)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00D4FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00D4FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B3B3B3',
                      '&.Mui-focused': {
                        color: '#00D4FF',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#FFFFFF',
                    },
                  }}
                />
                <TextField 
                  label="Role" 
                  select 
                  size="medium" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      backgroundColor: 'rgba(34, 34, 34, 0.8)',
                      '& fieldset': {
                        borderColor: 'rgba(51, 51, 51, 0.8)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#00D4FF',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00D4FF',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#B3B3B3',
                      '&.Mui-focused': {
                        color: '#00D4FF',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#FFFFFF',
                    },
                  }}
                >
                  {['Builder', 'Security Researcher', 'Protocol Team', 'Investor', 'Other'].map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </TextField>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={agree} 
                      onChange={(e) => setAgree(e.target.checked)}
                      sx={{
                        color: '#00D4FF',
                        '&.Mui-checked': {
                          color: '#00D4FF',
                        },
                      }}
                    />
                  } 
                  label={
                    <Typography variant="body2" sx={{ color: '#B3B3B3' }}>
                      I agree to the <span style={{ color: '#00D4FF', cursor: 'pointer' }}>Terms</span> and <span style={{ color: '#00D4FF', cursor: 'pointer' }}>Privacy Policy</span>
                    </Typography>
                  } 
                />
              </>
            )}

            {error && (
              <Typography 
                variant="body2" 
                sx={{ 
                  p: 2, 
                  borderRadius: '8px',
                  background: 'rgba(255, 71, 87, 0.1)',
                  border: '1px solid rgba(255, 71, 87, 0.3)',
                  color: '#FF4757',
                }}
              >
                {error}
              </Typography>
            )}

            <Button 
              onClick={handleEmailAuth} 
              disabled={loading} 
              variant="contained" 
              color="primary" 
              sx={{ 
                fontWeight: 700,
                borderRadius: '12px',
                py: 1.5,
                background: 'linear-gradient(135deg, #00D4FF 0%, #00FF88 100%)',
                color: '#000000',
                boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #00A3CC 0%, #00CC6A 100%)',
                  boxShadow: '0 8px 30px rgba(0, 212, 255, 0.6)',
                  transform: 'translateY(-2px)',
                },
                '&:disabled': {
                  background: 'rgba(0, 212, 255, 0.5)',
                  transform: 'none',
                },
              }}
            >
              {isSignup ? 'Create account' : 'Sign In'}
            </Button>

            <Button 
              onClick={() => setMode(isSignup ? 'signin' : 'signup')} 
              variant="text" 
              sx={{ 
                color: '#00D4FF',
                fontWeight: 500,
                '&:hover': {
                  background: 'rgba(0, 212, 255, 0.1)',
                },
              }}
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar 
        open={snackOpen} 
        autoHideDuration={3000} 
        onClose={() => setSnackOpen(false)} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          severity="success" 
          onClose={() => setSnackOpen(false)}
          sx={{
            borderRadius: '12px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)',
            color: '#000000',
          }}
        >
          {snackMsg}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default SignIn;
