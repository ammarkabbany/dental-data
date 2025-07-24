"use client"
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCreateTeam } from '@/features/team/hooks/use-create-team';
import { redirect } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <div className="flex items-center justify-center gap-3 mb-8">
    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
      {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
    </div>
    <div className="h-1 w-8 bg-muted">
      <div className={`h-full bg-primary transition-all ${currentStep > 1 ? 'w-full' : 'w-0'}`} />
    </div>
    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
      {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
    </div>
    <div className="h-1 w-8 bg-muted">
      <div className={`h-full bg-primary transition-all ${currentStep > 2 ? 'w-full' : 'w-0'}`} />
    </div>
    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
      }`}>
      {currentStep > 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
    </div>
  </div>
);

const IntroductionStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <CardHeader className="space-y-2">
      <h2 className="text-3xl font-bold text-center">Welcome to Team Creation</h2>
      <p className="text-muted-foreground text-center text-lg">
        Create a team to collaborate with your colleagues and manage your dental practice efficiently
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="text-center space-y-4">
        <p className="text-lg font-medium">With teams, you can:</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Case Records', desc: 'Manage cases together seamlessly' },
            { title: 'Updates', desc: 'View data updates in real-time' },
            { title: 'Doctors', desc: 'Manage doctors' },
            { title: 'Analytics', desc: 'Track team performance metrics' },
          ].map((item) => (
            <div key={item.title} className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-end pt-4 pb-2">
      <Button onClick={onNext} size="lg" className="gap-2">
        Get Started <ArrowRight className="w-4 h-4" />
      </Button>
    </CardFooter>
  </motion.div>
);

const CreateTeamStep = ({
  teamName,
  setTeamName,
  onSubmit,
  isPending,
  teamType,
  setTeamType
}: {
  teamName: string;
  setTeamName: (name: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  teamType: 'dental_lab' | 'clinic' | 'freelancer' | 'other';
  setTeamType: (type: 'dental_lab' | 'clinic' | 'freelancer' | 'other') => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <CardHeader className="space-y-2">
      <h2 className="text-3xl font-bold text-center">Create Your Team</h2>
      <p className="text-muted-foreground text-center text-lg">
        Set up your team
      </p>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="teamName" className="text-sm font-medium block">
          Team Name
        </label>
        <Input
          id="teamName"
          placeholder="Enter your team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="h-12 text-lg"
          disabled={isPending}
        />
        <p className="text-sm text-muted-foreground">
          This will be the display name for your team
        </p>
      </div>
      <div className="space-y-3">
        <label htmlFor="teamType" className="text-sm font-medium block">
          Team Type
        </label>
        <Select
          value={teamType}
          onValueChange={(value: 'dental_lab' | 'clinic' | 'freelancer' | 'other') => setTeamType(value)}
          disabled={isPending}
        >
          <SelectTrigger className="h-12 text-lg">
            <SelectValue placeholder="Select team type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dental_lab">Dental Lab</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="freelancer">Freelancer</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Select the type of your team
        </p>
      </div>
    </CardContent>
    <CardFooter className="flex justify-end">
      <Button
        size="lg"
        variant="default"
        onClick={onSubmit}
        disabled={isPending || teamName.trim() === ''}
        className="gap-2"
      >
        Create Team <ArrowRight className="w-4 h-4" />
      </Button>
    </CardFooter>
  </motion.div>
);

const SuccessStep = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <CardHeader className="space-y-2">
        <h2 className="text-3xl font-bold text-center">Team Created</h2>
        <p className="text-muted-foreground flex items-center justify-center gap-2 text-lg">
          <CheckCircle className="w-6 h-6 text-primary" />
          Your team has been created successfully
        </p>
      </CardHeader>
      <CardContent className='text-center mt-4'>
        <h3 className='animate-pulse text-muted-foreground tracking-wider'>Redirecting you to dashboard...</h3>
      </CardContent>
    </motion.div>
  )
}

export function CreateTeamOnboarding() {
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [teamType, setTeamType] = useState<'dental_lab' | 'clinic' | 'freelancer' | 'other'>('dental_lab');
  const [step, setStep] = useState(1);

  const { mutate, isPending } = useCreateTeam();

  const handleCreateTeam = async () => {
    if (!user) return;
    mutate({
      name: teamName,
      type: teamType,
      userId: user.$id
    }, {
      onSuccess: () => {
        setStep(3);
        setTimeout(() => {
          redirect('/dashboard');
        }, 1500);
      }
    })
    // mock team creation
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <div className="pt-8">
          <StepIndicator currentStep={step} />
          {step === 1 && <IntroductionStep onNext={() => setStep(2)} />}
          {step === 2 && (
            <CreateTeamStep
              teamName={teamName}
              setTeamName={setTeamName}
              onSubmit={handleCreateTeam}
              isPending={isPending}
              teamType={teamType}
              setTeamType={setTeamType}
            />
          )}
          {step === 3 && <SuccessStep />}
        </div>
      </Card>
    </div>
  );
}
