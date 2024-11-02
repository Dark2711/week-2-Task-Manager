import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Heading from '../components/Heading';
import InputBox from '../components/InputBox';
import { KeyRound } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleSignin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);

      const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
        email,
        password,
      });

      console.log(response.data);

      window.localStorage.setItem('token', response.data.token);
      window.localStorage.setItem('userName', response.data.userName);
      console.log('token saved to localstorage');

      navigate('/task');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.message || 'Authentication failed');
        } else if (error.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError('An error occurred. Please try again.');
        }
        console.error('Signin error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm border-2 shadow-md p-8 rounded-lg">
        <div className="flex justify-center mb-8">
          <KeyRound className="text-black w-32 h-20" />
        </div>
        <Heading label="Welcome Back" />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        <div>
          <InputBox
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <InputBox
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          label={isLoading ? 'Signing In...' : 'Sign In'}
          onClick={handleSignin}
          disabled={isLoading}
          className={`${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          } flex items-center justify-center`}
        />

        <div className="text-center p-4">
          <h3 className="text-slate-600">
            Don't have an account?{' '}
            <span className="hover:underline text-slate-900">
              <Link to="/signup">Sign Up</Link>
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Signin;
