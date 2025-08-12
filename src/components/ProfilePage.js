import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function ProfilePage() {
  const [user] = useAuthState(auth);
  const [mySolutions, setMySolutions] = useState([]);

  useEffect(() => {
    if (!user) return;
    async function fetchMySolutions() {
      const q = query(collection(db, "solutions"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setMySolutions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchMySolutions();
  }, [user]);

  if (!user) return <div>Please login to view your profile!</div>;

  return (
    <div>
      <h2>Profile: {user.displayName || user.email}</h2>
      <div>
        <b>Total Solutions:</b> {mySolutions.length}
      </div>
      <h3>My Solutions:</h3>
      {mySolutions.map(sol => (
        <div key={sol.id} style={{border:'1px solid #ddd', margin:'8px', padding:'8px'}}>
          <b>Problem:</b> {sol.problem}<br/>
          <b>Language:</b> {sol.language}<br/>
          <b>Difficulty:</b> {sol.difficulty}<br/>
          <pre style={{background:'#f6f8fa', padding: '8px'}}>{sol.code}</pre>
        </div>
      ))}
    </div>
  );
}

export default ProfilePage;