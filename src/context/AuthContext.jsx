// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { 
  auth, 
  signInWithPopup, 
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "../firebase";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase user → MongoDB
  const syncUserToBackend = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...firebaseUser, ...res.data, token });
    } catch (err) {
      console.error("Sync failed:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserToBackend(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncUserToBackend(result.user);
      toast.success("Welcome back!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await syncUserToBackend(result.user);
      toast.success("Logged in!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const register = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await result.user.updateProfile({ displayName: name });
      await syncUserToBackend(result.user);
      toast.success("Account created!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast.success("Logged out");
  };

  const value = {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}