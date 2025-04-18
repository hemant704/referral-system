import { useRouter } from "next/router";
import { useEffect } from "react";
import { auth } from "../firebase";

const router = useRouter();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  });

  return () => unsubscribe();
}, []);

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";

<Navbar />
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
    }
  });

  return () => unsubscribe();
}, []);


export default function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        setUserData(docSnap.data());
      }
    };

    fetchData();
  }, []);

  if (!userData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome {userData.email}</h1>
      <p>Your Referral Code: {userData.referralCode}</p>
      <p>Total Points: {userData.points}</p>
      <h3>Rewards Redeemed:</h3>
      <ul>
        {userData.rewards.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}
