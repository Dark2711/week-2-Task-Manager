import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Heading from '../components/Heading';
import InputBox from '../components/InputBox';
import { UserRound } from 'lucide-react';
import { useState } from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleSignup = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      // Set loading state to true when signup starts
      setIsLoading(true);

      const response = await axios.post(
        'https://week-2-task-manager.onrender.com/api/v1/user/signup',
        {
          name,
          email,
          password,
        },
      );

      console.log(response);
      navigate('/signin');
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
      // Ensure loading state is set to false whether signup succeeds or fails
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm border-2 shadow-md p-8 rounded-lg">
        <div className="flex justify-center mb-8">
          <UserRound className="text-black w-32 h-20" />
        </div>
        <Heading label="Create an Account" />
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        <div>
          <InputBox
            label="Name"
            placeholder="Enter your name"
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <InputBox
            label="Email"
            placeholder="Enter your email"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <InputBox
            label="Password"
            placeholder="Enter password"
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Conditionally render button based on loading state */}
        <Button
          label={isLoading ? 'Signing Up...' : 'Sign Up'}
          onClick={handleSignup}
          disabled={isLoading}
          className={`${
            isLoading ? 'cursor-not-allowed opacity-50' : ''
          } flex items-center justify-center`}
        />

        <div className="text-center p-4">
          <h3 className="text-slate-600">
            Already have an account?{' '}
            <span className="hover:underline text-slate-900">
              <Link to="/signin">Sign in</Link>
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Signup;
