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
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";

const AccountPopUp = () => {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useAtom(accountMenuState, {
    store: useStore(),
  });
  const [isSignup, setIsSignup] = useState(true);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: "",
    zipCode: "",
  });

  const { isLoaded: isSignUpLoaded, signUp, setActive } = useSignUp();
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();

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
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignupSubmit = async () => {
    if (!isSignUpLoaded) return;

    try {
      const result = await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        phoneNumber: formData.phone,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      setPendingVerification(true);
      setShowVerificationDialog(true);
      setAccountMenuOpen(false);
    } catch (err) {
      toast.error("Error during sign up: " + err.message);
    }
  };

  const handleLoginSubmit = async () => {
    if (!isSignInLoaded) return;

    try {
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setSignInActive({ session: result.createdSessionId });
        setAccountMenuOpen(false);
        toast.success("Successfully signed in!");
      }
    } catch (err) {
      toast.error("Error during sign in: " + err.message);
    }
  };

  const handleVerification = async () => {
    if (!isSignUpLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setShowVerificationDialog(false);
        toast.success("Email verified successfully!");
      }
    } catch (err) {
      toast.error("Error during verification: " + err.message);
    }
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
                    <Label htmlFor="email-login" className="font-bold">Email</Label>
                    <Input
                      id="email-login"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login" className="font-bold">Password</Label>
                    <Input
                      id="password-login"
                      name="password"
                      type="password"
                      required
                      onChange={handleInputChange}
                    />
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
                      <Label htmlFor="firstName" className="font-bold">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-bold">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup" className="font-bold">Email</Label>
                    <Input
                      id="email-signup"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-bold">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1234567890"
                      required
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="font-bold">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="India"
                        required
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="font-bold">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        required
                        onChange={handleInputChange}
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
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>
                Enter the verification code sent to your email.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code" className="font-bold">
                  Verification Code
                </Label>
                <Input 
                  id="verification-code" 
                  name="verification-code" 
                  type="text" 
                  required 
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#c40600]" onClick={handleVerification}>
                Verify Email
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountPopUp;