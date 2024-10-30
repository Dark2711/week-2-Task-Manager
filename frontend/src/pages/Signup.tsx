import { Link } from 'react-router-dom';
import Button from '../components/Button';
// import { Button } from '@/components/ui/button';
import Heading from '../components/Heading';
import InputBox from '../components/InputBox';
import { UserRound } from 'lucide-react';
import { useState } from 'react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {};
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm border-2 shadow-md p-8 rounded-lg">
        <div className="flex justify-center mb-8">
          <UserRound className="text-black w-32 h-20" />
        </div>
        <Heading label="Create a Account" />
        <div>
          <InputBox
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <Button label="Sign Up" onClick={handleSignup} />
        {/* <div className="flex justify-center">
          <Button className="px-10 font-bold" size="lg">
            Sign Up
          </Button>
        </div> */}

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
