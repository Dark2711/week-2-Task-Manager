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

  const navigate = useNavigate();
  const handleSignin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      // Set loading state to true before the API call
      setIsLoading(true);

      const response = await axios.post('http://localhost:3000/api/v1/user/signin', {
        email,
        password,
      });

      console.log(response.data);
      window.localStorage.setItem('token', response.data.token);
      navigate('/task');
    } catch (error) {
      console.error('Signin failed', error);
      // Optionally add error handling, like showing an error message to the user
    } finally {
      // Ensure loading state is set to false whether signin succeeds or fails
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
