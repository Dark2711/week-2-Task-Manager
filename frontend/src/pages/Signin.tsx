import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Heading from '../components/Heading';
import InputBox from '../components/InputBox';
import { KeyRound } from 'lucide-react';
import { useState } from 'react';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSignin = () => {};
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
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <InputBox
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button label="Sign In" onClick={handleSignin} />
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
