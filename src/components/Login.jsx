import { useState } from "react"
import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isSignup) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          role: "guest"
        });

        setSuccess("Account created! You can now log in.");
        setIsSignup(false);
      } catch (err) {
        setError("Sign up failed: " + err.message);
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userRole = userDoc.exists() ? userDoc.data().role : "guest";

        setSuccess("Login successful!");
        if (onLogin) onLogin(user, userRole);

        navigate("/");
      } catch (err) {
        setError("Login failed: " + err.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">{isSignup ? "Sign Up" : "Log In"}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          required 
          className="border px-3 py-2 rounded w-full"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
          className="border px-3 py-2 rounded w-full"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"  
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-center">
        {isSignup ? (
          <>
            <p>Already have an account?</p>
            <button onClick={() => setIsSignup(false)} className="text-blue-500 underline">Log In</button>
          </>
        ) : (
          <>
            <p>Don't have an account?</p>
            <button onClick={() => setIsSignup(true)} className="text-blue-500 underline">Sign Up</button>
          </>
        )}
      </div>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}