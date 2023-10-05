import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserData from '../model/UserData';
import { useRef, useState } from 'react';
import { StatusType } from '../model/StatusType';
import { Alert, Snackbar } from '@mui/material';
import LoginData from '../model/LoginData';
import AccountData from '../model/AccountData';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function ExistAccount() {
    return (
    <Typography variant="body2" color="text.secondary" align="center">
    <Link href="/signin" variant="body2">
                  Already have an account? Move to Sign in
                </Link>
    </Typography>
);
}


const defaultTheme = createTheme();
// TODO remove, this demo shouldn't need to reset the theme.
type Props = {
    submitFn: (accData: AccountData) => Promise<void>
    logInFn: (loginData: LoginData) => Promise <UserData|undefined>

}

const SignUpForm: React.FC<Props> = ({submitFn, logInFn}) => {
  const message = useRef<string>('');
  const [open, setOpen] = useState(false);
  const severity = useRef<StatusType>('success');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email: string = data.get('email')! as string;
    const password: string = data.get('password')! as string;
    
    await submitFn({ email, password, roles: ['USER'], status:'online'}); 
    await logInFn({ email, password});
    message.current && setOpen(true);
};
    

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
             
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
             
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
        
          </Box>
        </Box>
        <ExistAccount/>
        <Copyright sx={{ mt: 5 }} />
        
      </Container>

      <Snackbar open={open} autoHideDuration={3000}
                     onClose={() => setOpen(false)}>
                        <Alert  onClose = {() => setOpen(false)} severity={severity.current} sx={{ width: '100%' }}>
                            {message.current}
                        </Alert>
                    </Snackbar>

    </ThemeProvider>
  );
}

export default SignUpForm;