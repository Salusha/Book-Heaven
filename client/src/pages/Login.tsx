// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Link, useNavigate } from "react-router-dom";
// import { Mail, Lock, Eye, EyeOff } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import axios from "axios";
// import { toast } from "@/hooks/use-toast";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const response = await axios.post("/customer/login", {
//         email,
//         password,
//       });

//       const token = response.data.token;
//       const user = response.data.user;

//       toast({
//         title: "Login Successful",
//         description: `Welcome back, ${user.name}`,
//       });

//       if (rememberMe) {
//         localStorage.setItem("token", token);
//       } else {
//         sessionStorage.setItem("token", token);
//       }

//       navigate("/wishlist");
//     } catch (error: any) {
//       toast({
//         title: "Login Failed",
//         description: error.response?.data?.message || "Something went wrong",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Navbar />

//       <div className="flex flex-1 items-center justify-center px-4 py-12">
//         <Card className="w-full max-w-md shadow-md">
//           <CardHeader>
//             <CardTitle className="text-2xl">Login to Book Heaven</CardTitle>
//             <p className="text-sm text-muted-foreground">
//               Enter your credentials to continue
//             </p>
//           </CardHeader>

//           <form onSubmit={handleLogin}>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10 pr-10"
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     onClick={() => setShowPassword((prev) => !prev)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4" />
//                     ) : (
//                       <Eye className="h-4 w-4" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between text-sm">
//                 <label className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                   />
//                   <span className="text-muted-foreground">Remember Me</span>
//                 </label>
//                 <Link
//                   to="/forgot-password"
//                   className="text-primary hover:underline"
//                 >
//                   Forgot Password?
//                 </Link>
//               </div>
//             </CardContent>

//             <CardFooter className="flex flex-col space-y-4">
//               <Button type="submit" className="w-full" disabled={loading}>
//                 {loading ? "Logging in..." : "Login"}
//               </Button>

//               <div className="text-sm text-muted-foreground text-center">
//                 Don’t have an account?{" "}
//                 <Link to="/register" className="text-primary hover:underline">
//                   Sign up
//                 </Link>
//               </div>
//             </CardFooter>
//           </form>

//         </Card>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useWishlist } from "@/contexts/WishlistContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const { refreshWishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/customer/login", {
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      toast({
        title: "🎉 Login Successful",
        description: `Welcome back, ${user.name}`,
      });

      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      // Refresh wishlist for this user
      await refreshWishlist();

      // ✅ Navigate to browse page after successful login
      navigate("/browse");
    } catch (error: any) {
      const status = error?.response?.status;
      const apiErrors = error?.response?.data?.errors;
      const detail = apiErrors?.detail || error?.response?.data?.message || "Something went wrong. Please try again.";

      if (status === 403 && (apiErrors?.title === "Email not verified" || /verify/i.test(detail))) {
        toast({
          title: "Verify Your Email",
          description: "Please verify your email before logging in. Check your inbox for the verification link.",
          variant: "destructive",
        });
        setShowResend(true);
        setPendingEmail(email);
      } else {
        toast({
          title: "Login Failed",
          description: detail,
          variant: "destructive",
        });
        setShowResend(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!pendingEmail) return;
    try {
      const res = await axios.post("/customer/resend-verification", { email: pendingEmail });
      toast({
        title: "Verification Email Resent",
        description: res.data?.message || "Please check your inbox.",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.errors?.detail || err?.response?.data?.message || "Unable to resend email.";
      toast({
        title: "Resend Failed",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">Login to Book Heaven</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-muted-foreground">Remember Me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              {showResend && (
                <div className="text-sm text-muted-foreground text-center">
                  Didn’t get the email?
                  <button
                    type="button"
                    onClick={handleResend}
                    className="ml-1 text-primary hover:underline"
                  >
                    Resend verification link
                  </button>
                </div>
              )}

              <div className="text-sm text-muted-foreground text-center">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
