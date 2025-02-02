"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { useAtom, useStore } from "jotai";
import { accountMenuState } from "@/app/utils/data/store";
import { useEffect, useState } from "react";

const AccountPopUp = () => {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useAtom(accountMenuState, {
    store: useStore(),
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSignup, setIsSignup] = useState(true); 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useEffect(() => {
    
    const popupShown = localStorage.getItem('popupShown');
    if (popupShown) {
        setHasShownPopup(true);
    }

   
    const timeoutId = setTimeout(() => {  
      setAccountMenuOpen(true);
      localStorage.setItem('popupShown', 'true');
      setHasShownPopup(true);
    }, 5000);
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignupSubmit = () => {
    setShowVerificationDialog(true);
    setAccountMenuOpen(false);
  };

  const handleLoginSubmit = () => {
    console.log("Login submitted"); 
    setAccountMenuOpen(false); 
  };

  const handleOnClickAccountMenu = () => {
    setAccountMenuOpen(true);
  };

  return (
    <div>
      <Dialog open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
      <DialogTrigger asChild>
        <button onClick={handleOnClickAccountMenu} className="lg:flex">
          Login
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Card>
          <Tabs defaultValue="sign up">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup" className="font-bold bg-[#c40600] text-white" onClick={() => setIsSignup(true)}>
                  Discount-Sign Up
              </TabsTrigger>
              <TabsTrigger value="login" className="font-bold bg-[#c40600] text-white" onClick={() => setIsSignup(false)}>sign in</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <CardHeader>
                <CardTitle className="font-bold">Sign in</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="font-bold">Email</Label> 
                  <Input
                    id="email-signup"  
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-signup" className="font-bold">Number</Label>
                  <div className="flex items-center gap-x-2">
                  <Input className="w-1/4"
                    id="number-signup"  
                    name="number"
                    type="number"
                    placeholder="+91"
                    required
                  /> 
                  <Input
                    id="number-signup"  
                    name="number"
                    type="number"
                    required
                  />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-[#c40600]" onClick={handleLoginSubmit}>
                  Sign in
                </Button>
              </CardFooter>
            </TabsContent>
            <TabsContent value="signup">
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create a new account to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">First Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Last Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="font-bold">Email</Label>
                  <Input
                    id="email-login"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-signup" className="font-bold">Number</Label>
                  <div className="flex items-center gap-x-2">
                  <Input className="w-1/4"
                    id="number-signup"  
                    name="number"
                    type="number"
                    placeholder="+91"
                    required
                  /> 
                  <Input
                    id="number-signup"  
                    name="number"
                    type="number"
                    required
                  />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-login" className="font-bold">Whatsapp</Label>
                  <Input
                    id="password-login"
                    name="number"
                    type="number"
                    required
                  />
                </div>
               
                <div className="flex gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-bold">Country</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="India"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-login" className="font-bold">zip Code</Label>
                  <Input
                    id="password-login"
                    name="number"
                    type="number"
                    required
                  />
                </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-[#c40600]" onClick={handleSignupSubmit}>
                  Sign Up
                </Button>
              </CardFooter>
            </TabsContent>
          </Tabs>
        </Card>
      </DialogContent>
    </Dialog>
    
      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
              <CardDescription>
                Enter the verification code sent to your number.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="font-bold">
                  Verification Code
                </Label>
                <Input id="verification-code" name="verification-code" type="text" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#c40600]">
                Verify
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountPopUp;