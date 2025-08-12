import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function SolutionList() {
  const [solutions, setSolutions] = useState([]);
  const [openProblem, setOpenProblem] = useState(null);

  useEffect(() => {
    async function fetchSolutions() {
      const querySnapshot = await getDocs(collection(db, "solutions"));
      setSolutions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchSolutions();
  }, []);

  // Group by problem name
  const grouped = solutions.reduce((acc, sol) => {
    acc[sol.problem] = acc[sol.problem] || [];
    acc[sol.problem].push(sol);
    return acc;
  }, {});

  return (
    <div>
      <h2>Solutions</h2>
      {Object.keys(grouped).map(problem => (
        <div key={problem}>
          <button onClick={() => setOpenProblem(openProblem === problem ? null : problem)}>
            {problem}
          </button>
          {openProblem === problem && (
            <div>
              {grouped[problem].map(sol => (
                <div key={sol.id} style={{border:'1px solid #ddd', margin:'8px', padding:'8px'}}>
                  <b>Author:</b> {sol.author}<br/>
                  <b>Language:</b> {sol.language}<br/>
                  <b>Difficulty:</b> {sol.difficulty}<br/>
                  <b>Tags:</b> {sol.tags.join(", ")}<br/>
                  <pre style={{background:'#f6f8fa', padding: '8px'}}>{sol.code}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default SolutionList;