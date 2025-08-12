import React from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

function Auth() {
  const [user] = useAuthState(auth);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };
  const logout = () => signOut(auth);

  return (
    <div>
      {user ? (
        <div>
          <span>Welcome, {user.displayName || user.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}
    </div>
  );
}

export default Auth;